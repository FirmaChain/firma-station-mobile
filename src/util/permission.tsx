import { CAMERA_PERMISSION_ALERT } from "@/constants/common";
import { Alert, Platform } from "react-native";
import { Permission, check, RESULTS, PERMISSIONS, openSettings } from "react-native-permissions"

export const isPermissionGranted = async(permission:Permission) => {
    let granted = false;
    await check(permission)
    .then((result) => {
        granted = (RESULTS.GRANTED === result)
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
            { text: "OK", onPress: () => {openSettings()} }
        ])
        return false;
    } else {
        return true;
    }
}