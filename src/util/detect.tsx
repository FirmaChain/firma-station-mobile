import { WALLET_LIST } from '@/../config';
import JailMonkey from 'jail-monkey';

import { removeChain } from './secureKeyChain';
import { getWalletList, removeUseBioAuth, removeWallet, removeWalletWithAutoLogin } from './wallet';

export const Detect = () => {
    const jail = JailMonkey.isJailBroken();
    return jail;
};

export const removeAllData = async () => {
    try {
        await removeWalletWithAutoLogin();

        const result = (await getWalletList()) ?? [];

        await Promise.all(
            result?.map(async (value) => {
                await removeWallet(value);
                await removeUseBioAuth(value);
            })
        );

        await removeChain(WALLET_LIST);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
