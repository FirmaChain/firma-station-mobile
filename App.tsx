import React, { useEffect } from 'react';
import Router from '@/navigators/router';
import { persistor, store } from '@/redux/store';
import { initializeForegroundNotifications, requestNotificationPermission } from '@/services/notifications';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
    useEffect(() => {
        let cleanup = () => {};
        let isMounted = true;

        void (async () => {
            try {
                const nextCleanup = await initializeForegroundNotifications();
                if (isMounted) {
                    cleanup = nextCleanup;
                } else {
                    nextCleanup();
                }
            } catch (error) {
                console.log('[FCM] initialize failed:', error);
            }

            try {
                await requestNotificationPermission();
            } catch (error) {
                console.log('[FCM] notification permission check/request failed:', error);
            }
        })();

        return () => {
            isMounted = false;
            cleanup();
        };
    }, []);

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <StatusBar animated barStyle="light-content" />
                    <Router />
                </PersistGate>
            </Provider>
        </SafeAreaProvider>
    );
}
