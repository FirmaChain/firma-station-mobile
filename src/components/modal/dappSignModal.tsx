import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, ModalActions } from '@/redux/actions';
import { getFirmaSDK } from '@/util/firma';
import { getDAppConnectSession } from '@/util/wallet';
import { BgColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { TRANSACTION_TYPE } from '@/constants/common';
import { CHAIN_NETWORK } from '@/../config';
import { URLLockIcon } from '../icon/icon';
import { convertNumber } from '@/util/common';
import ConnectClient from '@/util/connectClient';
import Button from '../button/button';
import CustomModal from './customModal';
import ValidationModal from './validationModal';

const DappSignModal = () => {
    const { common, wallet, storage, modal } = useAppSelector((state) => state);

    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [openValidationModal, setOpenValidationModal] = useState(false);
    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [iconHeight, setIconHeight] = useState(0);
    const [description, setDescription] = useState('');

    const [chainID, setChainId] = useState('');
    const [userSession, setUserSession] = useState(null);

    const isVisible = useMemo(() => {
        return modal.dappSignModal;
    }, [modal.dappSignModal]);

    useEffect(() => {
        CommonActions.handleLoadingProgress(false);
    }, [isVisible]);

    const QRData = useMemo(() => {
        if (isVisible) {
            return modal.modalData;
        }
        return null;
    }, [modal.modalData, isVisible]);

    const handleModal = (open: boolean) => {
        ModalActions.handleModalData(null);
        ModalActions.handleDAppSignModal(open);
    };

    const handleReject = async () => {
        try {
            if (userSession && QRData) {
                await connectClient.reject(JSON.parse(userSession), QRData);
            }
            handleModal(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleValidation = async (open: boolean) => {
        if (common.appState === 'active') {
            setOpenValidationModal(open);
        }
    };

    const handleTransaction = async (result: string) => {
        if (common.appState === 'active') {
            ModalActions.handleDAppData({
                type: TRANSACTION_TYPE['DAPP'],
                password: result,
                data: QRData,
                chainId: chainID,
                session: userSession
            });
            handleModal(false);
        }
    };

    useEffect(() => {
        const initializeModalData = async () => {
            try {
                setChainId(getFirmaSDK().Config.chainID);
                let session = await getDAppConnectSession(wallet.name + storage.network);
                setUserSession(session);
            } catch (error) {
                console.log(error);
            }
        };

        if (QRData) {
            initializeModalData();
        }
    }, [QRData]);

    useEffect(() => {
        if (isVisible && iconUrl !== '') {
            Image.getSize(
                iconUrl,
                (width, height) => {
                    let ratio = convertNumber(height / width);
                    setIconHeight(115 * ratio);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }, [isVisible, iconUrl]);

    useEffect(() => {
        if (isVisible) {
            try {
                setUrl(QRData.projectMetaData.url);
                setIconUrl(QRData.projectMetaData.icon);
                setDescription(QRData.signParams.info);
            } catch (error) {
                handleModal(false);
            }
        }
    }, [isVisible]);

    useEffect(() => {
        if (common.appState !== 'active' && common.isBioAuthInProgress === false) handleModal(false);
    }, [common.appState]);

    return (
        <CustomModal visible={isVisible} handleOpen={handleModal}>
            <React.Fragment>
                <View style={styles.modalTextContents}>
                    <View style={[styles.boxV, { alignItems: 'center' }]}>
                        <View style={[styles.urlBox]}>
                            <URLLockIcon size={14} color={TextCatTitleColor} />
                            <Text style={[styles.url, { paddingBottom: 0, paddingHorizontal: 10 }]}>{url}</Text>
                        </View>
                        {iconUrl !== '' && (
                            <View style={styles.logoBox}>
                                <Image style={{ width: 115, height: iconHeight, resizeMode: 'contain' }} source={{ uri: iconUrl }} />
                            </View>
                        )}
                        <Text style={styles.desc}>{description}</Text>
                    </View>
                    <View style={styles.balanceBox}>
                        <View style={[styles.boxV, { alignItems: 'flex-start' }]}>
                            <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
                                <Text style={[styles.address, { flex: 1 }]}>{'Wallet : '}</Text>
                                <Text style={[styles.address, { flex: 3 }]} numberOfLines={1} ellipsizeMode="middle">
                                    {wallet.name}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
                                <Text style={[styles.address, { flex: 1 }]}>{'Address : '}</Text>
                                <Text style={[styles.address, { flex: 3 }]} numberOfLines={1} ellipsizeMode="middle">
                                    {wallet.address}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.modalButtonBox}>
                        <View style={{ flex: 1 }}>
                            <Button title={'Reject'} active={true} border={true} onPressEvent={() => handleReject()} />
                        </View>
                        <View style={{ width: 10 }} />
                        <View style={{ flex: 1 }}>
                            <Button title={'Sign'} active={true} onPressEvent={() => handleValidation(true)} />
                        </View>
                    </View>
                </View>
                <ValidationModal
                    type={'transaction'}
                    open={openValidationModal}
                    setOpenModal={handleValidation}
                    validationHandler={handleTransaction}
                />
            </React.Fragment>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalTextContents: {
        width: '100%',
        padding: 20
    },
    modalButtonBox: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boxH: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    },
    urlBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: BgColor
    },
    url: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'bold',
        color: TextCatTitleColor
    },
    logoBox: {
        paddingTop: 20,
        paddingBottom: 10
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor,
        paddingBottom: 20
    },
    balanceBox: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: DisableColor
    },
    address: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    },
    balance: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor
    }
});

export default DappSignModal;
