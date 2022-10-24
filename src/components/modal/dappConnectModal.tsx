import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, ModalActions } from '@/redux/actions';
import { setDAppProjectIdList } from '@/util/wallet';
import { convertNumber, wait } from '@/util/common';
import { BgColor, Lato, TextCatTitleColor, TextDarkGrayColor } from '@/constants/theme';
import { CHAIN_NETWORK } from '@/../config';
import { URLLockIcon } from '../icon/icon';
import Button from '../button/button';
import CustomModal from './customModal';
import ConnectClient from '@/util/connectClient';

const DappConnectModal = () => {
    const { storage, common, wallet, modal } = useAppSelector((state) => state);

    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [iconHeight, setIconHeight] = useState(0);
    const [dappName, setDappName] = useState('');

    const isVisible = useMemo(() => {
        return modal.dappConnectModal;
    }, [modal.dappConnectModal]);

    useEffect(() => {
        CommonActions.handleLoadingProgress(false);
    }, [isVisible]);

    const QRData = useMemo(() => {
        if (isVisible) {
            return modal.modalData.data;
        }
        return null;
    }, [modal.modalData, isVisible]);

    const IdState = useMemo(() => {
        if (isVisible) {
            return modal.modalData.idState;
        }
        return null;
    }, [modal.modalData, isVisible]);

    useEffect(() => {
        if (QRData) {
            try {
                setUrl(QRData.projectMetaData.url);
                setIconUrl(QRData.projectMetaData.icon);
                setDappName(QRData.projectMetaData.name);
            } catch (error) {
                handleModal(false);
            }
        }
    }, [QRData]);

    const handleCloseModal = () => {
        handleModal(false);
        ModalActions.handleModalData(null);
    };

    const handleModal = (open: boolean) => {
        ModalActions.handleDAppConnectModal(open);
    };

    const handleConnect = async () => {
        handleModal(false);
        if (common.appState === 'active') {
            try {
                let updateList = JSON.stringify(IdState.list);
                await setDAppProjectIdList(wallet.name, storage.network, updateList);
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
            } catch (error) {
                console.log(error);
            }
        }
    };

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
        if (common.appState !== 'active' && common.isBioAuthInProgress === false) handleCloseModal();
    }, [common.appState]);

    return (
        <CustomModal visible={isVisible} handleOpen={handleModal}>
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
                    <Text style={styles.desc}>{`Connect to ${dappName.toUpperCase()}.`}</Text>
                </View>
                <View style={styles.modalButtonBox}>
                    <View style={{ flex: 1 }}>
                        <Button title={'Cancel'} active={true} border={true} onPressEvent={() => handleCloseModal()} />
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Button title={'Connect'} active={true} onPressEvent={() => handleConnect()} />
                    </View>
                </View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
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
        color: TextDarkGrayColor
    },
    modalTextContents: {
        width: '100%',
        padding: 20
    },
    modalButtonBox: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default DappConnectModal;
