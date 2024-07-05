import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, ModalActions } from '@/redux/actions';
import { getBalanceFromAdr, getFirmaSDK, getTokenBalance } from '@/util/firma';
import { getDAppConnectSession } from '@/util/wallet';
import { useDappCertified } from '@/hooks/dapps/hooks';
import { BgColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { CHAIN_SYMBOL, DAPP_NOT_ENOUGHT_BALANCE, TRANSACTION_TYPE } from '@/constants/common';
import { convertNumber, convertToFctNumber, makeDecimalPoint } from '@/util/common';
import { CHAIN_NETWORK } from '@/../config';
import Toast from 'react-native-toast-message';
import ConnectClient from '@/util/connectClient';
import Button from '../../button/button';
import CustomModal from '../customModal';
import ValidationModal from '../validationModal';
import WarnContainer from '../../parts/containers/warnContainer';
import MyInfoBox from './myInfoBox';
import ProductInfoBox from './productInfoBox';
import TxInfoBox from './txInfoBox';
import TxWithStationInfoBox from './txWithStationInfoBox';
import DappURLBox from '../dappParts/dappURLBox';
import DappTitleBox from '../dappParts/dappTitleBox';
import DappButtonBox from '../dappParts/dappButtonBox';

const DappDirectSignModal = () => {
    const { common, wallet, storage, modal } = useAppSelector((state) => state);
    const { Certified } = useDappCertified();

    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);
    const defaultFee = convertToFctNumber(CHAIN_NETWORK[storage.network].FIRMACHAIN_CONFIG.defaultFee);
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [openValidationModal, setOpenValidationModal] = useState(false);
    const [url, setUrl] = useState('');
    const [isCertified, setIsCertified] = useState(0);
    const [iconUrl, setIconUrl] = useState('');
    const [title, setTitle] = useState('');
    const [productName, setProductName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [isFCT, setIsFCT] = useState(true);
    const [isGetBalanceData, setIsGetBalanceData] = useState(false);
    const [isGetTokenBalanceData, setIsGetTokenBalanceData] = useState(false);
    const [balance, setBalance] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [productPrice, setProductPrice] = useState(0);
    const [productPriceSymbol, setProductPriceSymbol] = useState(_CHAIN_SYMBOL);

    const [chainID, setChainId] = useState('');
    const [userSession, setUserSession] = useState(null);

    const initValues = () => {
        setIsFCT(true);
        setBalance(0);
        setTokenBalance(0);
        setProductPrice(0);
        setProductPriceSymbol(_CHAIN_SYMBOL);
        setIsGetBalanceData(false);
        setIsGetTokenBalanceData(false);
    };

    const closeModal = () => {
        ModalActions.handleModalData(null);
        CommonActions.handleLoadingProgress(false);
        ModalActions.handleDAppDirectSignModal(false);
    };

    const isVisible = useMemo(() => {
        return modal.dappDirectSignModal;
    }, [modal.dappDirectSignModal]);

    const QRData = useMemo(() => {
        if (isVisible) {
            return modal.modalData;
        }
        return null;
    }, [modal.modalData, isVisible]);

    const MessageType = useMemo(() => {
        if (QRData === null || QRData.signParams.argument?.messageType === undefined) return null;
        return QRData.signParams.argument.messageType;
    }, [QRData]);

    const isLoadedAllBalanceData = useMemo(() => {
        if (isFCT) {
            return isGetBalanceData;
        } else {
            return isGetBalanceData && isGetTokenBalanceData;
        }
    }, [isGetBalanceData, isGetTokenBalanceData]);

    useEffect(() => {
        if (isLoadedAllBalanceData) {
            CommonActions.handleLoadingProgress(false);
        }
    }, [isLoadedAllBalanceData]);

    const getBalance = async () => {
        try {
            const balanceResult = await getBalanceFromAdr(wallet.address);
            setBalance(convertNumber(makeDecimalPoint(convertToFctNumber(balanceResult), 2)));
            setIsGetBalanceData(true);
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
            throw error;
        }
    };

    const getTokenBalanceFromDenom = async (denom: string) => {
        try {
            let result = await getTokenBalance(wallet.address, denom);
            let token = convertToFctNumber(result);
            setTokenBalance(token);
            setIsGetTokenBalanceData(true);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (QRData) {
            try {
                let _productName = QRData.signParams.argument?.name === undefined ? '' : QRData.signParams.argument.name;
                setProductName(_productName);

                let _companyName = QRData.signParams.argument?.corpName === undefined ? '' : QRData.signParams.argument.corpName;
                setCompanyName(_companyName);

                if (QRData.signParams.argument?.fctPrice !== undefined) {
                    setIsFCT(true);
                    setProductPrice(convertNumber(QRData.signParams.argument.fctPrice));
                } else if (QRData.signParams.argument?.token !== undefined) {
                    setIsFCT(false);
                    getTokenBalanceFromDenom(QRData.signParams.argument.token.denom);
                    setProductPrice(convertToFctNumber(QRData.signParams.argument.token.amount));
                    setProductPriceSymbol(QRData.signParams.argument.token.symbol);
                }
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: String(error)
                });
                closeModal();
            }
        }
    }, [QRData]);

    const engoughBalance = useCallback(() => {
        if (productPrice > 0) {
            if (isFCT) {
                return balance >= productPrice + defaultFee;
            } else {
                return balance >= defaultFee;
            }
        } else {
            return true;
        }
    }, [productPrice, isFCT, balance]);

    const engoughTokenBalance = useCallback(() => {
        if (productPrice > 0) {
            if (isFCT) {
                return true;
            } else {
                return tokenBalance >= productPrice;
            }
        } else {
            return true;
        }
    }, [productPrice, isFCT, tokenBalance]);

    const enoughBalanceToPay = useMemo(() => {
        return engoughBalance() && engoughTokenBalance();
    }, [engoughBalance, engoughTokenBalance]);

    const handleReject = async () => {
        try {
            if (userSession && QRData) {
                await connectClient.reject(JSON.parse(userSession), QRData);
            }
            closeModal();
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
            closeModal();
        }
    };

    const handleValidation = (open: boolean) => {
        if (common.appState === 'active') {
            setOpenValidationModal(open);
        }
    };

    const handleTransaction = (result: string) => {
        if (common.appState === 'active') {
            ModalActions.handleDAppData({
                type: TRANSACTION_TYPE['DAPP'],
                password: result,
                data: QRData,
                chainId: chainID,
                session: userSession
            });
            closeModal();
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
                setTitle(QRData.signParams.info);
                setIsCertified(Certified(QRData.projectMetaData));
                getBalance();
            } catch (error) {
                CommonActions.handleLoadingProgress(false);
                Toast.show({
                    type: 'error',
                    text1: String(error)
                });
                closeModal();
            }
        } else {
            initValues();
        }
    }, [isVisible]);

    useEffect(() => {
        if (common.appState !== 'active' && common.isBioAuthInProgress === false) closeModal();
    }, [common.appState]);

    return (
        <CustomModal visible={isLoadedAllBalanceData} handleOpen={closeModal}>
            <React.Fragment>
                <View style={styles.modalTextContents}>
                    <View style={[styles.boxV, { alignItems: 'center' }]}>
                        <DappURLBox certifiedState={isCertified} url={url} />
                        <DappTitleBox title={title} descExist={false} iconURL={iconUrl} />
                        <ProductInfoBox productName={productName} productPrice={productPrice} />
                        <MyInfoBox address={wallet.address} balance={balance} />

                        {QRData !== null ? (
                            MessageType === null ? (
                                <TxInfoBox
                                    defaultFee={defaultFee}
                                    companyName={companyName}
                                    productName={productName}
                                    productPrice={productPrice}
                                    productPriceSymbol={productPriceSymbol}
                                />
                            ) : (
                                <TxWithStationInfoBox type={MessageType} qrData={QRData} />
                            )
                        ) : (
                            <Fragment />
                        )}
                    </View>
                    {enoughBalanceToPay ? (
                        <DappButtonBox
                            active={true}
                            rejectTitle={'Reject'}
                            confirmTitle={'Sign'}
                            handleReject={() => handleReject()}
                            handleConfirm={() => handleValidation(true)}
                        />
                    ) : (
                        <View style={[styles.boxV, { paddingTop: 30 }]}>
                            <View style={[styles.boxH, { justifyContent: 'center' }]}>
                                <WarnContainer bgColor={BgColor} text={DAPP_NOT_ENOUGHT_BALANCE} />
                            </View>
                            <View style={[styles.modalButtonBox, { paddingTop: 10 }]}>
                                <View style={{ flex: 1 }}>
                                    <Button title={'Close'} active={true} border={true} onPressEvent={() => handleReject()} />
                                </View>
                            </View>
                        </View>
                    )}
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
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor,
        paddingBottom: 20
    },

    productBox: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: DisableColor,
        padding: 20,
        borderRadius: 8
    },
    productTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor
    },
    productPrice: {
        fontFamily: Lato,
        fontSize: 26,
        fontWeight: '600',
        color: TextColor,
        paddingRight: 6,
        paddingTop: 8
    },

    catTitle: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor
    },
    value: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor,
        textAlign: 'right'
    }
});

export default DappDirectSignModal;
