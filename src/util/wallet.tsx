import { FirmaMobileSDK } from "@firmachain/firma-js"
import { FirmaConfig } from "@firmachain/firma-js"
import { FirmaWalletService } from "@firmachain/firma-js/dist/sdk/FirmaWalletService";

const firmaSDK = new FirmaMobileSDK(FirmaConfig.DevNetConfig);

// import Wallet from "../../mockup/wallet";
// const { newWallet, getBalance, getAddressFromMnemonic } = Wallet();

export interface Wallet {
    name?: string;
    password?: string;
    mnemonic?: string;
    privatekey?: string;
}

export const createNewWallet = async() => {
    try {
        let wallet = await firmaSDK.Wallet.newWallet();
        // let wallet = await newWallet();
        return organizeWallet(wallet);
    } catch (error) {
        console.log('error : ' + error);
    }
}

export const getAdrFromMnemonic = async(mnemonic:string) => {
    try {
        let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic); 
        let address = await wallet.getAddress();
        // getAddressFromMnemonic(mnemonic);
        return address;
    } catch (error) {
        console.log('error : ' + error); 
    }
}

export const getBalanceFromAdr = async(address:string) => {
    try {
        let balance = await firmaSDK.Bank.getBalance(address);
        return balance;
    } catch (error) {
        console.log('error : ' + error); 
    }
}

const organizeWallet = async(wallet:FirmaWalletService) => {
    try {
        let _mnemonic = wallet.getMnemonic();
        let _privateKey = wallet.getPrivateKey();
        let _address = await wallet.getAddress();
        // let _balance = await firma.Bank.getBalance(_address);
        let _balance = await getBalanceFromAdr(_address);

        const result = {
            mnemonic: _mnemonic,
            privateKey: _privateKey,
            address: _address,
            balance: _balance,
        }
        return result;
    } catch (error) {
        console.log('error : ' + error);
        
    }
}

export const sendToken = async(mnemonic:string, target:string, amount:number) => {
    try {
        let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic);
        let send = await firmaSDK.Bank.send(wallet, target, amount);

        return send;
    } catch (error) {
        console.log(error);
        
    }
}
