import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, ModalActions } from '@/redux/actions';
import { setDAppProjectIdList } from '@/util/wallet';
import { wait } from '@/util/common';
import { Lato, TextDarkGrayColor } from '@/constants/theme';
import { DAPP_SERVICE_CONNECTION, DAPP_SERVICE_CONNECTION_DESCRIPTION_1, DAPP_SERVICE_CONNECTION_DESCRIPTION_2 } from '@/constants/common';
import { useDappCertified } from '@/hooks/dapps/hooks';
import { CHAIN_NETWORK } from '@/../config';
import CustomModal from './customModal';
import ConnectClient from '@/util/connectClient';
import DappURLBox from './dappParts/dappURLBox';
import DappTitleBox from './dappParts/dappTitleBox';
import DappButtonBox from './dappParts/dappButtonBox';

const DappConnectModal = () => {
    const { storage, common, wallet, modal } = useAppSelector((state) => state);
    const { Certified } = useDappCertified();
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [isCertified, setIsCertified] = useState(0);
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
                setIsCertified(Certified(QRData.projectMetaData));
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
        if (common.appState !== 'active' && common.isBioAuthInProgress === false) handleCloseModal();
    }, [common.appState]);

    return (
        <CustomModal visible={isVisible} handleOpen={handleModal}>
            <View style={styles.modalTextContents}>
                <View style={[styles.boxV, { alignItems: 'center' }]}>
                    <DappURLBox certifiedState={isCertified} url={url} />
                    <DappTitleBox
                        title={DAPP_SERVICE_CONNECTION}
                        descExist={true}
                        desc={`${DAPP_SERVICE_CONNECTION_DESCRIPTION_1} ${dappName.toUpperCase()}.\n${DAPP_SERVICE_CONNECTION_DESCRIPTION_2}`}
                        iconURL={iconUrl}
                    />
                </View>
                <DappButtonBox
                    active={true}
                    rejectTitle={'Cancel'}
                    confirmTitle={'Connect'}
                    handleReject={() => handleCloseModal()}
                    handleConfirm={() => handleConnect()}
                />
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
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
