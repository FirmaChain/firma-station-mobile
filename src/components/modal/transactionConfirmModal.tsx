import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { convertAmount, convertNumber } from '@/util/common';
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
import Button from '../button/button';
import CustomModal from './customModal';
import ValidationModal from './validationModal';
import { useAppSelector } from '@/redux/hooks';
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    title: string;
    amount: number;
    fee: number;
    memo?: string;
    vote?: string;
    extraData?: any;
    open: boolean;
    setOpenModal: Function;
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
    const { common } = useAppSelector((state) => state);

    const signMoalText = {
        title: title,
        confirmTitle: 'Confirm'
    };

    const SEND_TOKEN_SYMBOL = symbol;
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    const [openValidationModal, setOpenValidationModal] = useState(false);
    const [transactionStart, setTransactionStart] = useState(false);
    const [extraKey, setExtraKey] = useState([]);

    const handleValidation = (open: boolean) => {
        setOpenValidationModal(open);
    };

    const handleTransaction = (result: string) => {
        if (common.appState === 'active') {
            setTransactionStart(result !== '');
            transactionHandler(result);
        }
        handleModal(false);
    };

    const handleModal = (open: boolean) => {
        setOpenModal && setOpenModal(open);
    };

    const handleCapitalize = (value: string) => {
        let values = value.split('_');
        let result = '';
        for (var i = 0; i < values.length; i++) {
            result = result + values[i].charAt(0).toUpperCase() + values[i].slice(1);
            if (i !== values.length - 1) result = result + ' ';
        }
        return result;
    };

    useEffect(() => {
        if (extraData) {
            let keyArray: any = [];
            for (let key in extraData) {
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
        if (common.appState !== 'active' && common.isBioAuthInProgress === false) handleModal(false);
    }, [common.appState]);

    return (
        <CustomModal visible={open} bgColor={BgColor} handleOpen={handleModal}>
            <>
                <View style={[styles.modalTextContents, { display: openValidationModal || transactionStart ? 'none' : 'flex' }]}>
                    <View style={[styles.boxH, { justifyContent: 'flex-start', alignItems: 'center' }]}>
                        <Text style={styles.receiptTitle}>{signMoalText.title}</Text>
                    </View>
                    <View style={styles.receiptBox}>
                        {vote !== '' && (
                            <View style={[styles.boxH, styles.receiptDesc, { borderBottomWidth: 1, borderBottomColor: BorderColor }]}>
                                <Text style={styles.itemTitle}>Vote</Text>
                                <Text style={[styles.itemBalance, { color: WhiteColor, fontWeight: 'bold' }]}>{vote}</Text>
                            </View>
                        )}
                        {amount > 0 && (
                            <View
                                style={[
                                    styles.boxH,
                                    styles.receiptDesc,
                                    { borderBottomWidth: memo !== '' ? 0 : 1, borderBottomColor: BorderColor }
                                ]}
                            >
                                <Text style={styles.itemTitle}>Amount</Text>
                                <Text style={styles.itemBalance}>
                                    {convertAmount(amount, false, 6)}
                                    <Text style={[styles.itemTitle, { fontSize: 14, color: TextDisableColor }]}>{` ${SEND_TOKEN_SYMBOL}`}</Text>
                                </Text>
                            </View>
                        )}
                        {memo !== '' && (
                            <View
                                style={[
                                    styles.boxH,
                                    { alignItems: 'flex-end', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: BorderColor }
                                ]}
                            >
                                <Text style={styles.itemTitle}>Memo</Text>
                                <Text style={[styles.itemBalance, { fontSize: 14 }]} numberOfLines={1} ellipsizeMode="tail">
                                    {memo}
                                </Text>
                            </View>
                        )}
                        {extraKey.length > 0 && (
                            <View
                                style={[
                                    styles.receiptDesc,
                                    { paddingTop: 5, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: BorderColor }
                                ]}
                            >
                                {extraKey.map((value, index) => {
                                    return (
                                        <View key={index} style={[styles.boxH, styles.receiptDesc, { paddingTop: 10 }]}>
                                            <Text style={[styles.itemTitle]}>
                                                {handleCapitalize(value)}
                                            </Text>
                                            <Text style={styles.itemBalance} numberOfLines={1} ellipsizeMode="tail">
                                                {extraData[value]}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        <View style={[styles.boxH, styles.receiptDesc]}>
                            <Text style={styles.itemTitle}>Fee</Text>
                            <Text style={[styles.itemBalance, { color: TextCatTitleColor }]}>
                                {convertNumber(convertAmount(fee / 1000000, false, 6))}
                                <Text style={[styles.itemTitle, { fontSize: 14, color: TextDisableColor }]}>{` ${_CHAIN_SYMBOL}`}</Text>
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
    modalTextContents: {
        width: '100%',
        padding: 20
    },
    desc: {
        fontSize: 14
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
