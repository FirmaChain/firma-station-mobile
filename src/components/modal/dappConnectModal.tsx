import React, { useEffect, useMemo, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { DAPP_SERVICE_CONNECTION, DAPP_SERVICE_CONNECTION_DESCRIPTION_1, DAPP_SERVICE_CONNECTION_DESCRIPTION_2 } from '@/constants/common';
import { CommonActions, ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import ConnectClient from '@/util/connectClient';
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

    useEffect(() => {
        CommonActions.handleLoadingProgress(false);
    }, [isVisible]);

    const QRData = useMemo(() => {
        return isVisible ? (modalData?.data ?? null) : null;
    }, [modalData, isVisible]);

    const IdState = useMemo(() => {
        if (isVisible) {
            return modalData.idState;
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
        if (appState === 'active') {
            try {
                const updateList = JSON.stringify(IdState.list);
                await setDAppProjectIdList(walletName, network, updateList);
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
        if (appState !== 'active' && isBioAuthInProgress === false) handleCloseModal();
    }, [appState]);

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
    //   desc: {
    //     fontFamily: Lato,
    //     fontSize: 14,
    //     color: TextDarkGrayColor,
    //   },
    modalTextContents: {
        width: '100%',
        padding: 20
    }
    //   modalButtonBox: {
    //     paddingTop: 30,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //   },
});

export default DappConnectModal;
