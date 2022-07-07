import { Alert, Linking, Platform } from "react-native";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { BIOMETRICS_PERMISSION_ALERT } from "@/constants/common";
import { CommonActions } from "@/redux/actions";
import { wait } from "./common";

export const confirmViaBioAuth = async() => {
    CommonActions.handleBioAuthInProgress(true);
    let authResult:boolean = false;
    const rnBiometrics = new ReactNativeBiometrics();
    const { biometryType, available } = await rnBiometrics.isSensorAvailable();

    try {
        const result = await rnBiometrics.simplePrompt({ promptMessage: "Confirm " + biometryType });
        wait(Platform.OS === "ios"? 1550 : 500).then(() => CommonActions.handleBioAuthInProgress(false));
        authResult = result.success;
    } catch (error) {
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
    }

    return authResult;
}

export const checkBioMetrics = async() => {
    const rnBiometrics = new ReactNativeBiometrics();
    let result = rnBiometrics.isSensorAvailable()
    .then((resultObject) => {
        const { available, biometryType } = resultObject
        if (available && biometryType === BiometryTypes.TouchID) {
            return true;
        } else if (available && biometryType === BiometryTypes.FaceID) {
            return true;
        } else if (available && biometryType === BiometryTypes.Biometrics) {
            return true;
        } else {
            return false;
        }
    })

    return result;
}