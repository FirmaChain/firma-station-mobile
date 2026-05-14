import React, { useCallback, useEffect, useRef, useState } from 'react';
import { VERSION } from '@/../config';
import { setApiAddress } from '@/api';
import { getValidatorsProfile } from '@/api/validator.api';
import { JAILBREAK_ALERT, MAINTENANCE_ERROR, setNetworkData } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { CommonActions, StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { IValidatorsProfileState } from '@/redux/reducers/storageReducer';
import { convertNumber, getTimeStamp, wait } from '@/util/common';
import { Detect } from '@/util/detect';
import { setFirmaSDK } from '@/util/firma';
import { VersionCheck } from '@/util/validationCheck';
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState, Dimensions, Platform, StyleSheet, View } from 'react-native';

import { useServerMessage } from '@/hooks/common/hooks';
import { MaintenanceModal, QRCodeScannerModal, UpdateModal } from '@/components/modal';
import AlertModal from '@/components/modal/alertModal';
import ValidationModal from '@/components/modal/validationModal';
// import SplashScreen from 'react-native-splash-screen';
import Progress from '@/components/parts/progress';

import { Screens, StackParamList } from './appRoutes';
import DeepLinkManager from './deepLinkManager';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

const { width, height } = Dimensions.get('window');

const AppStateManager = () => {
    const { name: walletName } = useAppSelector((state) => state.wallet);
    const { network, validatorsProfile, currency } = useAppSelector((state) => state.storage);
    const { lockStation, appState, appPausedTime, connect, isNetworkChanged, loggedIn, loading, isBioAuthInProgress } = useAppSelector(
        (state) => state.common
    );
    const { qrScannerModal } = useAppSelector((state) => state.modal);

    const netInfo = useNetInfo();
    const { minAppVer, maintenanceState, getMaintenanceData } = useServerMessage();

    const [maintenanceHealthCheck, setMaintenanceHealthCheck] = useState<boolean>(true);
    const [update, setUpdate] = useState<boolean | null>(null);
    const [maintenance, setMaintenance] = useState<boolean | null>(null);
    const [maintenanceData, setMaintenanceData] = useState({});
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const networkLoadingRequestId = useRef<string | null>(null);

    const navigation: ScreenNavgationProps = useNavigation();

    const handleValidatorsProfile = useCallback(async () => {
        try {
            const result: IValidatorsProfileState = await getValidatorsProfile();
            const lastUpdatedTime = result.lastUpdatedTime;
            const storageInfoExist = validatorsProfile !== undefined;

            if (storageInfoExist === false || (validatorsProfile.lastUpdatedTime !== lastUpdatedTime && lastUpdatedTime !== 0)) {
                StorageActions.handleValidatorsProfile(result);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleInitialize = useCallback(() => {
        CommonActions.handleLoggedIn(false);
        CommonActions.handleIsConnection(true);
        setFirmaSDK(network);
        setApiAddress(network);
        setNetworkData(network);

        CommonActions.handleAppPausedTime('');
        CommonActions.handleAppState('active');
        CommonActions.handleLockStation(false);
        if (currency === undefined) {
            StorageActions.handleCurrency('USD');
        }
        handleValidatorsProfile();
    }, []);

    const handleMaintenanceData = useCallback(async () => {
        try {
            await getMaintenanceData();
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleUnlock = (result: string) => {
        if (result === '') {
            return;
        }
        CommonActions.handleLoggedIn(true);
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime('');
    };

    const handleAlertModalOpen = (open: boolean) => {
        if (open) {
            setOpenAlertModal(open);
        } else {
            return;
        }
    };

    const handleJailbreakDetect = useCallback(() => {
        if (Detect() === false) {
            setOpenAlertModal(false);
            if (walletName === '') {
                CommonActions.handleAppPausedTime('');
            }
            if (appPausedTime !== '' && appState === 'active') {
                if (convertNumber(getTimeStamp()) - convertNumber(appPausedTime) >= 60) {
                    CommonActions.handleDataLoadStatus(0);
                    CommonActions.handleLockStation(true);
                } else {
                    CommonActions.handleAppPausedTime('');
                }
            }
        } else {
            return handleAlertModalOpen(true);
        }
    }, [appState, appPausedTime]);

    const beginNetworkLoadingProgress = useCallback(() => {
        if (networkLoadingRequestId.current === null) {
            networkLoadingRequestId.current = CommonActions.beginLoadingProgress();
        }
    }, []);

    const endNetworkLoadingProgress = useCallback(() => {
        CommonActions.endLoadingProgress(networkLoadingRequestId.current);
        networkLoadingRequestId.current = null;
    }, []);

    const syncConnectivityLoadingProgress = useCallback(() => {
        if (lockStation === false && (connect === false || isNetworkChanged)) {
            beginNetworkLoadingProgress();
        }
    }, [lockStation, connect, isNetworkChanged, beginNetworkLoadingProgress]);

    const syncNetworkChangeLoadingProgress = useCallback(() => {
        if (loggedIn) {
            wait(3000).then(() => {
                CommonActions.handleIsNetworkChange(false);
                endNetworkLoadingProgress();
            });
        }
    }, [loggedIn, endNetworkLoadingProgress]);

    useEffect(() => {
        handleInitialize();
    }, []);

    useEffect(() => {
        wait(300).then(() => {
            handleJailbreakDetect();
        });
    }, [appState, appPausedTime]);

    useEffect(() => {
        if (minAppVer !== undefined) {
            setMaintenanceHealthCheck(true);
            if (minAppVer !== null) {
                CommonActions.handleCurrentAppVer(VERSION);
                const result = VersionCheck(minAppVer, VERSION);
                if (result) {
                    setUpdate(false);
                } else {
                    setUpdate(true);
                }
            }
        } else {
            setMaintenanceHealthCheck(false);
        }
    }, [minAppVer, VERSION]);

    useEffect(() => {
        if (update !== null && update === false) {
            if (maintenanceState !== undefined) {
                if (maintenanceState !== null) {
                    const isMaintenance = maintenanceState?.isShow;
                    if (isMaintenance) {
                        setMaintenance(true);
                        setMaintenanceData(maintenanceState);
                    } else {
                        setMaintenance(false);
                        CommonActions.handleMaintenanceState(false);
                    }
                }
            } else {
                setMaintenanceHealthCheck(false);
            }
        }
    }, [update, maintenanceState]);

    useEffect(() => {
        // Note: Removed `walletName` dependency and the early return.
        // If the user disconnects right after Face ID, `walletName` becomes empty and
        // the AppState listener used to detach before receiving the next `active` event.
        // That could leave Redux `appState` stuck at `inactive`, so the wallet select modal closed immediately on open (appearing as if it never opened).
        const appStateListener = AppState.addEventListener('change', (nextAppState) => {
            CommonActions.handleAppState(nextAppState);

            const key = Platform.OS === 'ios' ? 'inactive' : 'background';
            // Do not treat biometric system prompt transitions as app pause.
            if (nextAppState === key && isBioAuthInProgress === false) {
                CommonActions.handleAppPausedTime(getTimeStamp());
            }
        });
        return () => {
            appStateListener.remove();
        };
    }, [isBioAuthInProgress]);

    useEffect(() => {
        const connect = netInfo.isConnected; // netInfo.isConnected === null ? false : netInfo.isConnected;
        // if (connect === false) {
        //     SplashScreen.hide();
        // }
        CommonActions.handleIsNetworkChange(false);
        if (connect === false) {
            beginNetworkLoadingProgress();
        } else {
            endNetworkLoadingProgress();
        }
        CommonActions.handleIsConnection(connect);
    }, [netInfo]);

    useEffect(() => {
        if (navigation.getState()) {
            syncConnectivityLoadingProgress();
        }
    }, [connect, isNetworkChanged, lockStation]);

    useEffect(() => {
        syncNetworkChangeLoadingProgress();
    }, [network]);

    return (
        <React.Fragment>
            {loading && <Progress />}
            {walletName !== '' && loggedIn && (
                <React.Fragment>
                    {isBioAuthInProgress === false && appState !== 'active' && appPausedTime !== '' && <View style={styles.dim} />}
                    {isBioAuthInProgress === false && appPausedTime !== '' && <View style={styles.dim} />}
                    <DeepLinkManager />
                    <ValidationModal type={'lock'} open={lockStation} setOpenModal={handleUnlock} validationHandler={handleUnlock} />
                </React.Fragment>
            )}
            {qrScannerModal && <QRCodeScannerModal />}
            {openAlertModal && (
                <React.Fragment>
                    <View style={styles.dim} />
                    <AlertModal
                        visible={openAlertModal}
                        handleOpen={handleAlertModalOpen}
                        title={'Jailbroken detected'}
                        desc={JAILBREAK_ALERT}
                        confirmTitle={'OK'}
                        type={'ERROR'}
                    />
                </React.Fragment>
            )}
            {maintenanceHealthCheck === false && (
                <AlertModal
                    visible={maintenanceHealthCheck === false}
                    handleOpen={handleMaintenanceData}
                    forcedActive={true}
                    title={'Notice'}
                    desc={MAINTENANCE_ERROR}
                    confirmTitle={'OK'}
                    type={'CONFIRM'}
                />
            )}
            {update !== null && update && <UpdateModal />}
            {maintenance != null && maintenance && <MaintenanceModal data={maintenanceData} refreshData={handleMaintenanceData} />}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    dim: {
        width,
        height,
        position: 'absolute',
        backgroundColor: BgColor,
        opacity: 1,
        top: 0,
        left: 0
    }
});

export default AppStateManager;
