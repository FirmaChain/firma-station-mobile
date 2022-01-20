import { encrypt, keyEncrypt } from "./keystore";
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