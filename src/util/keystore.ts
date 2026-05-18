import { decryptLegacy, encryptLegacy, getRandomKey, keyEncrypt } from './keystoreLegacy';
import { decryptV2, encryptV2, isV2EncryptedEnvelope } from './keystoreV2';

export { decryptLegacy, decryptV2, encryptLegacy, encryptV2, getRandomKey, isV2EncryptedEnvelope, keyEncrypt };

export const encrypt = (originalMessage: string, pass: string): string => {
    // maybeLogEncryptionPerformance(originalMessage, pass);
    return encryptV2(originalMessage, pass);
};

export const decrypt = (encryptedMessage: string, pass: string): any => {
    if (isV2EncryptedEnvelope(encryptedMessage)) {
        return decryptV2(encryptedMessage, pass);
    }
    return decryptLegacy(encryptedMessage, pass);
};

//? Benchmark Encryption Performance
// const maybeLogEncryptionPerformance = (message: string, pass: string) => {
//     try {
//         const legacyStart = Date.now();
//         const legacyResult = encryptLegacy(message, pass);
//         const legacyMs = Date.now() - legacyStart;

//         const v2Start = Date.now();
//         const v2Result = encryptV2(message, pass);
//         const v2Ms = Date.now() - v2Start;

//         console.log(
//             `[keystore] encrypt benchmark legacy=${legacyMs}ms v2=${v2Ms}ms legacy_ok=${legacyResult !== ''} v2_ok=${v2Result !== ''}`
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };
