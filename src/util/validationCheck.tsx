import { getChain } from "./secureKeyChain";

export async function WalletNameValidationCheck(name:string) {
    const result = await getChain(name);
    return result;
}

export function PasswordValidationCheck(password:string) {
    // const result = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/.test(password);
    const result = password.length >= 10;
    return result;
}