import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TextInput, View } from 'react-native';
import { ModalActions, StorageActions } from '@/redux/actions';
import {
    CW20BackgroundColor,
    CW20Color,
    CW721BackgroundColor,
    CW721Color,
    CWLabelBackgroundColor,
    CWLabelBorderColor,
    CWLabelColor,
    FailedColor,
    TextGrayColor,
    TextWarnColor,
    WhiteColor,
} from '@/constants/theme';
import { InputPlaceholderColor } from '@/constants/theme';
import { BgColor, BoxColor, InputBgColor, Lato, TextCatTitleColor, TextColor } from '@/constants/theme';
import { addressCheck, getCW20ContractInfo, getCW721ContractInfo, getCWContractInfo, ValidCWType, verifyCWContract } from '@/util/firma';
import Toast from 'react-native-toast-message';
import CustomModal from '@/components/modal/customModal';
import Button from '../button/button';
import TextButton from '../button/textButton';
import Clipboard from '@react-native-clipboard/clipboard';
import { ContractInfo, Cw20TokenInfo, Cw721ContractInfo } from '@firmachain/firma-js';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import Progress from '../parts/progress';
import { wait } from '@/util/common';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';
import { ERROR_CW_CONTRACT, EXIST_CW_CONTRACT_TO_LIST, NON_EXIST_CW_CONTRACT } from '@/constants/common';

interface IProps {
    open: boolean;
    setOpenModal: (open: boolean) => void;
    successCallback: (tab: number) => void;
}

const AddCWContractModal = ({ open, setOpenModal, successCallback }: IProps) => {
    const isGlobalLoading = useSelector((v: rootState) => v.common.loading);

    const { address } = useSelector((state: rootState) => state.wallet);
    const { network } = useSelector((state: rootState) => state.storage);

    const { cw20Contracts, cw721Contracts } = useSelector((state: rootState) => state.storage);
    const nonExist721StoreValue = Boolean(cw721Contracts === undefined || cw721Contracts[address] === undefined);
    const nonExist20StoreValue = Boolean(cw20Contracts === undefined || cw20Contracts[address] === undefined);

    const [addressFocus, setAddressFocus] = useState(false);
    const [addressValue, setAddressValue] = useState('');
    const [validType, setValidType] = useState<ValidCWType>('DEFAULT');
    const [cwInfo, setCWInfo] = useState<ContractInfo | null>(null);
    const [cw20Info, setCW20Info] = useState<Cw20TokenInfo | null>(null);
    const [cw721Info, setCW721Info] = useState<Cw721ContractInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleOpenModal = (open: boolean) => {
        ModalActions.handleFavoriteData(null);
        setOpenModal(open);
    };

    const handleAddressValue = (addr: string) => {
        setAddressValue(addr);
    };

    const handlePaste = async () => {
        const copied = await Clipboard.getString();
        handleAddressValue(copied);
    };

    const resetCWInto = () => {
        setCWInfo(null);
        setCW20Info(null);
        setCW721Info(null);
    };

    const handleAddCWContract = useCallback(() => {
        if (!cwInfo?.address) {
            return;
        }

        try {
            if (validType === 'CW20') {
                const prevList = nonExist20StoreValue ? [] : cw20Contracts[address];

                if (nonExist20StoreValue) {
                    StorageActions.handleCW20Contracts({
                        [address]: [...prevList, { address: cwInfo.address, type: validType, network }],
                    });
                } else {
                    StorageActions.handleCW20Contracts({
                        ...cw20Contracts,
                        [address]: [...prevList, { address: cwInfo.address, type: validType, network }],
                    });
                }
            }
            if (validType === 'CW721') {
                const prevList = nonExist721StoreValue ? [] : cw721Contracts[address];

                if (nonExist721StoreValue) {
                    StorageActions.handleCW721Contracts({
                        [address]: [...prevList, { address: cwInfo.address, type: validType, network }],
                    });
                } else {
                    StorageActions.handleCW721Contracts({
                        ...cw721Contracts,
                        [address]: [...prevList, { address: cwInfo.address, type: validType, network }],
                    });
                }
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: String(error),
            });
        } finally {
            successCallback(validType === 'CW20' ? 0 : 1);
            setOpenModal(false);
        }
    }, [validType, cwInfo?.address, address, nonExist20StoreValue, nonExist721StoreValue, network]);

    const contractInfo = useMemo(() => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);

        if (validType === 'CW20') {
            return {
                type: validType,
                name: cw20Info?.name,
                symbol: cw20Info?.symbol,
                label: cwInfo?.contract_info.label,
                color: CW20Color,
                backgroundColor: CW20BackgroundColor,
            };
        }

        if (validType === 'CW721') {
            return {
                type: validType,
                name: cw721Info?.name,
                symbol: cw721Info?.symbol,
                label: cwInfo?.contract_info.label,
                color: CW721Color,
                backgroundColor: CW721BackgroundColor,
            };
        }

        return null;
    }, [validType, cw20Info, cw721Info, cwInfo]);

    const getCWInfo = useCallback(
        async (type: string) => {
            try {
                setCW721Info(null);
                setCW20Info(null);

                setIsLoading(true);

                const cwInfo = await getCWContractInfo(addressValue);

                setCWInfo(cwInfo);
                if (type === 'CW20') {
                    const result = await getCW20ContractInfo(addressValue);
                    setCW20Info(result === undefined ? null : result);
                }

                if (type === 'CW721') {
                    const result = await getCW721ContractInfo(addressValue);
                    setCW721Info(result === undefined ? null : result);
                }
            } catch (error) {
                resetCWInto();

                Toast.show({
                    type: 'error',
                    text1: String(error),
                });
            } finally {
                wait(1000).then(() => {
                    setIsLoading(false);
                });
            }
        },
        [addressValue]
    );

    useEffect(() => {
        const getContractInfo = async () => {
            const type = await verifyCWContract(addressValue);

            if (['DEFAULT', 'ERROR', 'NON_EXIST'].includes(type)) {
                resetCWInto();
            } else {
                getCWInfo(type);
            }

            setValidType(type);
        };

        if (addressCheck(addressValue.toLowerCase()) && addressValue.length >= 64) {
            getContractInfo();
        } else {
            setValidType('DEFAULT');
        }
    }, [addressValue]);

    useEffect(() => {
        if (open === false) {
            setAddressValue('');
            setAddressFocus(false);
        }
    }, [open]);

    const ExistAddress = useMemo(() => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);
        if (validType === 'CW20') {
            const filter = nonExist20StoreValue
                ? []
                : cw20Contracts[address].filter(adr => adr.address.toLowerCase() === addressValue.toLowerCase());
            return Boolean(filter.length > 0);
        }
        if (validType === 'CW721') {
            const filter = nonExist721StoreValue
                ? []
                : cw721Contracts[address].filter(adr => adr.address.toLowerCase() === addressValue.toLowerCase());
            return Boolean(filter.length > 0);
        }

        return false;
    }, [validType, cw20Contracts, cw721Contracts, addressValue, address, nonExist20StoreValue, nonExist721StoreValue]);

    const InvalidAddress = useMemo(() => {
        return Boolean(validType === 'ERROR' || validType === 'NON_EXIST');
    }, [validType]);

    const ErrorMessage = useMemo(() => {
        if (ExistAddress) {
            return EXIST_CW_CONTRACT_TO_LIST;
        }
        if (validType === 'NON_EXIST') {
            return NON_EXIST_CW_CONTRACT;
        }
        if (validType === 'ERROR') {
            return ERROR_CW_CONTRACT;
        }
    }, [ExistAddress, validType]);

    const SaveButtonActive = useMemo(() => {
        if (validType === 'CW20') {
            return !(cwInfo === null || cw20Info === null || ExistAddress || InvalidAddress);
        }
        if (validType === 'CW721') {
            return !(cwInfo === null || cw721Info === null || ExistAddress || InvalidAddress);
        }
        return false;
    }, [validType, cw20Info, cw721Info, cwInfo, ExistAddress, InvalidAddress]);

    return (
        <CustomModal
            visible={open}
            bgColor={BgColor}
            toastInModal={false}
            forceActive={true}
            handleOpen={open === false ? () => null : handleOpenModal}>
            <View style={styles.modalContainer}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerTitle}>{'Add CW Contract'}</Text>
                </View>
                <View style={[styles.inputContainer, { marginTop: 15, marginBottom: 8 }]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{'Address'}</Text>
                        <TextButton title={'Paste'} onPressEvent={handlePaste} />
                    </View>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                color: TextColor,
                                borderColor: ExistAddress || InvalidAddress ? FailedColor : addressFocus ? WhiteColor : 'transparent',
                            },
                        ]}
                        placeholder={'Address'}
                        placeholderTextColor={InputPlaceholderColor}
                        secureTextEntry={false}
                        keyboardType={'default'}
                        autoCapitalize="none"
                        value={addressValue}
                        selectionColor={TextGrayColor}
                        editable={!isGlobalLoading && !isLoading}
                        onFocus={() => setAddressFocus(true)}
                        onBlur={() => setAddressFocus(false)}
                        onChangeText={text => handleAddressValue(text)}
                    />
                    <Animated.View
                        style={[
                            styles.noticeBox,
                            {
                                opacity: ExistAddress || InvalidAddress ? 1 : 0,
                                height: ExistAddress || InvalidAddress ? 'auto' : 0,
                                paddingBottom: ExistAddress || InvalidAddress ? 5 : 0,
                            },
                        ]}>
                        <Text style={styles.noticeText}>{ErrorMessage}</Text>
                    </Animated.View>

                    {contractInfo !== null && (
                        <View style={{ width: '100%', overflow: 'hidden', maxHeight: contractInfo !== null ? 300 : 0 }}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.text}>{'Name'}</Text>
                                <View style={styles.wrap}>
                                    <Text
                                        style={[
                                            styles.label,
                                            { color: contractInfo.color, backgroundColor: contractInfo.backgroundColor },
                                        ]}>
                                        {contractInfo.type}
                                    </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.infoValue}>
                                        {contractInfo.name}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.text}>{'Symbol'}</Text>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.infoValue}>
                                    {contractInfo.symbol}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.infoContainer,
                                    { alignItems: 'flex-start', display: contractInfo.label === '' ? 'none' : 'flex' },
                                ]}>
                                <Text style={[styles.text, { paddingTop: 3 }]}>{'Label'}</Text>
                                <Text
                                    style={[
                                        styles.label,
                                        {
                                            flexShrink: 1,
                                            color: CWLabelColor,
                                            backgroundColor: CWLabelBackgroundColor,
                                            borderColor: CWLabelBorderColor,
                                            borderWidth: 1,
                                        },
                                    ]}>
                                    {contractInfo.label}
                                </Text>
                            </View>
                        </View>
                    )}
                    <View style={styles.buttonBox}>
                        <View style={{ flex: 1 }}>
                            <Button title={'Cancel'} active={true} border={true} onPressEvent={() => handleOpenModal(false)} />
                        </View>
                        <View style={{ width: 10 }} />
                        <View style={{ flex: 1 }}>
                            <Button title={'Add'} active={SaveButtonActive} onPressEvent={() => handleAddCWContract()} />
                        </View>
                    </View>
                </View>
                {isLoading && <Progress />}
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        maxHeight: 500,
        backgroundColor: BgColor,
    },
    headerBox: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor,
    },
    wrap: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        overflow: 'hidden',
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10,
    },
    inputContainer: {
        paddingHorizontal: 20,
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 8,
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        minWidth: 80,
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 13,
    },
    infoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 8,
    },
    label: {
        fontFamily: Lato,
        fontSize: 12,
        borderRadius: 10,
        // textAlign: 'center',
        overflow: 'hidden',
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 3,
        marginRight: 5,
    },
    infoValue: {
        fontSize: 18,
        fontFamily: Lato,
        fontWeight: 'bold',
        color: TextColor,
        overflow: 'hidden',
        flexShrink: 1,
    },
    buttonBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    noticeBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: -10,
        paddingBottom: 5,
        marginBottom: 5,
    },
    noticeText: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: FailedColor,
        textAlign: 'right',
    },
});

export default AddCWContractModal;
