import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { ModalActions, WalletActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { DappConnectModal, DappDirectSignModal, DappSignModal } from '@/components/modal';
import { Screens, StackParamList } from './appRoutes';
import { wait } from '@/util/common';
import { addressCheck } from '@/util/firma';
import { getDAppProjectIdList } from '@/util/wallet';
import { DAPP_INVALID_QR } from '@/constants/common';
import { CHAIN_NETWORK } from '@/../config';
import ConnectClient from '@/util/connectClient';
import Toast from 'react-native-toast-message';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

const DeepLinkManager = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const isFocused = useIsFocused();
    const { storage, wallet, common, modal } = useAppSelector((state) => state);
    const [deepLink, setDeepLink] = useState('');

    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    useEffect(() => {
        if (wallet.dstAddress !== '') {
            navigation.navigate(Screens.Send);
        }
    }, [wallet.dstAddress]);

    useEffect(() => {
        Linking.getInitialURL().then((value) => {
            if (value && deepLink !== value) {
                setDeepLink(value);
            }
        });

        let deepLinkLintener = Linking.addEventListener('url', (e) => {
            if (e.url && deepLink !== e.url) {
                setDeepLink(e.url);
            }
        });

        return () => {
            deepLinkLintener.remove();
        };
    }, []);

    useEffect(() => {
        if (common.appState !== 'active') return;
        if (common.isBioAuthInProgress) return;
        if (common.lockStation) return;
        if (isFocused) {
            if (deepLink !== '' && deepLink !== undefined) {
                let convertLink = deepLink.replace('firmastation', 'sign');
                setDeepLink('');
                ModalActions.handleModalData({ qrcodeurl: convertLink });
            }
        }
    }, [isFocused, common, deepLink]);

    useEffect(() => {
        if (common.appState === 'background') {
            setDeepLink('');
        }
    }, [common.appState]);

    useEffect(() => {
        if (modal.dappData) {
            const transactionState = modal.dappData;
            ModalActions.handleDAppData(null);
            navigation.navigate(Screens.Transaction, { state: transactionState });
        }
    }, [modal.dappData]);

    const getProjectId = async (session: string, id: string) => {
        try {
            let result = await getDAppProjectIdList(wallet.name, session);
            return JSON.parse(result);
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const handleQRResult = async (result: any) => {
        const isValidAddress = addressCheck(result);
        if (isValidAddress) {
            WalletActions.handleDstAddress(result);
        } else {
            try {
                let session = await connectClient.getUserSession(wallet.name + storage.network);
                let QRData = await connectClient.requestQRData(session, result);
                const verification = await connectClient.verifyConnectedWallet(wallet.address, QRData);
                if (verification === false) {
                    return Toast.show({
                        type: 'error',
                        text1: DAPP_INVALID_QR
                    });
                }

                let sessionKey = session.userkey === undefined ? '' : session.userkey;
                let projectId = QRData.projectMetaData === undefined ? '' : QRData.projectMetaData.projectId;
                let idList = await getProjectId(sessionKey, projectId);
                let list = idList ? idList.list : [];
                if (idList || list.includes(projectId)) {
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
                    let updateList = { list: [...list, projectId] };
                    ModalActions.handleModalData({
                        data: QRData,
                        idState: {
                            session: sessionKey,
                            list: JSON.stringify(updateList)
                        }
                    });
                    wait(500).then(() => {
                        ModalActions.handleDAppConnectModal(true);
                    });
                }
            } catch (error) {
                return Toast.show({
                    type: 'error',
                    text1: String(error)
                });
            }
        }
    };

    useEffect(() => {
        if (isFocused && common.lockStation === false) {
            if (modal.modalData?.result !== undefined) {
                handleQRResult(modal.modalData.result);
            }

            if (modal.modalData?.qrcodeurl !== undefined) {
                handleQRResult(modal.modalData.qrcodeurl);
            }
        }
    }, [isFocused, common.lockStation, modal.modalData]);

    return (
        <React.Fragment>
            <DappConnectModal />
            <DappSignModal />
            <DappDirectSignModal />
        </React.Fragment>
    );
};

export default DeepLinkManager;
