import { Alert, Platform } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { openSettings } from "react-native-permissions";

export const confirmViaBioAuth = async() => {
    let authResult:boolean = false;
    const { biometryType } = await ReactNativeBiometrics.isSensorAvailable();
    await ReactNativeBiometrics.simplePrompt({ promptMessage: "Confirm " + biometryType })
    .then((result) => {
        const {success} = result
        authResult =  success;
    })
    .catch((error) => {
        console.log(error);
        const errorMessage = Platform.OS === "android"? String(error).split("Error: ") : String(error).split("\"");

        Alert.alert("Biomerics error", errorMessage[1] + "\nPlease go to the settings and activate the function.", [
            {
                text: "Cancel",
                style: "cancel"
            },
            { text: "OK", onPress: () => openSettings() }
        ])

        authResult = false;
    })
    return authResult;
}

export const checkBioMetrics = async() => {
    let result = ReactNativeBiometrics.isSensorAvailable()

    .then((resultObject) => {
        const { available, biometryType } = resultObject
        
        if (available && biometryType === ReactNativeBiometrics.TouchID) {
            return true;
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
            return true;
        } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
            return true;
        } else {
            return false;
        }
    })

    return result;
}