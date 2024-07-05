import { Alert, Linking, Platform } from "react-native";
import { check, RESULTS, PERMISSIONS, Permission, PermissionStatus, request } from "react-native-permissions"
import { CAMERA_PERMISSION_ALERT } from "@/constants/common";

export const isPermissionGranted = async(permission:Permission) => {
    let granted = false;
    let requested: PermissionStatus;
    const checked = await check(permission);
    switch (checked) {
        case RESULTS.GRANTED:
            granted = true;
            break;
        case RESULTS.DENIED:
            requested = await request(permission);
            if (requested === RESULTS.GRANTED) {
                granted = true;
            }
            break;
        case RESULTS.UNAVAILABLE:   
        case RESULTS.LIMITED:
        case RESULTS.BLOCKED:
            granted = false;
            break;
        default:
            granted = false;
            break;
    }

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
            { text: "OK", onPress: () => {Linking.openSettings()} }
        ])
        return false;
    } else {
        return true;
    }
}