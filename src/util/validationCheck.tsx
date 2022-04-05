import { getChain } from "./secureKeyChain";
import { getMnemonic } from "./wallet";

export async function WalletNameValidationCheck(name:string) {
    const result = await getChain(name);
    return result;
}

export function PasswordValidationCheck(password:string) {
    // const result = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/.test(password);
    const result = password.length >= 10;
    return result;
}

export const PasswordCheck = async(walletName: string, password: string) => {
    if(password.length >= 10){
        let nameCheck = await WalletNameValidationCheck(walletName);
        
        let mnemonic = null;
        if(nameCheck){
            mnemonic = await getMnemonic(walletName, password);
        } 
        return mnemonic;
    }
}
