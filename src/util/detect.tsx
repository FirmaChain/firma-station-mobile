import JailMonkey from 'jail-monkey';
import { WALLET_LIST } from '@/../config';
import { removeChain } from './secureKeyChain';
import { getWalletList, removePasswordViaBioAuth, removeUseBioAuth, removeWallet, removeWalletWithAutoLogin } from './wallet';

export const Detect = () => {
    const jail = JailMonkey.isJailBroken();
    return jail;
    // return false;
};

export const removeAllData = async () => {
    let list: Array<any> = [];
    try {
        await removeWalletWithAutoLogin();
        await removePasswordViaBioAuth();

        const result = await getWalletList();
        if (result) {
            list = result;
        }

        if (list) {
            list.map(async value => {
                await removeWallet(value);
                await removeUseBioAuth(value);
            });
        }
        await removeChain(WALLET_LIST);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
