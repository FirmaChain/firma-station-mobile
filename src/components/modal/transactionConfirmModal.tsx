import React, { useEffect, useState } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import {
    BgColor,
    BorderColor,
    DisableColor,
    Lato,
    TextCatTitleColor,
    TextDarkGrayColor,
    TextDisableColor,
    WhiteColor
} from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { convertAmount, convertNumber } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../button/button';
import CustomModal from './customModal';
import ValidationModal from './validationModal';

interface IProps {
    title: string;
    amount: number;
    fee: number;
    memo?: string;
    vote?: string;
    extraData?: Record<string, React.ReactNode> | null;
    open: boolean;
    setOpenModal: (v: boolean) => void;
    symbol?: string;
    transactionHandler: (password: string) => void;
}

const TransactionConfirmModal = ({
    title,
    amount = 0,
    fee = 0,
    memo = '',
    vote = '',
    extraData = null,
    open,
    setOpenModal,
    symbol = CHAIN_SYMBOL(),
    transactionHandler
}: IProps) => {
    const { appState, isBioAuthInProgress } = useAppSelector((state) => state.common);

    const signMoalText = {
        title: title,
        confirmTitle: 'Confirm'
    };

    const SEND_TOKEN_SYMBOL = symbol;
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    const [openValidationModal, setOpenValidationModal] = useState(false);
    const [transactionStart, setTransactionStart] = useState(false);
    const [extraKey, setExtraKey] = useState<string[]>([]);

    const handleValidation = (open: boolean) => {
        setOpenValidationModal(open);
    };

    const handleTransaction = (result: string) => {
        if (appState === 'active') {
            setTransactionStart(result !== '');
            transactionHandler(result);
        }
        handleModal(false);
    };

    const handleModal = (open: boolean) => {
        if (setOpenModal) setOpenModal(open);
    };

    const handleCapitalize = (value: string) => {
        const values = value.split('_');
        let result = '';
        for (let i = 0; i < values.length; i++) {
            result = result + values[i].charAt(0).toUpperCase() + values[i].slice(1);
            if (i !== values.length - 1) result = result + ' ';
        }
        return result;
    };

    useEffect(() => {
        if (extraData) {
            let keyArray: string[] = [];
            for (const key in extraData) {
                keyArray = keyArray.concat(key);
            }
            setExtraKey(keyArray);
        } else {
            setExtraKey([]);
        }
    }, [extraData]);

    useEffect(() => {
        if (open) {
            setTransactionStart(false);
        }
    }, [open]);

    useEffect(() => {
        if (appState !== 'active' && isBioAuthInProgress === false) handleModal(false);
    }, [appState]);

    const inlineStyles1 = {
        inlineStyle1: { display: openValidationModal ? 'none' : transactionStart ? 'none' : 'flex' },
        inlineStyle2: { justifyContent: 'flex-start', alignItems: 'center' },
        inlineStyle3: { borderBottomWidth: 1, borderBottomColor: BorderColor },
        inlineStyle4: { color: WhiteColor, fontWeight: 'bold' },
        inlineStyle5: { borderBottomWidth: memo !== '' ? 0 : 1, borderBottomColor: BorderColor },
        inlineStyle6: { fontSize: 14, color: TextDisableColor },
        inlineStyle7: {
            alignItems: 'flex-end',
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: BorderColor
        },
        inlineStyle8: { fontSize: 14 },
        inlineStyle9: {
            paddingTop: 5,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: BorderColor
        },
        inlineStyle10: { color: TextCatTitleColor },
        inlineStyle11: { fontSize: 14, color: TextDisableColor }
    } as const;

    return (
        <CustomModal visible={open} bgColor={BgColor} handleOpen={handleModal}>
            <>
                <View style={[styles.modalTextContents, inlineStyles1.inlineStyle1]}>
                    <View style={[styles.boxH, inlineStyles1.inlineStyle2]}>
                        <Text style={styles.receiptTitle}>{signMoalText.title}</Text>
                    </View>
                    <View style={styles.receiptBox}>
                        {vote !== '' && (
                            <View style={[styles.boxH, styles.receiptDesc, inlineStyles1.inlineStyle3]}>
                                <Text style={styles.itemTitle}>Vote</Text>
                                <Text style={[styles.itemBalance, inlineStyles1.inlineStyle4]}>{vote}</Text>
                            </View>
                        )}
                        {amount > 0 && (
                            <View style={[styles.boxH, styles.receiptDesc, inlineStyles1.inlineStyle5]}>
                                <Text style={styles.itemTitle}>Amount</Text>
                                <Text style={styles.itemBalance}>
                                    {convertAmount({ value: amount, isUfct: false, point: 6 })}
                                    <Text style={[styles.itemTitle, inlineStyles1.inlineStyle6]}>{` ${SEND_TOKEN_SYMBOL}`}</Text>
                                </Text>
                            </View>
                        )}
                        {memo !== '' && (
                            <View style={[styles.boxH, inlineStyles1.inlineStyle7]}>
                                <Text style={styles.itemTitle}>Memo</Text>
                                <Text style={[styles.itemBalance, inlineStyles1.inlineStyle8]} numberOfLines={1} ellipsizeMode="tail">
                                    {memo}
                                </Text>
                            </View>
                        )}
                        {extraKey.length > 0 && (
                            <View style={[styles.receiptDesc, inlineStyles1.inlineStyle9]}>
                                {extraKey.map((value, index) => {
                                    return (
                                        <View key={index} style={[styles.boxH, styles.receiptDesc, styles.inlineStyle1]}>
                                            <Text style={styles.itemTitle}>{handleCapitalize(value)}</Text>
                                            <Text style={styles.itemBalance} numberOfLines={1} ellipsizeMode="tail">
                                                {extraData?.[value]}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        <View style={[styles.boxH, styles.receiptDesc]}>
                            <Text style={styles.itemTitle}>Fee</Text>
                            <Text style={[styles.itemBalance, inlineStyles1.inlineStyle10]}>
                                {convertNumber(convertAmount({ value: fee / 1000000, isUfct: false, point: 6 }))}
                                <Text style={[styles.itemTitle, inlineStyles1.inlineStyle11]}>{` ${_CHAIN_SYMBOL}`}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.modalButtonBox}>
                        <Button title={signMoalText.confirmTitle} active={true} onPressEvent={() => handleValidation(true)} />
                    </View>
                </View>
                <ValidationModal
                    type={'transaction'}
                    open={openValidationModal}
                    setOpenModal={handleValidation}
                    validationHandler={handleTransaction}
                />
            </>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingTop: 10 },
    modalTextContents: {
        width: '100%',
        padding: 20
    },
    boxH: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButtonBox: {
        paddingTop: 30
    },
    receiptBox: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: DisableColor
    },
    receiptTitle: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: 'bold',
        color: TextDarkGrayColor,
        paddingBottom: 20
    },
    receiptDesc: {
        paddingVertical: 15
    },
    itemTitle: {
        fontFamily: Lato,
        color: TextCatTitleColor,
        fontWeight: 'normal',
        fontSize: 16,
        paddingRight: 20
    },
    itemBalance: {
        width: '100%',
        flex: 1,
        fontFamily: Lato,
        color: WhiteColor,
        fontWeight: 'normal',
        textAlign: 'right',
        fontSize: 16
    }
});

export default TransactionConfirmModal;
