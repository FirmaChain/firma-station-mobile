import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, StorageActions } from '@/redux/actions';
import { convertNumber, getTimeStamp, wait } from '@/util/common';
import { Detect } from '@/util/detect';
import { BgColor } from '@/constants/theme';
import { JAILBREAK_ALERT, MAINTENANCE_ERROR, setNetworkData } from '@/constants/common';
import { MaintenanceModal, QRCodeScannerModal, UpdateModal } from '@/components/modal';
import { useNetInfo } from '@react-native-community/netinfo';
import { setClient } from '@/apollo';
import { setFirmaSDK } from '@/util/firma';
import { setApiAddress } from '@/api';
import { getValidatorsProfile } from '@/api/validator.api';
import { IValidatorsProfileState } from '@/redux/reducers/storageReducer';
import { useServerMessage } from '@/hooks/common/hooks';
import { VersionCheck } from '@/util/validationCheck';
import { VERSION } from '@/../config';
import SplashScreen from 'react-native-splash-screen';
import Progress from '@/components/parts/progress';
import AlertModal from '@/components/modal/alertModal';
import ValidationModal from '@/components/modal/validationModal';
import DeepLinkManager from './deepLinkManager';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from './appRoutes';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

const AppStateManager = () => {
    const netInfo = useNetInfo();
    const { wallet, storage, common, modal } = useAppSelector(state => state);
    const { minAppVer, maintenanceState, getMaintenanceData } = useServerMessage();

    const [maintenanceHealthCheck, setMaintenanceHealthCheck] = useState<boolean>(true);
    const [update, setUpdate] = useState<boolean | null>(null);
    const [maintenance, setMaintenance] = useState<boolean | null>(null);
    const [maintenanceData, setMaintenanceData] = useState({});
    const [openAlertModal, setOpenAlertModal] = useState(false);

    const navigation: ScreenNavgationProps = useNavigation();

    const handleValidatorsProfile = useCallback(async () => {
        try {
            const result: IValidatorsProfileState = (await getValidatorsProfile()).data;
            const lastUpdatedTime = result.lastUpdatedTime;
            const storageInfoExist = storage.validatorsProfile !== undefined;

            if (storageInfoExist === false || (storage.validatorsProfile.lastUpdatedTime !== lastUpdatedTime && lastUpdatedTime !== 0)) {
                StorageActions.handleValidatorsProfile(result);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleInitialize = useCallback(() => {
        CommonActions.handleLoggedIn(false);
        CommonActions.handleIsConnection(true);
        setClient(storage.network);
        setFirmaSDK(storage.network);
        setApiAddress(storage.network);
        setNetworkData(storage.network);

        CommonActions.handleAppPausedTime('');
        CommonActions.handleAppState('active');
        CommonActions.handleLockStation(false);
        if (storage.currency === undefined) {
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
            if (wallet.name === '') {
                CommonActions.handleAppPausedTime('');
            }
            if (common.appPausedTime !== '' && common.appState === 'active') {
                if (convertNumber(getTimeStamp()) - convertNumber(common.appPausedTime) >= 60) {
                    CommonActions.handleDataLoadStatus(0);
                    CommonActions.handleLockStation(true);
                } else {
                    CommonActions.handleAppPausedTime('');
                }
            }
        } else {
            return handleAlertModalOpen(true);
        }
    }, [common.appState, common.appPausedTime]);

    const handleLoadingProgress = useCallback(() => {
        if (common.lockStation === false && (common.connect === false || common.isNetworkChanged)) {
            CommonActions.handleLoadingProgress(true);
        }
    }, [common.lockStation, common.connect, common.isNetworkChanged]);

    const handleLoadingProgressWithNetworkChange = useCallback(() => {
        if (common.loggedIn) {
            wait(3000).then(() => {
                CommonActions.handleIsNetworkChange(false);
                CommonActions.handleLoadingProgress(false);
            });
        }
    }, [common.loggedIn]);

    useEffect(() => {
        handleInitialize();
    }, []);

    useEffect(() => {
        wait(300).then(() => {
            handleJailbreakDetect();
        });
    }, [common.appState, common.appPausedTime]);

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
        if (wallet.name === '') {
            return;
        }
        const appStateListener = AppState.addEventListener('change', nextAppState => {
            CommonActions.handleAppState(nextAppState);

            const key = Platform.OS === 'ios' ? 'inactive' : 'background';
            if (nextAppState === key) {
                CommonActions.handleAppPausedTime(getTimeStamp());
            }
        });
        return () => {
            appStateListener.remove();
        };
    }, [wallet.name]);

    useEffect(() => {
        const connect = netInfo.isConnected; // netInfo.isConnected === null ? false : netInfo.isConnected;
        if (connect === false) {
            SplashScreen.hide();
        }
        CommonActions.handleIsNetworkChange(false);
        CommonActions.handleLoadingProgress(!connect);
        CommonActions.handleIsConnection(connect);
    }, [netInfo]);

    useEffect(() => {
        if (navigation.getState()) {
            handleLoadingProgress();
        }
    }, [common.connect, common.isNetworkChanged, common.lockStation]);

    useEffect(() => {
        handleLoadingProgressWithNetworkChange();
    }, [storage.network]);

    return (
        <React.Fragment>
            {common.loading && <Progress />}
            {wallet.name !== '' && common.loggedIn && (
                <React.Fragment>
                    {common.isBioAuthInProgress === false && common.appState !== 'active' && <View style={styles.dim} />}
                    {common.isBioAuthInProgress === false && common.appPausedTime !== '' && <View style={styles.dim} />}
                    <DeepLinkManager />
                    <ValidationModal type={'lock'} open={common.lockStation} setOpenModal={handleUnlock} validationHandler={handleUnlock} />
                </React.Fragment>
            )}
            {modal.qrScannerModal && <QRCodeScannerModal />}
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
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: BgColor,
        opacity: 1,
        top: 0,
        left: 0,
        bottom: 0,
    },
});

export default AppStateManager;
