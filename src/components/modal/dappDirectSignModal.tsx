import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions, ModalActions } from '@/redux/actions';
import { getBalanceFromAdr, getFirmaSDK, getTokenBalance } from '@/util/firma';
import { getDAppConnectSession } from '@/util/wallet';
import {
    AddressTextColor,
    BgColor,
    DisableColor,
    Lato,
    TextCatTitleColor,
    TextColor,
    TextDarkGrayColor,
    TextDisableColor,
    WhiteColor
} from '@/constants/theme';
import { CHAIN_SYMBOL, DAPP_NOT_ENOUGHT_BALANCE, TRANSACTION_TYPE } from '@/constants/common';
import { CHAIN_NETWORK } from '@/../config';
import { URLLockIcon } from '../icon/icon';
import { convertAmount, convertCurrent, convertNumber, convertToFctNumber, makeDecimalPoint } from '@/util/common';
import Toast from 'react-native-toast-message';
import ConnectClient from '@/util/connectClient';
import Button from '../button/button';
import CustomModal from './customModal';
import ValidationModal from './validationModal';
import WarnContainer from '../parts/containers/warnContainer';

const DappDirectSignModal = () => {
    const { common, wallet, storage, modal } = useAppSelector((state) => state);

    const connectClient = new ConnectClient(CHAIN_NETWORK[storage.network].RELAY_HOST);
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const [openValidationModal, setOpenValidationModal] = useState(false);
    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [iconHeight, setIconHeight] = useState(0);
    const [description, setDescription] = useState('');
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

    const QRData = useMemo(() => {
        if (isVisible) {
            return modal.modalData;
        }
        return null;
    }, [modal.modalData, isVisible]);

    const companyName = useMemo(() => {
        if (QRData) {
            if (QRData.signParams.argument?.corpName !== undefined) return QRData.signParams.argument.corpName;
        }
        return '';
    }, [QRData]);

    const productName = useMemo(() => {
        if (QRData) {
            if (QRData.signParams.argument?.name !== undefined) return QRData.signParams.argument.name;
        }
        return '';
    }, [QRData]);

    useEffect(() => {
        if (QRData) {
            try {
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

    const availableBalance = useMemo(() => {
        return convertCurrent(balance);
    }, [balance]);

    const defaultFee = convertToFctNumber(CHAIN_NETWORK[storage.network].FIRMACHAIN_CONFIG.defaultFee);

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

    const getBalance = async () => {
        try {
            const balandeResult = await getBalanceFromAdr(wallet.address);
            setBalance(convertNumber(makeDecimalPoint(convertToFctNumber(balandeResult), 2)));
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
                        {productName !== '' && (
                            <View style={styles.productBox}>
                                <Text style={styles.productTitle}>{productName}</Text>
                                <View style={[styles.boxH, { alignItems: 'baseline' }]}>
                                    <Text style={styles.productPrice}>{productPrice}</Text>
                                    <Text style={[styles.productTitle, { color: TextDisableColor }]}>{_CHAIN_SYMBOL}</Text>
                                </View>
                            </View>
                        )}

                        <View style={[styles.boxV, { paddingTop: 17, paddingBottom: 30 }]}>
                            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                                <Text style={styles.title}>{'My Address'}</Text>
                                <Text style={[styles.value, { color: AddressTextColor }]} numberOfLines={1} ellipsizeMode={'middle'}>
                                    {wallet.address}
                                </Text>
                            </View>
                            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between' }]}>
                                <Text style={styles.title}>{'My Balance'}</Text>
                                <Text style={[styles.value, { color: AddressTextColor }]}>{`${availableBalance} ${_CHAIN_SYMBOL}`}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: WhiteColor + '10' }} />
                        <View style={[styles.boxV, { paddingTop: 20, paddingBottom: 17 }]}>
                            {companyName !== '' && (
                                <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                                    <Text style={styles.title}>{'Company'}</Text>
                                    <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{companyName}</Text>
                                </View>
                            )}
                            {productName !== '' && (
                                <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                                    <Text style={styles.title}>{'Plan'}</Text>
                                    <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{productName}</Text>
                                </View>
                            )}
                            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                                <Text style={styles.title}>{'Fee'}</Text>
                                <Text
                                    style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}
                                >{`${defaultFee} ${_CHAIN_SYMBOL}`}</Text>
                            </View>
                            {productName === '' && (
                                <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                                    <Text style={styles.title}>{'Amount'}</Text>
                                    <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{`${convertAmount(
                                        productPrice,
                                        false,
                                        productPrice > 0 ? 6 : 0
                                    )} ${productPriceSymbol}`}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    {enoughBalanceToPay ? (
                        <View style={styles.modalButtonBox}>
                            <View style={{ flex: 1 }}>
                                <Button title={'Reject'} active={true} border={true} onPressEvent={() => handleReject()} />
                            </View>
                            <View style={{ width: 10 }} />
                            <View style={{ flex: 1 }}>
                                <Button title={'Sign'} active={true} onPressEvent={() => handleValidation(true)} />
                            </View>
                        </View>
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

    title: {
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
