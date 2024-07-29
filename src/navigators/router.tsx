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

const Router = () => {
    const { common } = useAppSelector((state) => state);

    const handleDataLoadDelayedToast = useCallback(() => {
        Toast.show({
            type: 'error',
            text1: DATA_LOAD_DELAYED_NOTICE
        });
    }, [common.dataLoadStatus]);

    useEffect(() => {
        if (common.dataLoadStatus === 2) {
            handleDataLoadDelayedToast();
        }
    }, [common.dataLoadStatus]);

    return (
        <NavigationContainer theme={DarkTheme}>

            <IBCTokenProvider>
                <DappsProvider>
                    <StackNavigator />
                    <AppStateManager />
                    <CustomToast />
                </DappsProvider>
            </IBCTokenProvider>
        </NavigationContainer>
    );
};

export default Router;
