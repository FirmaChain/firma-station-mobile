import React, { useCallback, useEffect } from 'react';
import { DATA_LOAD_DELAYED_NOTICE } from '@/constants/common';
import { CWProvider } from '@/context/cwContext';
import { DappsProvider } from '@/context/dappsContext';
import { IBCTokenProvider } from '@/context/ibcTokenContext';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import RootView from '@/components/parts/containers/rootView';
import CustomToast from '@/components/toast/customToast';

import AppStateManager from './appStateManager';
import StackNavigator from './stackNavigators';

const Router = () => {
    const { dataLoadStatus, currentRoute } = useAppSelector((state) => state.common);

    const navigationRef = React.useRef<any>(null);

    const handleDataLoadDelayedToast = useCallback(() => {
        Toast.show({
            type: 'error',
            text1: DATA_LOAD_DELAYED_NOTICE
        });
    }, [dataLoadStatus]);

    useEffect(() => {
        if (dataLoadStatus === 2) {
            handleDataLoadDelayedToast();
        }
    }, [dataLoadStatus]);

    useEffect(() => {
        //? Set curent route value to empty. for bottom view bg
        return () => {
            CommonActions.handleCurrentRoute('');
        };
    }, []);

    return (
        <NavigationContainer
            ref={navigationRef}
            theme={DarkTheme}
            onStateChange={async () => {
                const previousRouteName = currentRoute;
                const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

                if (previousRouteName !== currentRouteName) {
                    CommonActions.handleCurrentRoute(currentRouteName);
                }
            }}
        >
            <RootView>
                <CWProvider>
                    <IBCTokenProvider>
                        <DappsProvider>
                            <StackNavigator />
                            <AppStateManager />
                            <CustomToast />
                        </DappsProvider>
                    </IBCTokenProvider>
                </CWProvider>
            </RootView>
        </NavigationContainer>
    );
};

export default Router;
