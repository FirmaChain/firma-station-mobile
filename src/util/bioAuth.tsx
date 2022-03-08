import { BIOMETRICS_PERMISSION_ALERT } from "@/constants/common";
import { Alert, Platform } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { openSettings, PERMISSIONS } from "react-native-permissions";
import { isPermissionGranted } from "./permission";

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
        Alert.alert(BIOMETRICS_PERMISSION_ALERT.title, BIOMETRICS_PERMISSION_ALERT.desc, [
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