import React, { useEffect, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, StorageActions } from '@/redux/actions';
import { convertNumber, getTimeStamp, wait } from '@/util/common';
import { Detect } from '@/util/detect';
import { BgColor } from '@/constants/theme';
import { JAILBREAK_ALERT, setExplorerUrl } from '@/constants/common';
import { QRCodeScannerModal } from '@/components/modal';
import { useNetInfo } from '@react-native-community/netinfo';
import { setClient } from '@/apollo';
import { setFirmaSDK } from '@/util/firma';
import SplashScreen from 'react-native-splash-screen';
import Progress from '@/components/parts/progress';
import AlertModal from '@/components/modal/alertModal';
import ValidationModal from '@/components/modal/validationModal';
import DeepLinkManager from './deppLinkManager';

const AppStateManager = () => {
    const { wallet, storage, common, modal } = useAppSelector((state) => state);
    const netInfo = useNetInfo();

    const [openAlertModal, setOpenAlertModal] = useState(false);

    const handleAlertModalOpen = (open: boolean) => {
        if (open) {
            setOpenAlertModal(open);
        } else {
            return;
        }
    };

    const handleUnlock = (result: string) => {
        if (result === '') return;
        CommonActions.handleLoggedIn(true);
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime('');
    };

    useEffect(() => {
        const appStateListener = AppState.addEventListener('change', (nextAppState) => {
            CommonActions.handleAppState(nextAppState);

            const key = Platform.OS === 'ios' ? 'inactive' : 'background';
            if (nextAppState === key) {
                CommonActions.handleAppPausedTime(getTimeStamp());
            }
        });
        return () => {
            appStateListener?.remove();
        };
    }, [wallet.name]);

    useEffect(() => {
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
            return setOpenAlertModal(true);
        }
    }, [common.appState, common.appPausedTime]);

    useEffect(() => {
        const connect = netInfo.isConnected === null ? false : netInfo.isConnected;
        if (connect === false) {
            SplashScreen.hide();
        }
        CommonActions.handleIsNetworkChange(false);
        CommonActions.handleLoadingProgress(!connect);
        CommonActions.handleIsConnection(connect);
    }, [netInfo]);

    useEffect(() => {
        if (common.lockStation === false && (common.connect === false || common.isNetworkChanged)) {
            CommonActions.handleLoadingProgress(true);
        }
    }, [common.connect, common.isNetworkChanged, common.loading]);

    useEffect(() => {
        if (common.loggedIn) {
            wait(3000).then(() => {
                CommonActions.handleIsNetworkChange(false);
                CommonActions.handleLoadingProgress(false);
            });
        }
    }, [storage.network]);

    useEffect(() => {
        CommonActions.handleLoggedIn(false);
        CommonActions.handleIsConnection(true);
        setClient(storage.network);
        setFirmaSDK(storage.network);
        setExplorerUrl(storage.network);

        CommonActions.handleAppPausedTime('');
        CommonActions.handleAppState('active');
        CommonActions.handleLockStation(false);
        if (storage.currency === undefined) {
            StorageActions.handleCurrency('USD');
        }
    }, []);

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
        bottom: 0
    }
});

export default AppStateManager;
