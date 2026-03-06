import React from 'react';
import Router from '@/navigators/router';
import { persistor, store } from '@/redux/store';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

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
