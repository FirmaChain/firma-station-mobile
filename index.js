import './shim.js';
import 'react-native-get-random-values';
import 'react-native-quick-base64';

import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import notifee, { EventType } from '@notifee/react-native';
import { AppRegistry } from 'react-native';
import { install } from 'react-native-quick-crypto';

import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundNotificationHandler } from './src/services/notifications';

install();

registerBackgroundNotificationHandler();

notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        console.log('[FCM] background notification pressed:', detail.notification?.data);
    }
});

if (__DEV__) {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
}

AppRegistry.registerComponent(appName, () => App);
