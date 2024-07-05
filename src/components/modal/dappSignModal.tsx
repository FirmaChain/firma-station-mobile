import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, ModalActions } from '@/redux/actions';
import { getFirmaSDK } from '@/util/firma';
import { getDAppConnectSession } from '@/util/wallet';
import { Lato, TextCatTitleColor, TextDarkGrayColor } from '@/constants/theme';
import { DAPP_SIGNATURE_REQUEST, DAPP_SIGNATURE_REQUEST_DESCRIPTION, TRANSACTION_TYPE } from '@/constants/common';
import { CHAIN_NETWORK } from '@/../config';
import ConnectClient from '@/util/connectClient';
import CustomModal from './customModal';
import ValidationModal from './validationModal';
import { useDappCertified } from '@/hooks/dapps/hooks';
import DappURLBox from './dappParts/dappURLBox';
import DappTitleBox from './dappParts/dappTitleBox';
import DappButtonBox from './dappParts/dappButtonBox';
import DappWalletInfoBox from './dappParts/dappWalletInfoBox';

const DappSignModal = () => {
    const { common, wallet, storage, modal } = useAppSelector((state) => state);
    const { Certified } = useDappCertified();
    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);

    const [openValidationModal, setOpenValidationModal] = useState(false);
    const [url, setUrl] = useState('');
    const [isCertified, setIsCertified] = useState(0);
    const [iconUrl, setIconUrl] = useState('');
    const [description, setDescription] = useState(DAPP_SIGNATURE_REQUEST_DESCRIPTION);

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
        if (common.appState !== 'active' && common.isBioAuthInProgress === false) handleModal(false);
    }, [common.appState]);

    return (
        <CustomModal visible={isVisible} handleOpen={handleModal}>
            <React.Fragment>
                <View style={styles.modalTextContents}>
                    <View style={[styles.boxV, { alignItems: 'center', paddingBottom: 30 }]}>
                        <DappURLBox certifiedState={isCertified} url={url} />
                        <DappTitleBox title={DAPP_SIGNATURE_REQUEST} descExist={true} desc={description} iconURL={iconUrl} />
                    </View>
                    <DappWalletInfoBox name={wallet.name} address={wallet.address} />
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
    boxH: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        lineHeight: 17,
        color: TextDarkGrayColor,
        paddingBottom: 20
    },
    balance: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor
    }
});

export default DappSignModal;
