import React, { useEffect, useMemo, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { DAPP_SERVICE_CONNECTION, DAPP_SERVICE_CONNECTION_DESCRIPTION_1, DAPP_SERVICE_CONNECTION_DESCRIPTION_2 } from '@/constants/common';
import { CommonActions, ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import ConnectClient, { QRData } from '@/util/connectClient';
import { setDAppProjectIdList } from '@/util/wallet';
import { StyleSheet, View } from 'react-native';

import { useDappCertified } from '@/hooks/dapps/hooks';

import CustomModal from './customModal';
import DappButtonBox from './dappParts/dappButtonBox';
import DappTitleBox from './dappParts/dappTitleBox';
import DappURLBox from './dappParts/dappURLBox';

const DappConnectModal = () => {
    const { appState, isBioAuthInProgress } = useAppSelector((state) => state.common);
    const { network } = useAppSelector((state) => state.storage);
    const { name: walletName } = useAppSelector((state) => state.wallet);
    const { dappConnectModal, modalData } = useAppSelector((state) => state.modal);

    const { Certified } = useDappCertified();
    const connectClient = new ConnectClient(CHAIN_NETWORK[network].RELAY_HOST);

    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [isCertified, setIsCertified] = useState(0);
    const [dappName, setDappName] = useState('');

    const isVisible = useMemo(() => {
        return dappConnectModal;
    }, [dappConnectModal]);

    const QRData = useMemo(() => {
        return isVisible ? ((modalData?.data as QRData) ?? null) : null;
    }, [modalData, isVisible]);

    const IdState = useMemo(() => {
        if (isVisible) {
            return modalData?.idState ?? null;
        }
        return null;
    }, [modalData, isVisible]);

    useEffect(() => {
        if (QRData) {
            try {
                setUrl(QRData.projectMetaData.url);
                setIconUrl(QRData.projectMetaData.icon);
                setDappName(QRData.projectMetaData.name);
                setIsCertified(Certified(QRData.projectMetaData));
            } catch {
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
        if (appState === 'active') {
            try {
                const updateList = JSON.stringify(IdState!.list);
                await setDAppProjectIdList(walletName, network, updateList);
                ModalActions.handleModalData(QRData!);
                if (connectClient.isDirectSign(QRData!)) {
                    wait(500).then(() => {
                        ModalActions.handleDAppDirectSignModal(true);
                    });
                } else {
                    wait(500).then(() => {
                        ModalActions.handleDAppSignModal(true);
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        if (appState !== 'active' && isBioAuthInProgress === false) handleCloseModal();
    }, [appState]);

    return (
        <CustomModal
            visible={isVisible}
            handleOpen={handleModal}
            handleShow={() => CommonActions.endLoadingProgress(modalData?.loadingRequestId)}
        >
            <View style={styles.modalTextContents}>
                <View style={[styles.boxV, styles.inlineStyle1]}>
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
    inlineStyle1: { alignItems: 'center' },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    },
    modalTextContents: {
        width: '100%',
        padding: 20
    }
});

export default DappConnectModal;
