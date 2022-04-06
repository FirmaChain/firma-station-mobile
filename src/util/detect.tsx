import JailMonkey from 'jail-monkey';
import { WALLET_LIST } from '@/../config';
import { removeChain } from './secureKeyChain';
import { getWalletList, removePasswordViaBioAuth, removeUseBioAuth, removeWallet, removeWalletWithAutoLogin } from './wallet';

export const Detect = () => {
    const jail = JailMonkey.isJailBroken();

    return false;
}

export const removeAllData = async() => {
    let list: Array<any> = [];
    removeWalletWithAutoLogin();
    await removePasswordViaBioAuth();
    
    await getWalletList().then(res => {if(res){list = res;}});
    if(list){
        list.map(async(value) => {
            await removeWallet(value);
            await removeUseBioAuth(value);
        })
    }
    await removeChain(WALLET_LIST);
}