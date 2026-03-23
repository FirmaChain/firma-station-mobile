import React, { useEffect, useMemo, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { DAPP_INVALID_QR } from '@/constants/common';
import { useIBCTokenContext } from '@/context/ibcTokenContext';
import { IBCDataState } from '@/organisms/wallet/wallet';
import { CommonActions, ModalActions, WalletActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import ConnectClient from '@/util/connectClient';
import { addressCheck } from '@/util/firma';
import { getDAppProjectIdList } from '@/util/wallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';

import { DappConnectModal, DappDirectSignModal, DappSignModal } from '@/components/modal';
import DappServiceRegistModal from '@/components/modal/dappServiceRegistModal';

import { Screens, StackParamList } from './appRoutes';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

const DeepLinkManager = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { name: walletName, address: walletAddress, dstAddress } = useAppSelector((state) => state.wallet);
    const { appState, isBioAuthInProgress, lockStation } = useAppSelector((state) => state.common);
    const { dappData, modalData } = useAppSelector((state) => state.modal);
    const { network } = useAppSelector((state) => state.storage);

    const { tokenList, ibcTokenConfig } = useIBCTokenContext();
    const [deepLink, setDeepLink] = useState('');

    const connectClient = new ConnectClient(CHAIN_NETWORK[network].RELAY_HOST);

    const IBCToken: IBCDataState[] | null = useMemo(() => {
        if (ibcTokenConfig === null) {
            return [];
        }

        const ibcArray = Object.entries(ibcTokenConfig).map(([key, value]) => ({
            ...value,
            key
        }));

        const list = ibcArray
            .filter((value) => value.enable)
            .map((value) => {
                const token = tokenList.find((token) => token.denom.toLowerCase() === value.denom.toLowerCase());
                return {
                    ...value,
                    amount: token ? token.amount : '0'
                };
            });

        return list;
    }, [tokenList, ibcTokenConfig]);

    useEffect(() => {
        const state = navigation.getState()?.routes;

        if (state) {
            const prevPath = state[state.length - 1].name;

            if (dstAddress !== '' && prevPath === Screens.Home.toString()) {
                if (IBCToken !== null) {
                    if (dstAddress.includes('osmo1')) {
                        const tokenData = IBCToken.find((value) => value.displayName.toLocaleLowerCase() === 'osmo');
                        if (tokenData !== undefined) {
                            return navigation.navigate(Screens.SendIBC, { tokenData });
                        }
                    }
                }

                return navigation.navigate(Screens.Send);
            }
        }
    }, [dstAddress, IBCToken]);

    useEffect(() => {
        Linking.getInitialURL().then((value) => {
            if (value && deepLink !== value) {
                setDeepLink(value);
            }
        });

        const deepLinkLintener = Linking.addEventListener('url', (e) => {
            if (e.url && deepLink !== e.url) {
                setDeepLink(e.url);
            }
        });

        return () => {
            deepLinkLintener.remove();
        };
    }, []);

    useEffect(() => {
        if (appState !== 'active') {
            return;
        }
        if (isBioAuthInProgress) {
            return;
        }
        if (lockStation) {
            return;
        }
        if (deepLink !== '' && deepLink !== undefined) {
            CommonActions.handleLoadingProgress(true);
            const convertLink = deepLink.replace('firmastation', 'sign');
            setDeepLink('');
            ModalActions.handleModalData({ deeplink: convertLink });
        }
    }, [appState, isBioAuthInProgress, lockStation, deepLink]);

    useEffect(() => {
        if (appState === 'background') {
            setDeepLink('');
        }
    }, [appState]);

    useEffect(() => {
        if (dappData) {
            const transactionState = dappData;
            ModalActions.handleDAppData(null);
            navigation.navigate(Screens.Transaction, { state: transactionState });
        }
    }, [dappData]);

    const getProjectId = async () => {
        try {
            const result = await getDAppProjectIdList(walletName, network);
            return JSON.parse(result);
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const urlForWebLinkCheck = (url: string) => {
        if (url.includes('http://') || url.includes('https://')) {
            return true;
        }
        return false;
    };

    const handleQRResult = async (result: any) => {
        const isValidAddress = addressCheck(result);
        const isURL = urlForWebLinkCheck(result);

        if (isValidAddress) {
            CommonActions.handleLoadingProgress(false);
            WalletActions.handleDstAddress(result);
        } else if (isURL) {
            CommonActions.handleLoadingProgress(false);
            Linking.openURL(result);
        } else {
            try {
                const session = await connectClient.getUserSession(walletName + network);
                const isDappQR = connectClient.isDappQR(result);
                if (isDappQR) {
                    const DappQRData = await connectClient.requestDappQRData(session, result);
                    CommonActions.handleLoadingProgress(true);
                    ModalActions.handleModalData({ data: DappQRData });
                    ModalActions.handleDAppServiceRegistModal(true);
                    return;
                }

                const QRData = await connectClient.requestQRData(session, result);
                const verification = await connectClient.verifyConnectedWallet(walletAddress, QRData);
                if (verification === false) {
                    //? If verification has failed, show the error message and remove loading progress, and return false.
                    Toast.show({
                        type: 'error',
                        text1: DAPP_INVALID_QR
                    });
                    CommonActions.handleLoadingProgress(false);
                    return false;
                }

                const projectId = QRData.projectMetaData === undefined ? '' : QRData.projectMetaData.projectId;
                const idList = await getProjectId();

                const list = idList ? idList : [];

                if (list.includes(projectId)) {
                    ModalActions.handleModalData(QRData);

                    if (connectClient.isDirectSign(QRData)) {
                        wait(500).then(() => {
                            ModalActions.handleDAppDirectSignModal(true);
                        });
                    } else {
                        wait(500).then(() => {
                            ModalActions.handleDAppSignModal(true);
                        });
                    }
                } else {
                    const updateList = { list: [...list, projectId] };
                    ModalActions.handleModalData({
                        data: QRData,
                        idState: updateList
                    });
                    wait(500).then(() => {
                        CommonActions.handleLoadingProgress(false);
                        ModalActions.handleDAppConnectModal(true);
                    });
                }
            } catch (error) {
                CommonActions.handleLoadingProgress(false);
                ModalActions.handleModalData(null);
                ModalActions.handleDAppData(null);
                return Toast.show({
                    type: 'error',
                    text1: String(error)
                });
            }
        }
    };

    useEffect(() => {
        if (lockStation === false) {
            const data = modalData;
            if (data !== null) {
                if (data?.result !== undefined) {
                    handleQRResult(data.result);
                } else if (data?.deeplink !== undefined) {
                    handleQRResult(data.deeplink);
                }
            }
        }
    }, [lockStation, modalData]);

    return (
        <React.Fragment>
            <DappConnectModal />
            <DappSignModal />
            <DappDirectSignModal />
            <DappServiceRegistModal />
        </React.Fragment>
    );
};

export default DeepLinkManager;
