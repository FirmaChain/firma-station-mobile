import * as Keychain from 'react-native-keychain';

export const setChain = async(key:string, value:string) => {
    await Keychain.setInternetCredentials(key, key, value);
}

export const getChain = async(key:string) => {
    const chain = await Keychain.getInternetCredentials(key);
    return chain;
}

export const removeChain = async(key:string) => {
    const result = await Keychain.resetInternetCredentials(key);
    return result;
}

export const hasChain = async(key:string) => {
    const chain = await Keychain.hasInternetCredentials(key);
    return chain;
}

export const setGeneric = async(name:string, password:string) => {
    await Keychain.setGenericPassword(name, password);
}