import { convertNumber } from './common';
import { getChain } from './secureKeyChain';
import { getRecoverValue } from './wallet';

export async function WalletNameValidationCheck(name: string) {
    const result = await getChain(name);
    return result;
}

export function PasswordValidationCheck(password: string) {
    // const result = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/.test(password);
    const result = password.length >= 10;
    return result;
}

export const PasswordCheck = async (walletName: string, password: string) => {
    try {
        if (password.length >= 10) {
            let nameCheck = await WalletNameValidationCheck(walletName);

            let recoverValue = null;
            if (nameCheck) {
                recoverValue = await getRecoverValue(walletName, password);
            }
            return recoverValue;
        }
    } catch (error) {
        throw error;
    }
};

export const VersionCheck = (server: string, app: string) => {
    const serverVer = server.split('.');
    const appVer = app.split('.');

    for (let i = serverVer.length - 1; i >= 0; i--) {
        if (convertNumber(serverVer[i]) > convertNumber(appVer[i])) {
            return false;
        }
    }
    return true;
};
