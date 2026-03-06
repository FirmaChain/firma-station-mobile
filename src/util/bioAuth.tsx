import { BIOMETRICS_PERMISSION_ALERT } from '@/constants/common';
import { CommonActions } from '@/redux/actions';
import { isSensorAvailable, simplePrompt } from '@sbaiahmed1/react-native-biometrics';
import { Alert, Linking, Platform } from 'react-native';

import { wait } from './common';

export const confirmViaBioAuth = async () => {
    CommonActions.handleBioAuthInProgress(true);
    let authResult: boolean = false;
    const { biometryType, available } = await isSensorAvailable();

    try {
        const result = await simplePrompt('Confirm ' + biometryType);
        wait(Platform.OS === 'ios' ? 2300 : 800).then(() => CommonActions.handleBioAuthInProgress(false));
        authResult = result.success;
    } catch (error) {
        console.log(error);
        wait(Platform.OS === 'ios' ? 2300 : 800).then(() => CommonActions.handleBioAuthInProgress(false));
        if (available === false) {
            Alert.alert(BIOMETRICS_PERMISSION_ALERT.title, BIOMETRICS_PERMISSION_ALERT.desc, [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                { text: 'OK', onPress: () => Linking.openSettings() }
            ]);
        }
        authResult = false;
    }

    return authResult;
};

export const checkBioMetrics = async () => {
    const result = isSensorAvailable().then((resultObject) => {
        const { available, biometryType } = resultObject;
        if (available && biometryType === 'TouchID') {
            return true;
        } else if (available && biometryType === 'FaceID') {
            return true;
        } else if (available && biometryType === 'Biometrics') {
            return true;
        } else {
            return false;
        }
    });

    return result;
};
