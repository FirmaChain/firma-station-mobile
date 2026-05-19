import React, { useCallback, useEffect, useRef, useState } from 'react';
import { VERSION } from '@/../config';
import { setApiAddress } from '@/api';
import { getValidatorsProfile } from '@/api/validator.api';
import { JAILBREAK_ALERT, MAINTENANCE_ERROR, setNetworkData } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { CommonActions, StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { IValidatorsProfileState } from '@/redux/reducers/storageReducer';
import {
    clearPendingNotificationDeepLink,
    getPendingNotificationDeepLink,
    parseNotificationDeepLink,
    subscribeNotificationDeepLink,
    type NotificationDeepLinkTarget
} from '@/services/notificationDeepLink';
import { convertNumber, getTimeStamp, wait } from '@/util/common';
import { Detect } from '@/util/detect';
import { setFirmaSDK } from '@/util/firma';
import { VersionCheck } from '@/util/validationCheck';
import notifee, { EventType } from '@notifee/react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { getApp, getApps } from '@react-native-firebase/app';
import { getInitialNotification, getMessaging, onNotificationOpenedApp } from '@react-native-firebase/messaging';
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
const PENDING_NOTIFICATION_NAVIGATION_DELAY_MS = 500;

const getNotificationDeepLinkKey = (target: NotificationDeepLinkTarget) => `${target.kind}:${target.proposalId}`;

const AppStateManager = () => {
    const { name: walletName } = useAppSelector((state) => state.wallet);
    const { network, validatorsProfile, currency } = useAppSelector((state) => state.storage);
    const {
        lockStation,
        appState,
        appPausedTime,
        connect,
        isNetworkChanged,
        loggedIn,
        loading,
        isBioAuthInProgress,
        pendingNotificationDeepLink
    } = useAppSelector((state) => state.common);
    const { qrScannerModal } = useAppSelector((state) => state.modal);

    const netInfo = useNetInfo();
    const { minAppVer, maintenanceState, getMaintenanceData } = useServerMessage();

    const [maintenanceHealthCheck, setMaintenanceHealthCheck] = useState<boolean>(true);
    const [update, setUpdate] = useState<boolean | null>(null);
    const [maintenance, setMaintenance] = useState<boolean | null>(null);
    const [maintenanceData, setMaintenanceData] = useState({});
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const networkLoadingRequestId = useRef<string | null>(null);
    const lastHandledDeepLinkRef = useRef('');
    const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const handleLockModalOpen = (open: boolean) => {
        CommonActions.handleLockStation(open);
        if (open === false) {
            CommonActions.handleAppPausedTime('');
        }
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

    const clearNavigationTimer = useCallback(() => {
        if (navigationTimerRef.current !== null) {
            clearTimeout(navigationTimerRef.current);
            navigationTimerRef.current = null;
        }
    }, []);

    const routeNotificationDeepLink = useCallback(
        (target: NotificationDeepLinkTarget, shouldResetStack: boolean) => {
            const targetKey = getNotificationDeepLinkKey(target);
            if (lastHandledDeepLinkRef.current === targetKey) {
                return;
            }

            lastHandledDeepLinkRef.current = targetKey;
            CommonActions.handlePendingNotificationDeepLink({ target: null, resetOnConsume: false });
            console.info('[NotificationDeepLink] handling:', {
                kind: target.kind,
                proposalId: target.proposalId,
                shouldResetStack
            });

            if (shouldResetStack) {
                navigation.reset({
                    routes: [{ name: Screens.Home }, { name: Screens.Proposal, params: { proposalId: target.proposalId } }]
                });
            } else {
                navigation.navigate(Screens.Proposal, { proposalId: target.proposalId });
            }
        },
        [navigation]
    );

    const handleNotificationTarget = useCallback(
        (target: NotificationDeepLinkTarget) => {
            const targetKey = getNotificationDeepLinkKey(target);
            if (lastHandledDeepLinkRef.current === targetKey) {
                return;
            }

            const shouldResetStack = !loggedIn || walletName === '';
            const canRouteImmediately = appState === 'active' && loggedIn && walletName !== '' && lockStation === false;

            if (canRouteImmediately) {
                routeNotificationDeepLink(target, false);
                return;
            }

            CommonActions.handlePendingNotificationDeepLink({ target, resetOnConsume: shouldResetStack });
            console.info('[NotificationDeepLink] queued:', {
                kind: target.kind,
                proposalId: target.proposalId,
                shouldResetStack
            });
        },
        [appState, loggedIn, lockStation, routeNotificationDeepLink, walletName]
    );

    const handleNotificationDeepLink = useCallback(
        (deepLink: string) => {
            const target = parseNotificationDeepLink(deepLink);
            console.info('[NotificationDeepLink] candidate received:', {
                supported: target !== null,
                kind: target?.kind,
                proposalId: target?.proposalId,
                appState,
                loggedIn,
                lockStation,
                walletName
            });

            if (!target) {
                console.info('[NotificationDeepLink] unsupported deep link:', { length: deepLink.length });
                return;
            }

            handleNotificationTarget(target);
        },
        [appState, handleNotificationTarget, loggedIn, lockStation, walletName]
    );

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

    useEffect(() => {
        const unsubscribe = subscribeNotificationDeepLink(handleNotificationTarget);
        return () => {
            unsubscribe();
        };
    }, [handleNotificationTarget]);

    useEffect(() => {
        const unsubscribeForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
            if (type !== EventType.PRESS) {
                return;
            }

            const deepLink = detail.notification?.data?.deeplink;
            console.info('[NotificationDeepLink] foreground press deeplink:', {
                hasDeepLink: typeof deepLink === 'string' && deepLink !== '',
                length: typeof deepLink === 'string' ? deepLink.length : 0
            });
            if (typeof deepLink === 'string' && deepLink !== '') {
                handleNotificationDeepLink(deepLink);
            }
        });

        return () => {
            unsubscribeForegroundEvent();
        };
    }, [handleNotificationDeepLink]);

    useEffect(() => {
        if (getApps().length === 0) {
            return;
        }

        const fcm = getMessaging(getApp());
        const unsubscribeOpenedApp = onNotificationOpenedApp(fcm, (message) => {
            const deepLink = message.data?.deeplink;
            console.info('[NotificationDeepLink] opened-app deeplink:', {
                hasDeepLink: typeof deepLink === 'string' && deepLink !== '',
                length: typeof deepLink === 'string' ? deepLink.length : 0
            });
            if (typeof deepLink === 'string' && deepLink !== '') {
                handleNotificationDeepLink(deepLink);
            }
        });

        return () => {
            unsubscribeOpenedApp();
        };
    }, [handleNotificationDeepLink]);

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            if (getApps().length === 0) {
                return;
            }

            const initialNotification = await getInitialNotification(getMessaging(getApp()));
            const deepLink = initialNotification?.data?.deeplink;
            console.info('[NotificationDeepLink] initial notification deeplink:', {
                hasDeepLink: typeof deepLink === 'string' && deepLink !== '',
                length: typeof deepLink === 'string' ? deepLink.length : 0
            });

            if (!isMounted || typeof deepLink !== 'string' || deepLink === '') {
                return;
            }

            handleNotificationDeepLink(deepLink);
        })();

        return () => {
            isMounted = false;
        };
    }, [handleNotificationDeepLink]);

    useEffect(() => {
        let isMounted = true;

        void (async () => {
            if (pendingNotificationDeepLink?.target !== null) {
                return;
            }

            const storedTarget = await getPendingNotificationDeepLink();
            console.info('[NotificationDeepLink] stored target snapshot:', {
                hasTarget: storedTarget !== null,
                kind: storedTarget?.kind,
                proposalId: storedTarget?.proposalId
            });

            if (!isMounted || storedTarget === null) {
                return;
            }

            CommonActions.handlePendingNotificationDeepLink({ target: storedTarget, resetOnConsume: true });
            await clearPendingNotificationDeepLink();
            console.info('[NotificationDeepLink] stored target restored into redux');
        })();

        return () => {
            isMounted = false;
        };
    }, [pendingNotificationDeepLink.target]);

    useEffect(() => {
        clearNavigationTimer();

        console.info('[NotificationDeepLink] pending effect snapshot:', {
            loggedIn,
            lockStation,
            hasPendingTarget: pendingNotificationDeepLink.target !== null,
            kind: pendingNotificationDeepLink.target?.kind,
            proposalId: pendingNotificationDeepLink.target?.proposalId,
            resetOnConsume: pendingNotificationDeepLink.resetOnConsume
        });

        if (!loggedIn || lockStation || pendingNotificationDeepLink.target === null) {
            console.info('[NotificationDeepLink] pending effect skipped:', {
                loggedIn,
                lockStation,
                hasPendingTarget: pendingNotificationDeepLink.target !== null
            });
            return;
        }

        const targetToHandle = pendingNotificationDeepLink.target;
        const shouldResetStack = pendingNotificationDeepLink.resetOnConsume;
        console.info('[NotificationDeepLink] waiting before routing pending deep link:', {
            kind: targetToHandle.kind,
            proposalId: targetToHandle.proposalId,
            shouldResetStack
        });

        navigationTimerRef.current = setTimeout(() => {
            navigationTimerRef.current = null;
            routeNotificationDeepLink(targetToHandle, shouldResetStack);
        }, PENDING_NOTIFICATION_NAVIGATION_DELAY_MS);

        return () => {
            clearNavigationTimer();
        };
    }, [clearNavigationTimer, loggedIn, lockStation, pendingNotificationDeepLink]);

    return (
        <React.Fragment>
            {loading && <Progress />}
            {walletName !== '' && loggedIn && (
                <React.Fragment>
                    {isBioAuthInProgress === false && appState !== 'active' && appPausedTime !== '' && <View style={styles.dim} />}
                    {isBioAuthInProgress === false && appPausedTime !== '' && <View style={styles.dim} />}
                    <DeepLinkManager />
                    <ValidationModal type={'lock'} open={lockStation} setOpenModal={handleLockModalOpen} validationHandler={handleUnlock} />
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
