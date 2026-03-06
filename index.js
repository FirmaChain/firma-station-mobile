import './shim.js';
import 'react-native-get-random-values';
import 'react-native-quick-base64';

import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { AppRegistry } from 'react-native';
import { install } from 'react-native-quick-crypto';

import App from './App';
import { name as appName } from './app.json';

install();

if (__DEV__) {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
}

AppRegistry.registerComponent(appName, () => App);
