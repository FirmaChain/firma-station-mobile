import { USE_BIO_AUTH, WALLET_LIST } from "@/constants/common";
import { getUniqueId } from "react-native-device-info";
import { getAdrFromMnemonic } from "./firma";
import { decrypt, encrypt, keyEncrypt } from "./keystore";
import { getChain, setChain } from "./secureKeyChain";

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
    let result;
    await getChain(WALLET_LIST).then(res => {
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
    await getChain(WALLET_LIST).then(res => {
        if(res) list += '/' + res.password;
    }).catch(error => console.log('error : ' + error));
    setChain(WALLET_LIST, list);

    let adr = null;
    await getAdrFromMnemonic(mnemonic).then(res => {
        if(res !== undefined) adr = res;
    }).catch(error => console.log('error : ' + error));

    await setWalletWithAutoLogin(JSON.stringify({
        walletName: name,
        address: adr,
    }));

    const useBioAuth = await getUseBioAuth();
    if(useBioAuth){
        await setPasswordViaBioAuth(password);
    }

    return adr;
}

export const getWalletWithAutoLogin = async() => {
    let result = '';
    await getChain(UNIQUE_ID).then(res => {
        if(res === false) return null;
        result = decrypt(res.password, UNIQUE_ID);
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    return result;
}

export const setWalletWithAutoLogin = async(walletInfo:string) => {
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
    let key = {
        ...JSON.parse(walletInfo),
        timestamp: epochTimeSeconds
    }
    
    let payload = JSON.stringify(key);
    const encWallet = encrypt(payload, UNIQUE_ID);
    
    setChain(UNIQUE_ID, encWallet);
}

export const setUseBioAuth = (state:boolean) => {
    setChain(USE_BIO_AUTH, state.toString());
}

export const getUseBioAuth = async() => {
    let result = false;
    await getChain(USE_BIO_AUTH).then(res => {
        if(res){
            if(res.password === 'true') result = true;
            if(res.password === 'false') result = false;
        }
    }).catch(error => {
        console.log(error);
    })
    
    return result;
}

export const getPasswordViaBioAuth = async() => {
    let timestamp = 0;
    await getWalletWithAutoLogin().then(res => {
        if('') return null;
        const result = JSON.parse(res);
        timestamp = result.timestamp;
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    let result = '';
    await getChain(UNIQUE_ID + timestamp.toString()).then(res => {
        if(res === false) return null;
        result = decrypt(res.password, UNIQUE_ID + timestamp.toString());
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    return result;
}

export const setPasswordViaBioAuth = async(password:string) => {
    let timestamp = 0;
    await getWalletWithAutoLogin().then(res => {
        if('') return null;
        const result = JSON.parse(res);
        timestamp = result.timestamp;
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    const encWallet = encrypt(password, UNIQUE_ID + timestamp.toString());
    setChain(UNIQUE_ID + timestamp.toString(), encWallet);
}