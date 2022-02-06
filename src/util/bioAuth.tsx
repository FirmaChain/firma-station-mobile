import ReactNativeBiometrics from "react-native-biometrics";
import { getUniqueId } from "react-native-device-info";

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

    if(authResult){
        let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
        let payload = wallet + epochTimeSeconds + getUniqueId();
        console.log(payload);
    }
}