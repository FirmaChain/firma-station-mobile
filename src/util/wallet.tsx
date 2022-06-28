import { CommonActions, WalletActions } from "@/redux/actions";
import { getUniqueId } from "react-native-device-info";
import { getAdrFromMnemonic } from "./firma";
import { checkBioMetrics } from "./bioAuth";
import { decrypt, encrypt, keyEncrypt } from "./keystore";
import { getChain, removeChain, setChain } from "./secureKeyChain";
import { USE_BIO_AUTH, WALLET_LIST } from "@/../config";

const UNIQUE_ID = getUniqueId();

const setWalletListArray = (list:string) => {
    const arr = list.split('/');
    let walletList:any[] = [];
    arr.map((item) => {
        walletList.push(item);
    })
    return walletList;
}

export const getWalletList = async() => {
    try {
        let walletList;
        const result = await getChain(WALLET_LIST);
        if(result === false) return null;
        walletList = setWalletListArray(result.password);

        return walletList;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const setNewWallet = async(name:string, password:string, mnemonic:string, makeList:boolean) => {
    try {
        const walletKey:string = keyEncrypt(name, password);
        const encWallet = encrypt(mnemonic, walletKey.toString());
        await setChain(name, encWallet);

        if(makeList){
            let list = name;
            const result = await getChain(WALLET_LIST);
            if(result) list += '/' + result.password;

            await setWalletList(list)
        }

        let adr = null;
        const result = await getAdrFromMnemonic(mnemonic);
        if(result !== undefined) adr = result;

        await setWalletWithAutoLogin(JSON.stringify({
            name: name,
            address: adr,
        }));
        await setEncryptPassword(password);

        const useBioAuth = await getUseBioAuth(name);
        if(useBioAuth){
            await setPasswordViaBioAuth(password);
        }
        return adr;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const setWalletList = async(list:string) => {
    try {
        if(list === ''){
            await removeChain(WALLET_LIST);
        } else {
            await setChain(WALLET_LIST, list);
        }
    } catch (error) {
        throw error;
    }
}

export const removeWallet = async(name:string) => {
    try {
        await removeChain(name);
    } catch (error) {
        throw error;
    }
}

export const getMnemonic = async(walletName: string, password: string) => {
    let mnemonic = null;
    const key:string = keyEncrypt(walletName, password);
    try {
        const result = await getChain(walletName);
        if(result){
            let w = decrypt(result.password, key.toString());
            if(w.split(" ").length === 24) {
                mnemonic = w;
            }
        }
        return mnemonic;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getWalletWithAutoLogin = async() => {
    let uniqueId = "";
    try {
        const result = await getChain(UNIQUE_ID);
        if(result === false) return "";
        uniqueId = decrypt(result.password, UNIQUE_ID);
        return uniqueId;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const setWalletWithAutoLogin = async(walletInfo:string) => {
    try {
        let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
        let key = {
            ...JSON.parse(walletInfo),
            timestamp: epochTimeSeconds
        }
        
        let payload = JSON.stringify(key);
        const encWallet = encrypt(payload, UNIQUE_ID);
        
        await setChain(UNIQUE_ID, encWallet);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const removeWalletWithAutoLogin = async() => {
    try {
        await removeChain(UNIQUE_ID);
    } catch (error) {
        throw error;
    }
}

export const setUseBioAuth = async(name:string) => {
    await setChain(USE_BIO_AUTH + name, "true");
}

export const getUseBioAuth = async(name:string) => {
    let result = false;
    try {
        const useBioAuth = await getChain(USE_BIO_AUTH + name);
        if(useBioAuth){
            result = Boolean(useBioAuth.password);
        } else {
            result = false;
        }
    } catch (error) {
        console.log(error);
    }
    
    return result;
}

export const removeUseBioAuth = async(name:string) => {
    try {
        await removeChain(USE_BIO_AUTH + name)
                .catch(error => console.log(error));
    } catch (error) {
        throw error;
    }
}

export const setBioAuth = async(name:string, password:string) => {
    try {
        const result = await getUseBioAuth(name);
        if(result){
            await setPasswordViaBioAuth(password);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getPasswordViaBioAuth = async() => {
    let timestamp = 0;
    let password = "";
    try {
        const result = await getWalletWithAutoLogin();
        if(result === "") return "";
        const json = JSON.parse(result);
        timestamp = json.timestamp;

        const passwordResult = await getChain(UNIQUE_ID + timestamp.toString());
        if(passwordResult === false) return "";
        password = decrypt(passwordResult.password, UNIQUE_ID + timestamp.toString());
        return password;
    } catch (error) {
        throw error;
    }
}

export const setPasswordViaBioAuth = async(password:string) => {
    let timestamp = 0;
    try {
        const result = await getWalletWithAutoLogin();
        if(result === "") return "";
        const json = JSON.parse(result);
        timestamp = json.timestamp;

        const encWallet = encrypt(password, UNIQUE_ID + timestamp.toString());
        setChain(UNIQUE_ID + timestamp.toString(), encWallet);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const removePasswordViaBioAuth = async() => {
    let timestamp = 0;
    try {
        const result = await getWalletWithAutoLogin();
        if(result === "") return "";
        const json = JSON.parse(result);
        timestamp = json.timestamp;

        await removeChain(UNIQUE_ID + timestamp.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getDecryptPassword = async() => {
    let timestamp = 0;
    let password = "";
    try {
        const result = await getWalletWithAutoLogin();
        if(result === "") return "";
        const json = JSON.parse(result);
        timestamp = json.timestamp;

        const passwordResult = await getChain(timestamp.toString() + UNIQUE_ID);
        if(passwordResult === false) return "";
        password = decrypt(passwordResult.password, timestamp.toString() + UNIQUE_ID);
        return password;
    } catch (error) {
        throw error;
    }
}

export const setEncryptPassword = async(password:string) => {
    let timestamp = 0;
    try {
        const result = await getWalletWithAutoLogin();
        if(result === "") return "";
        const json = JSON.parse(result);
        timestamp = json.timestamp;

        const encWallet = encrypt(password, timestamp.toString() + UNIQUE_ID);
        setChain(timestamp.toString() + UNIQUE_ID, encWallet);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const setWalletWithBioAuth = async(name:string, password:string, mnemonic:string) => {
    try {
        CommonActions.handleLoadingProgress(true);
        const address = await setNewWallet(name, password, mnemonic, true);
        await setWalletWithAutoLogin(JSON.stringify({
            name: name,
            address: address,
        }));
    
        await setEncryptPassword(password);
        setBioAuth(name, password);
    
        WalletActions.handleWalletName(name);
        WalletActions.handleWalletAddress(address === null? "" : address);
    
        const result = await checkBioMetrics();
        
        return result;
    } catch (error) {
        CommonActions.handleLoadingProgress(false);
        throw error;
    }
}