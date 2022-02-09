import ReactNativeBiometrics from "react-native-biometrics";

export const confirmViaBioAuth = async(wallet?:string) => {
    let authResult:boolean = false;
    const { biometryType } = await ReactNativeBiometrics.isSensorAvailable();
    await ReactNativeBiometrics.simplePrompt({ promptMessage: "Confirm " + biometryType })
    .then((result) => {
        const {success} = result
        authResult =  success;
    })
    .catch((error) => {
        console.log(error);
        authResult = false;
    })

    return authResult;
}