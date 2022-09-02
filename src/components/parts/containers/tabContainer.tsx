import React, { useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useAppSelector } from '@/redux/hooks';
import { QRCodeScannerIcon, QuestionFilledCircle, Setting } from '@/components/icon/icon';
import { BgColor, GrayColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { ICON_HISTORY } from '@/constants/images';
import { ModalActions, WalletActions } from '@/redux/actions';
import { addressCheck } from '@/util/firma';
import { wait } from '@/util/common';
import { useIsFocused } from '@react-navigation/native';
import { getDAppProjectIdList } from '@/util/wallet';
import { DAPP_INVALID_QR } from '@/constants/common';
import { CHAIN_NETWORK } from '@/../config';
import ConnectClient from '@/util/connectClient';
import NetworkBadge from '../networkBadge';
import Toast from 'react-native-toast-message';

interface IProps {
    title: string;
    settingNavEvent: Function;
    historyNavEvent: Function;
    handleGuide?: () => void;
    children: JSX.Element;
}

const TabContainer = ({ title, settingNavEvent, historyNavEvent, handleGuide, children }: IProps) => {
    const isFocused = useIsFocused();
    const { storage, wallet, modal } = useAppSelector((state) => state);
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const getProjectId = async (session: string, id: string) => {
        try {
            let result = await getDAppProjectIdList(wallet.name, session);
            return JSON.parse(result);
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const handleQRScanner = async (active: boolean) => {
        ModalActions.handleQRScannerModal(active);
        if (active === false) {
            ModalActions.handleResetModal();
        }
    };

    const handleMoveToSetting = () => {
        settingNavEvent && settingNavEvent();
    };

    const handleMoveToHistory = () => {
        historyNavEvent && historyNavEvent();
    };

    const handleQRResult = async (result: any) => {
        const isValidAddress = addressCheck(result);
        if (isValidAddress) {
            WalletActions.handleDstAddress(result);
        } else {
            try {
                let session = await connectClient.getUserSession(wallet.name);
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
        if (isFocused) {
            if (modal.modalData?.result !== undefined) {
                handleQRResult(modal.modalData.result);
                ModalActions.handleResetModal();
            }

            if (modal.modalData?.qrcodeurl !== undefined) {
                handleQRResult(modal.modalData.qrcodeurl);
            }
        }
    }, [isFocused, modal.modalData]);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <View style={[styles.boxH, { paddingLeft: 10 }]}>
                    <Text style={[styles.title, { paddingLeft: 10 }]}>{title}</Text>
                    {handleGuide && (
                        <TouchableOpacity style={styles.guide} onPress={() => handleGuide()}>
                            <QuestionFilledCircle size={18} color={GrayColor} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={[styles.boxH, { justifyContent: 'flex-end', paddingRight: 20 }]}>
                    <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} onPress={() => handleQRScanner(true)}>
                        <QRCodeScannerIcon size={30} color={WhiteColor} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }}
                        style={{ marginHorizontal: 25 }}
                        onPress={() => handleMoveToHistory()}
                    >
                        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={ICON_HISTORY} />
                    </TouchableOpacity>

                    <TouchableOpacity hitSlop={{ top: 5, bottom: 5, left: 10, right: 10 }} onPress={() => handleMoveToSetting()}>
                        <Setting size={30} color={WhiteColor} />
                    </TouchableOpacity>
                </View>
                {storage.network !== 'MainNet' && <NetworkBadge top={-20} title={storage.network} />}
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.select({ android: 0, ios: getStatusBarHeight() }),
        backgroundColor: BgColor
    },
    boxH: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleContainer: {
        width: '100%',
        height: 50,
        backgroundColor: BgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15
    },
    title: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: 'bold',
        color: TextColor
    },
    guide: {
        paddingLeft: 5,
        paddingRight: 10,
        paddingVertical: 10,
        marginTop: 3
    }
});

export default TabContainer;
