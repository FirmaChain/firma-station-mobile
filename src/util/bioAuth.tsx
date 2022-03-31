import { Alert, Linking, Platform } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { BIOMETRICS_PERMISSION_ALERT } from "@/constants/common";
import { CommonActions } from "@/redux/actions";
import { wait } from "./common";

export const confirmViaBioAuth = async() => {
    CommonActions.handleBioAuthInProgress(true);
    let authResult:boolean = false;
    const { biometryType, available } = await ReactNativeBiometrics.isSensorAvailable();

    await ReactNativeBiometrics.simplePrompt({ promptMessage: "Confirm " + biometryType })
    .then((result) => {
        const {success} = result
        authResult =  success;
    })
    .finally(() => {
        wait(Platform.OS === "ios"? 1550 : 500).then(() => CommonActions.handleBioAuthInProgress(false));
    })
    .catch((error) => {
        console.log(error);
        wait(Platform.OS === "ios"? 1550 : 500).then(() => CommonActions.handleBioAuthInProgress(false));
        if(available === false){
            Alert.alert(BIOMETRICS_PERMISSION_ALERT.title, BIOMETRICS_PERMISSION_ALERT.desc, [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => Linking.openSettings() }
            ])
        }
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