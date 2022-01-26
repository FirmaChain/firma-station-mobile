import { AUTO_LOGIN_KEY_TEST, AUTO_LOGIN_NAME_TEST, BIO_AUTH_KEY_TEST, BIO_AUTH_NAME_TEST } from "@/constants/common";
import { StringDecoder } from "string_decoder";
import { decrypt, encrypt, keyEncrypt } from "./keystore";
import { getChain, setChain } from "./secureKeyChain";

const setWalletListArray = (list:string) => {
    const arr = list.split('/');
    let walletList:any[] = [];
    arr.map((item) => {
        walletList.push(item);
    })
    return walletList;
}

export const getWalletList = async() => {
    let result;
    await getChain('test_3').then(res => {
        if(res === false) return null;
        result = setWalletListArray(res.password);
    }).catch(error => {
        console.log('error : ' + error);
    })
    return result;
}

export const setNewWallet = async(name:string, password:string, mnemonic:string) => {
    const walletKey:string = keyEncrypt(name, password);
        
    const encWallet = encrypt(mnemonic, walletKey.toString());
    setChain(name, encWallet);
    let list = name;
    await getChain('test_3').then(res => {
        if(res) list += '/' + res.password;
    }).catch(error => console.log('error : ' + error));
    setChain('test_3', list);
}

export const getWalletWithAutoLogin = async() => {
    let result = '';
    await getChain(AUTO_LOGIN_NAME_TEST).then(res => {
        if(res === false) return null;
        result = decrypt(res.password, AUTO_LOGIN_KEY_TEST);
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    return result;
}

export const setWalletWithAutoLogin = async(walletInfo:any) => {
    const encWallet = encrypt(walletInfo, AUTO_LOGIN_KEY_TEST);
    console.log(encWallet);
    
    setChain(AUTO_LOGIN_NAME_TEST, encWallet);
}

export const getMnemonicViaBioAuth = async() => {
    let result = '';
    await getChain(BIO_AUTH_NAME_TEST).then(res => {
        if(res === false) return null;
        result = decrypt(res.password, BIO_AUTH_KEY_TEST);
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    return result;
}

export const setMnemonicViaBioAuth = async(mnemonic:string) => {
    const encWallet = encrypt(mnemonic, BIO_AUTH_KEY_TEST);
    setChain(BIO_AUTH_NAME_TEST, encWallet);
}