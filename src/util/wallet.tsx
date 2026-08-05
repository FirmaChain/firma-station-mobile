import { CONNECT_ID_LIST, CONNECT_SESSION, DAPPS_SERVICE_IDENTITY, USE_BIO_AUTH, WALLET_LIST } from '@/../config';
import { IKeyValue } from '@/constants/common';
import { CommonActions, StorageActions, WalletActions } from '@/redux/actions';
import { Alert } from 'react-native';
import { getUniqueIdSync } from 'react-native-device-info';

import { checkBioMetrics } from './bioAuth';
import { getAddressFromRecoverValue, mnemonicCheck } from './firma';
import { decrypt, decryptLegacy, decryptV2, encrypt, encryptV2, isV2EncryptedEnvelope, keyEncrypt } from './keystore';
import { getChain, removeChain, setChain } from './secureKeyChain';

const UNIQUE_ID = getUniqueIdSync(); // Device identifierForVendor (IDFV)

interface IRecoverValueWithMeta {
    recoverValue: string | null;
    needsMigration: boolean;
}

interface IAutoLoginWalletInfo {
    name: string;
    address: string;
    timestamp: string;
}

const getWalletMigrationKey = (walletName: string) => `${walletName}__migrate_v2`;
const getWalletLegacyBackupKey = (walletName: string) => `${walletName}__legacy_backup_v1`;

const parseAutoLoginWalletInfo = (walletInfo: string): IAutoLoginWalletInfo | null => {
    try {
        const parsed = JSON.parse(walletInfo);

        if (typeof parsed?.name !== 'string') {
            return null;
        }

        const address = typeof parsed?.address === 'string' ? parsed.address : '';
        const timestamp = parsed?.timestamp;
        if (timestamp !== undefined && timestamp !== null && typeof timestamp !== 'string' && typeof timestamp !== 'number') {
            return null;
        }

        return {
            name: parsed.name,
            address,
            timestamp: timestamp === undefined || timestamp === null ? '' : String(timestamp)
        };
    } catch {
        return null;
    }
};

const getValidTimestamp = (value?: string): string => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    return trimmed === '' ? '' : trimmed;
};

const getRecoverValueFromEncryptedPayload = (encryptedPayload: string, key: string): IRecoverValueWithMeta => {
    if (isV2EncryptedEnvelope(encryptedPayload)) {
        const v2 = decryptV2(encryptedPayload, key);
        if (v2 !== '') {
            return { recoverValue: v2, needsMigration: false };
        }
    }

    const legacy = decryptLegacy(encryptedPayload, key);
    if (legacy !== '') {
        return { recoverValue: legacy, needsMigration: true };
    }

    return { recoverValue: null, needsMigration: false };
};

const setWalletListArray = (list: string) => {
    const arr = list.split('/');
    const walletList: string[] = [];
    arr.map((item) => {
        walletList.push(item);
    });
    return walletList;
};

export const getWalletList = async () => {
    const result = await getChain(WALLET_LIST);
    if (result === false) return null;
    const walletList = setWalletListArray(result.password);

    return walletList;
};

export const setWalletList = async (list: string) => {
    if (list === '') {
        StorageActions.handleLastSelectedWalletIndex(-1);
        await removeChain(WALLET_LIST);
    } else {
        await setChain(WALLET_LIST, list);
    }
};

export const removeWallet = async (name: string) => {
    await Promise.all([removeChain(name), removeChain(getWalletMigrationKey(name)), removeChain(getWalletLegacyBackupKey(name))]);
};

export const getRecoverValue = async (walletName: string, password: string) => {
    const result = await getRecoverValueWithMeta(walletName, password);
    return result.recoverValue;
};

export const getRecoverValueWithMeta = async (walletName: string, password: string): Promise<IRecoverValueWithMeta> => {
    const key: string = keyEncrypt(walletName, password);

    const result = await getChain(walletName);

    if (result) {
        const primary = getRecoverValueFromEncryptedPayload(result.password, key.toString());
        if (primary.recoverValue !== null) {
            return primary;
        }
    }

    const staged = await getChain(getWalletMigrationKey(walletName));
    if (staged) {
        const stagedValue = decryptV2(staged.password, key.toString());
        if (stagedValue !== '') {
            return { recoverValue: stagedValue, needsMigration: true };
        }
    }

    const backup = await getChain(getWalletLegacyBackupKey(walletName));
    if (backup) {
        const backupValue = decryptLegacy(backup.password, key.toString());
        if (backupValue !== '') {
            return { recoverValue: backupValue, needsMigration: true };
        }
    }

    return { recoverValue: null, needsMigration: false };
};

export const migrateRecoverValueToV2 = async (walletName: string, password: string, recoverValue: string) => {
    const key: string = keyEncrypt(walletName, password);
    const encrypted = encryptV2(recoverValue, key.toString());
    if (encrypted === '') {
        throw new Error('Failed to encrypt wallet data with v2.');
    }

    const backupKey = getWalletLegacyBackupKey(walletName);
    const current = await getChain(walletName);
    const backup = await getChain(backupKey);
    const backupValue = backup === false ? '' : decryptLegacy(backup.password, key.toString());

    if (backupValue !== recoverValue && current !== false) {
        const currentLegacyValue = decryptLegacy(current.password, key.toString());
        if (currentLegacyValue === recoverValue) {
            await setChain(backupKey, current.password);

            const writtenBackup = await getChain(backupKey);
            if (writtenBackup === false || decryptLegacy(writtenBackup.password, key.toString()) !== recoverValue) {
                throw new Error('Failed to back up legacy wallet data.');
            }
        }
    }

    const migrationKey = getWalletMigrationKey(walletName);
    await setChain(migrationKey, encrypted);

    const staged = await getChain(migrationKey);
    if (staged === false || isV2EncryptedEnvelope(staged.password) === false) {
        throw new Error('Failed to stage wallet data migration.');
    }

    const stagedValue = decryptV2(staged.password, key.toString());
    if (stagedValue !== recoverValue) {
        throw new Error('Wallet migration verification failed.');
    }

    await setChain(walletName, staged.password);

    const migrated = await getChain(walletName);
    if (migrated === false || isV2EncryptedEnvelope(migrated.password) === false) {
        throw new Error('Wallet migration write failed.');
    }

    const migratedValue = decryptV2(migrated.password, key.toString());
    if (migratedValue !== recoverValue) {
        throw new Error('Wallet migration verification failed after write.');
    }

    await Promise.all([removeChain(migrationKey)]).catch((error) => console.error(error));
};

export const getWalletWithAutoLogin = async () => {
    let autoLoginWallet = '';
    try {
        const result = await getChain(UNIQUE_ID);

        if (result === false) return '';
        autoLoginWallet = decrypt(result.password, UNIQUE_ID);
        return autoLoginWallet;
    } catch (error) {
        Alert.alert('Error');
        throw error;
    }
};

export const setWalletWithAutoLogin = async (walletInfo: string, timestamp?: string) => {
    const parsed = parseAutoLoginWalletInfo(walletInfo);
    if (!parsed) {
        throw new Error('Invalid wallet auto-login payload.');
    }

    const epochTimeSeconds =
        getValidTimestamp(timestamp) || getValidTimestamp(parsed.timestamp) || Math.round(new Date().getTime() / 1000).toString();
    const key = {
        name: parsed.name,
        address: parsed.address,
        timestamp: epochTimeSeconds
    };

    const payload = JSON.stringify(key);
    const encWallet = encrypt(payload, UNIQUE_ID);

    await setChain(UNIQUE_ID, encWallet);
};

export const removeDAppData = async (name: string) => {
    await Promise.all([removeDAppConnectSession(name), removeDAppProjectIdList(name), removeDAppServiceId(name)]);
};

export const removeWalletWithAutoLogin = async () => {
    const timestamp = await getAutoLoginTimestamp();
    if (timestamp) {
        await removePasswordViaBioAuthByTimestamp(timestamp);
        await removeEncryptPasswordByTimestamp(timestamp);
    }
    const walletInfo = await getWalletWithAutoLoginInfo();
    if (walletInfo?.name) {
        await removeDAppData(walletInfo.name);
    }
    await removeChain(UNIQUE_ID);
};

export const setUseBioAuth = async (name: string) => {
    // USE_BIO_AUTH_value is fixed string.
    await setChain(USE_BIO_AUTH + name, 'true');
};

export const getUseBioAuth = async (name: string) => {
    try {
        const useBioAuth = await getChain(USE_BIO_AUTH + name);
        if (useBioAuth) {
            return Boolean(useBioAuth.password);
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const removeUseBioAuth = async (name: string) => {
    await removeChain(USE_BIO_AUTH + name).catch((error) => console.error(error));
};

export const setBioAuth = async (name: string, password: string) => {
    const result = await getUseBioAuth(name);
    if (result) {
        await setPasswordViaBioAuth(password);
    }
};

export const getAutoLoginTimestamp = async (): Promise<string> => {
    try {
        const result = await getWalletWithAutoLoginInfo();
        if (result === null) return '';

        const timestamp = result.timestamp;
        if (typeof timestamp !== 'string' && typeof timestamp !== 'number') return '';

        return String(timestamp);
    } catch (e) {
        console.error(e);
        return '';
    }
};

export const getWalletWithAutoLoginInfo = async (): Promise<IAutoLoginWalletInfo | null> => {
    const result = await getWalletWithAutoLogin();
    if (result === '') return null;

    return parseAutoLoginWalletInfo(result);
};

export const getPasswordViaBioAuth = async () => {
    const timestamp = await getAutoLoginTimestamp();
    if (!timestamp) return '';

    const passwordResult = await getChain(UNIQUE_ID + timestamp);
    if (passwordResult === false) return '';

    return decrypt(passwordResult.password, UNIQUE_ID + timestamp);
};

// Save encrypted password
export const setPasswordViaBioAuth = async (password: string) => {
    const timestamp = await getAutoLoginTimestamp();
    if (!timestamp) return '';

    const encWallet = encrypt(password, UNIQUE_ID + timestamp);

    // Save encrypted password to Keychain
    await setChain(UNIQUE_ID + timestamp, encWallet);
};

export const getDecryptPassword = async () => {
    const timestamp = await getAutoLoginTimestamp();
    if (!timestamp) return '';

    const passwordResult = await getChain(timestamp + UNIQUE_ID);
    if (passwordResult === false) return '';
    return decrypt(passwordResult.password, timestamp + UNIQUE_ID);
};

export const setEncryptPassword = async (password: string) => {
    const timestamp = await getAutoLoginTimestamp();
    if (!timestamp) return '';

    const encWallet = encrypt(password, timestamp + UNIQUE_ID);
    await setChain(timestamp + UNIQUE_ID, encWallet);
};

export const setWalletWithBioAuth = async (name: string, password: string, recoverValue: string) => {
    const loadingRequestId = CommonActions.beginLoadingProgress();

    let oldWalletList: string[] | null = null;

    try {
        const oldTimestamp = await getAutoLoginTimestamp();
        oldWalletList = await getWalletList();

        // 1. Write the wallet secret and verify
        await writeWalletSecretOnly(name, password, recoverValue);

        // 2. Auto-login and password encrypt
        let address = null;
        const resultAdr = await getAddressFromRecoverValue(recoverValue);
        if (resultAdr !== undefined) address = resultAdr;

        await setWalletWithAutoLogin(
            JSON.stringify({
                name: name,
                address: address === null ? '' : address
            })
        );

        await setEncryptPassword(password);
        await setBioAuth(name, password);

        // 3. Add to wallet list after the new secret and pointers are readable.
        const chainList = await getChain(WALLET_LIST);
        let list = name;
        if (chainList) list += '/' + chainList.password;
        await setWalletList(list);

        if (oldTimestamp) {
            await removePasswordViaBioAuthByTimestamp(oldTimestamp);
            await removeEncryptPasswordByTimestamp(oldTimestamp);
        }

        WalletActions.handleWalletName(name);
        WalletActions.handleWalletAddress(address === null ? '' : address);

        const result = await checkBioMetrics();

        return result;
    } catch (error) {
        try {
            const newTimestamp = await getAutoLoginTimestamp();
            if (newTimestamp) {
                await removePasswordViaBioAuthByTimestamp(newTimestamp);
                await removeEncryptPasswordByTimestamp(newTimestamp);
            }
            await removeWallet(name);

            if (oldWalletList) {
                await setWalletList(oldWalletList.join('/'));
            } else {
                await setWalletList('');
            }
        } catch (rollbackError) {
            console.error(rollbackError);
        }

        throw error;
    } finally {
        CommonActions.endLoadingProgress(loadingRequestId);
    }
};

export const setDAppConnectSession = async (name: string, session: string) => {
    const encSession = encrypt(session, UNIQUE_ID + name);
    await setChain(CONNECT_SESSION + name, encSession);
};

export const getDAppConnectSession = async (name: string) => {
    try {
        const result = await getChain(CONNECT_SESSION + name);

        if (result === false) return null;

        const session = decrypt(result.password, UNIQUE_ID + name);
        return session === '' ? null : session;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const removeDAppConnectSession = async (name: string) => {
    await removeChain(CONNECT_SESSION + name);
};

export const setDAppProjectIdList = async (name: string, key: string, list: string) => {
    const encList = encrypt(list, CONNECT_ID_LIST + key + '_' + name);
    await setChain(CONNECT_ID_LIST + name, encList);
};

export const getDAppProjectIdList = async (name: string, key: string) => {
    let list = null;

    const result = await getChain(CONNECT_ID_LIST + name);
    if (result === false) return null;
    list = decrypt(result.password, CONNECT_ID_LIST + key + '_' + name);
    return list;
};

export const removeDAppProjectIdList = async (name: string) => {
    await removeChain(CONNECT_ID_LIST + name);
};

export const setDAppServiceId = async (name: string, value: string) => {
    const encList = encrypt(value, DAPPS_SERVICE_IDENTITY + '_' + name + '_' + UNIQUE_ID);
    await setChain(DAPPS_SERVICE_IDENTITY + name, encList);
};

export const getDAppServiceId = async (name: string) => {
    let list = null;

    const result = await getChain(DAPPS_SERVICE_IDENTITY + name);
    if (result === false) return null;
    list = decrypt(result.password, DAPPS_SERVICE_IDENTITY + '_' + name + '_' + UNIQUE_ID);
    return list;
};

export const removeDAppServiceId = async (name: string) => {
    await removeChain(DAPPS_SERVICE_IDENTITY + name);
};

export const setRecoverType = async (typeList: IKeyValue | undefined, recoverValue: string, address: string) => {
    try {
        const isMnemonic = await mnemonicCheck(recoverValue);
        const recoverType = isMnemonic ? 'mnemonic' : 'privateKey';

        if (typeList === undefined) {
            StorageActions.handleRecoverType({
                [`${address}`]: recoverType
            });
        } else {
            StorageActions.handleRecoverType({
                ...typeList,
                [`${address}`]: recoverType
            });
        }
    } catch (error) {
        console.error(error);
    }
};

export const removeRecoverType = (typeList: IKeyValue | undefined, address: string) => {
    if (typeList !== undefined) {
        const recoverTypeList = { ...typeList };
        delete recoverTypeList[`${address}`];

        StorageActions.handleRecoverType(recoverTypeList);
    }
};

export const writeWalletSecretOnly = async (name: string, password: string, recoverValue: string) => {
    const walletKey: string = keyEncrypt(name, password);
    const encWallet = encrypt(recoverValue, walletKey.toString());
    if (encWallet === '') {
        throw new Error('Failed to encrypt wallet data.');
    }

    await setChain(name, encWallet);

    const written = await getChain(name);
    if (written === false) {
        throw new Error('Failed to write wallet data.');
    }

    const verified = getRecoverValueFromEncryptedPayload(written.password, walletKey.toString());
    if (verified.recoverValue !== recoverValue) {
        throw new Error('Wallet write verification failed.');
    }
};

export const removePasswordViaBioAuthByTimestamp = async (timestamp: string) => {
    try {
        if (timestamp) await removeChain(UNIQUE_ID + timestamp);
    } catch (error) {
        console.error(error);
    }
};

export const removeEncryptPasswordByTimestamp = async (timestamp: string) => {
    try {
        if (timestamp) await removeChain(timestamp + UNIQUE_ID);
    } catch (error) {
        console.error(error);
    }
};
