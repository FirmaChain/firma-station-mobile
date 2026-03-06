import React, { useEffect, useMemo, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
// import { Lato, TextCatTitleColor, TextDarkGrayColor } from '@/constants/theme';
import { DAPP_SIGNATURE_REQUEST, DAPP_SIGNATURE_REQUEST_DESCRIPTION, TRANSACTION_TYPE } from '@/constants/common';
import { CommonActions, ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import ConnectClient from '@/util/connectClient';
import { getFirmaSDK } from '@/util/firma';
import { getDAppConnectSession } from '@/util/wallet';
import { StyleSheet, View } from 'react-native';

import { useDappCertified } from '@/hooks/dapps/hooks';

import CustomModal from './customModal';
import DappButtonBox from './dappParts/dappButtonBox';
import DappTitleBox from './dappParts/dappTitleBox';
import DappURLBox from './dappParts/dappURLBox';
import DappWalletInfoBox from './dappParts/dappWalletInfoBox';
import ValidationModal from './validationModal';

const DappSignModal = () => {
    const { appState, isBioAuthInProgress } = useAppSelector((state) => state.common);
    const { network } = useAppSelector((state) => state.storage);
    const { name: walletName, address: walletAddress } = useAppSelector((state) => state.wallet);
    const { dappSignModal, modalData } = useAppSelector((state) => state.modal);

    const { Certified } = useDappCertified();
    const connectClient = new ConnectClient(CHAIN_NETWORK[network].RELAY_HOST);

    const [openValidationModal, setOpenValidationModal] = useState(false);
    const [url, setUrl] = useState('');
    const [isCertified, setIsCertified] = useState(0);
    const [iconUrl, setIconUrl] = useState('');
    const [description, setDescription] = useState(DAPP_SIGNATURE_REQUEST_DESCRIPTION);

    const [chainID, setChainId] = useState('');
    const [userSession, setUserSession] = useState(null);

    const isVisible = useMemo(() => {
        return dappSignModal;
    }, [dappSignModal]);

    useEffect(() => {
        CommonActions.handleLoadingProgress(false);
    }, [isVisible]);

    const QRData = useMemo(() => {
        if (isVisible) {
            return modalData;
        }
        return null;
    }, [modalData, isVisible]);

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
        if (appState === 'active') {
            setOpenValidationModal(open);
        }
    };

    const handleTransaction = async (result: string) => {
        if (appState === 'active') {
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
                const session = await getDAppConnectSession(walletName + network);
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
        if (isVisible) {
            try {
                setUrl(QRData.projectMetaData.url);
                setIconUrl(QRData.projectMetaData.icon);
                setIsCertified(Certified(QRData.projectMetaData));
                if (QRData.signParams.info !== '') {
                    setDescription(QRData.signParams.info);
                }
            } catch (error) {
                handleModal(false);
            }
        }
    }, [isVisible]);

    useEffect(() => {
        if (appState !== 'active' && isBioAuthInProgress === false) handleModal(false);
    }, [appState]);

    return (
        <CustomModal visible={isVisible} handleOpen={handleModal}>
            <React.Fragment>
                <View style={styles.modalTextContents}>
                    <View style={[styles.boxV, { alignItems: 'center', paddingBottom: 30 }]}>
                        <DappURLBox certifiedState={isCertified} url={url} />
                        <DappTitleBox title={DAPP_SIGNATURE_REQUEST} descExist={true} desc={description} iconURL={iconUrl} />
                    </View>
                    <DappWalletInfoBox name={walletName} address={walletAddress} />
                    <DappButtonBox
                        active={true}
                        rejectTitle={'Reject'}
                        confirmTitle={'Sign'}
                        handleReject={() => handleReject()}
                        handleConfirm={() => handleValidation(true)}
                    />
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
    //   boxH: {
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    //     alignItems: 'center',
    //   },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    }
    //   desc: {
    //     fontFamily: Lato,
    //     fontSize: 14,
    //     lineHeight: 17,
    //     color: TextDarkGrayColor,
    //     paddingBottom: 20,
    //   },
    //   balance: {
    //     fontFamily: Lato,
    //     fontSize: 14,
    //     color: TextCatTitleColor,
    //   },
});

export default DappSignModal;
