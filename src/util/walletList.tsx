import { getChain } from "./secureKeyChain";

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