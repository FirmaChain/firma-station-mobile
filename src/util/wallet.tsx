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
    let result;
    await getChain(WALLET_LIST).then(res => {
        if(res === false) return null;
        result = setWalletListArray(res.password);
    }).catch(error => {
        console.log('error : ' + error);
    })
    return result;
}

export const setNewWallet = async(name:string, password:string, mnemonic:string, makeList:boolean) => {
    const walletKey:string = keyEncrypt(name, password);
        
    const encWallet = encrypt(mnemonic, walletKey.toString());
    setChain(name, encWallet);
    if(makeList){
        let list = name;
        await getChain(WALLET_LIST).then(res => {
            if(res) list += '/' + res.password;
        }).catch(error => console.log('error : ' + error));
        setWalletList(list)
    }

    let adr = null;
    await getAdrFromMnemonic(mnemonic).then(res => {
        if(res !== undefined) adr = res;
    }).catch(error => console.log('error : ' + error));

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
}

export const setWalletList = (list:string) => {
    if(list === ''){
        removeChain(WALLET_LIST);
    } else {
        setChain(WALLET_LIST, list);
    }
}

export const removeWallet = async(name:string) => {
    await removeChain(name)
    .then(res => console.log(res))
    .catch(error => console.log(error));
}

export const getWallet = async(name:string, password:string) => {
    const walletKey:string = keyEncrypt(name, password);
    let result = '';
    await getChain(name).then(res => {
        if(res === false) return null;
        result = decrypt(res.password, walletKey); 
    }).catch(error => {
        console.log(error);
        return null;
    })
    
    return result;
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
    let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
    let key = {
        ...JSON.parse(walletInfo),
        timestamp: epochTimeSeconds
    }
    
    let payload = JSON.stringify(key);
    const encWallet = encrypt(payload, UNIQUE_ID);
    
    setChain(UNIQUE_ID, encWallet);
}

export const removeWalletWithAutoLogin = () => {
    removeChain(UNIQUE_ID);
}

export const setUseBioAuth = (name:string) => {
    setChain(USE_BIO_AUTH + name, "true");
}

export const getUseBioAuth = async(name:string) => {
    let result = false;
    await getChain(USE_BIO_AUTH + name).then(res => {
        if(res){
            if(res.password === 'true') result = true;
            if(res.password === 'false') result = false;
        } else {
            result = false;
        }
    }).catch(error => {
        console.log(error);
    })
    
    return result;
}

export const removeUseBioAuth = async(name:string) => {
    await removeChain(USE_BIO_AUTH + name)
            .then(res => console.log(res))
            .catch(error => console.log(error));
}

export const setBioAuth = async(name:string, password:string) => {
    const result = await getUseBioAuth(name);
    if(result){
        await setPasswordViaBioAuth(password);
    }
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

export const removePasswordViaBioAuth = async() => {
    let timestamp = 0;
    await getWalletWithAutoLogin().then(res => {
        if('') return null;
        const result = JSON.parse(res);
        timestamp = result.timestamp;
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })
    await removeChain(UNIQUE_ID + timestamp.toString())
    .then(res => console.log(res))
    .catch(error => console.log(error));
}

export const getDecryptPassword = async() => {
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
    await getChain(timestamp.toString() + UNIQUE_ID).then(res => {
        if(res === false) return null;
        result = decrypt(res.password, timestamp.toString() + UNIQUE_ID);
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    return result;
}

export const setEncryptPassword = async(password:string) => {
    let timestamp = 0;
    await getWalletWithAutoLogin().then(res => {
        if('') return null;
        const result = JSON.parse(res);
        timestamp = result.timestamp;
    }).catch(error => {
        console.log('error : ' + error);
        return null;
    })

    const encWallet = encrypt(password, timestamp.toString() + UNIQUE_ID);
    setChain(timestamp.toString() + UNIQUE_ID, encWallet);
}

export const setWalletWithBioAuth = async(name:string, password:string, mnemonic:string) => {
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
}
