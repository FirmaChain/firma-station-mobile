import React from 'react';
import Router from './navigators/router';
import { StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <StatusBar animated={true} barStyle={'light-content'} />
                    <Router />
                </PersistGate>
            </Provider>
        </SafeAreaProvider>
    );
}
