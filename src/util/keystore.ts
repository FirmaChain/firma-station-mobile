import CryptoJS from 'crypto-js';

const keySize = 256;
const iterations = 100;

export const getRandomKey = () => {
    return Math.floor(new Date().valueOf() * Math.random())
        .toString()
        .padStart(40, Math.random().toString(36).substring(2, 13));
};

export const keyEncrypt = (name: string, password: string): string => {
    try {
        const key = CryptoJS.enc.Utf8.parse(password);
        const iv = CryptoJS.enc.Utf8.parse(name);

        var encObj = CryptoJS.AES.encrypt('key', key, { iv: iv });

        return encObj.toString();
    } catch (error) {
        console.log(error);
        return '';
    }
};

export const encrypt = (originalMessage: string, pass: string): string => {
    try {
        const salt = CryptoJS.lib.WordArray.random(128 / 8);
        const key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        const iv = CryptoJS.lib.WordArray.random(128 / 8);

        const encrypted = CryptoJS.AES.encrypt(originalMessage, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        });

        return salt.toString() + iv.toString() + encrypted.toString();
    } catch (error) {
        console.log(error);
        return '';
    }
};

export const decrypt = (encryptedMessage: string, pass: string): any => {
    try {
        if (encryptedMessage.length < 64) {
            throw new Error("Invalid encrypted message length.");
        }

        const salt = CryptoJS.enc.Hex.parse(encryptedMessage.substring(0, 32));
        const iv = CryptoJS.enc.Hex.parse(encryptedMessage.substring(32, 64));
        const encrypted = encryptedMessage.substring(64);

        const key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }).toString(CryptoJS.enc.Utf8);

        if (!decrypted) {
            throw new Error("Decryption failed.");
        }

        return decrypted;
    } catch (error) {
        console.log(error);
        return '';
    }
};
