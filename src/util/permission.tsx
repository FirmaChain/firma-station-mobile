import { Alert, Linking, Platform } from "react-native";
import { check, RESULTS, PERMISSIONS, Permission } from "react-native-permissions"
import { CAMERA_PERMISSION_ALERT } from "@/constants/common";

export const isPermissionGranted = async(permission:Permission) => {
    let granted = false;
    await check(permission)
    .then((result) => {
        if(RESULTS.DENIED === result || RESULTS.GRANTED === result){ granted = true;}
        else {granted = false}
    })
    .catch((error) => {
        console.log(error)
        granted = false;
    })

    return granted;
}

export const checkCameraPermission = async() => {
    let permission = false;
    if(Platform.OS === "ios"){
        // permission = true;
        permission = await isPermissionGranted(PERMISSIONS.IOS.CAMERA);
    } else if(Platform.OS === "android") {
        permission = await isPermissionGranted(PERMISSIONS.ANDROID.CAMERA);
    }
    if(permission === false) {

        Alert.alert(CAMERA_PERMISSION_ALERT.title, CAMERA_PERMISSION_ALERT.desc, [
            {
                text: "Cancel",
                style: "cancel",
            },
            { text: "OK", onPress: () => {Linking.openSettings()} }
        ])
        return false;
    } else {
        return true;
    }
}