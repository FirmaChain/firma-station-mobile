import React, { useCallback, useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { useAppSelector } from '@/redux/hooks';
import { DATA_LOAD_DELAYED_NOTICE } from '@/constants/common';
import CustomToast from '@/components/toast/customToast';
import StackNavigator from './stackNavigators';
import AppStateManager from './appStateManager';
import Toast from 'react-native-toast-message';
import { IBCTokenProvider } from '@/context/ibcTokenContext';
import { DappsProvider } from '@/context/dappsContext';
import { CWProvider } from '@/context/cwContext';
import RootView from '@/components/parts/containers/rootView';
import { CommonActions } from '@/redux/actions';

const Router = () => {
    const { common } = useAppSelector(state => state);

    const navigationRef = React.useRef<any>();

    const handleDataLoadDelayedToast = useCallback(() => {
        Toast.show({
            type: 'error',
            text1: DATA_LOAD_DELAYED_NOTICE,
        });
    }, [common.dataLoadStatus]);

    useEffect(() => {
        if (common.dataLoadStatus === 2) {
            handleDataLoadDelayedToast();
        }
    }, [common.dataLoadStatus]);

    return (
        <NavigationContainer
            ref={navigationRef}
            theme={DarkTheme}
            onStateChange={async () => {
                const previousRouteName = common.currentRoute;
                const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

                if (previousRouteName !== currentRouteName) {
                    CommonActions.handleCurrentRoute(currentRouteName);
                }
            }}>
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
