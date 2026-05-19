import { Buffer } from '@craftzdog/react-native-buffer';
import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'react-native-quick-crypto';

const V2_ITERATIONS = 2000;
const V2_KEY_BYTES = 32;
const V2_SALT_BYTES = 16;
const V2_IV_BYTES = 12;
const V2_TAG_BYTES = 16;

interface IEncryptV2Envelope {
    v: 2;
    kdf: 'pbkdf2-sha256';
    iter: number;
    salt: string;
    iv: string;
    tag: string;
    ct: string;
}

export const encryptV2 = (originalMessage: string, pass: string): string => {
    try {
        const salt = randomBytes(V2_SALT_BYTES);
        const iv = randomBytes(V2_IV_BYTES);
        const key = pbkdf2Sync(pass, salt, V2_ITERATIONS, V2_KEY_BYTES, 'sha256');

        const cipher = createCipheriv('aes-256-gcm', key, iv);
        const encryptedBuffer = Buffer.concat([cipher.update(originalMessage, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        const payload: IEncryptV2Envelope = {
            v: 2,
            kdf: 'pbkdf2-sha256',
            iter: V2_ITERATIONS,
            salt: salt.toString('base64'),
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
            ct: encryptedBuffer.toString('base64')
        };

        return JSON.stringify(payload);
    } catch (error) {
        console.log(error);
        return '';
    }
};

export const decryptV2 = (encryptedMessage: string, pass: string): string => {
    try {
        const payload = parseEncryptV2Envelope(encryptedMessage);
        if (payload === null) {
            throw new Error('Invalid v2 encrypted payload.');
        }

        const salt = Buffer.from(payload.salt, 'base64');
        const iv = Buffer.from(payload.iv, 'base64');
        const tag = Buffer.from(payload.tag, 'base64');
        const cipherText = Buffer.from(payload.ct, 'base64');

        const key = pbkdf2Sync(pass, salt, payload.iter, V2_KEY_BYTES, 'sha256');
        const decipher = createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]).toString('utf8');

        if (!decrypted) {
            throw new Error('Decryption failed.');
        }

        return decrypted;
    } catch (error) {
        console.log(error);
        return '';
    }
};

export const isV2EncryptedEnvelope = (value: string): boolean => {
    try {
        const parsed = JSON.parse(value);
        return parsed !== null && typeof parsed === 'object' && parsed.v === 2;
    } catch {
        return false;
    }
};

const parseEncryptV2Envelope = (value: string): IEncryptV2Envelope | null => {
    try {
        const parsed = JSON.parse(value);
        if (parsed === null || typeof parsed !== 'object') return null;
        if (parsed.v !== 2) return null;
        if (parsed.kdf !== 'pbkdf2-sha256') return null;
        if (parsed.iter !== V2_ITERATIONS) return null;
        if (typeof parsed.salt !== 'string') return null;
        if (typeof parsed.iv !== 'string') return null;
        if (typeof parsed.tag !== 'string') return null;
        if (typeof parsed.ct !== 'string') return null;
        if (!isBase64WithByteLength(parsed.salt, V2_SALT_BYTES)) return null;
        if (!isBase64WithByteLength(parsed.iv, V2_IV_BYTES)) return null;
        if (!isBase64WithByteLength(parsed.tag, V2_TAG_BYTES)) return null;
        if (!isBase64WithByteLength(parsed.ct)) return null;
        return parsed as IEncryptV2Envelope;
    } catch {
        return null;
    }
};

const isBase64WithByteLength = (value: string, byteLength?: number) => {
    if (value === '' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
        return false;
    }

    const decoded = Buffer.from(value, 'base64');
    return byteLength === undefined ? decoded.length > 0 : decoded.length === byteLength;
};
