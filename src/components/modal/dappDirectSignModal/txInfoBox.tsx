import React, { Fragment } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import { AddressTextColor, Lato, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import { convertAmount } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    defaultFee: number;
    companyName: string;
    productName: string;
    productPrice: number;
    productPriceSymbol: string;
}

const TxInfoBox = ({ defaultFee, companyName, productName, productPrice, productPriceSymbol }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const inlineStyles1 = {
        inlineStyle1: { width: '100%', height: 1, backgroundColor: WhiteColor + '10' },
        inlineStyle2: { paddingTop: 20, paddingBottom: 17 },
        inlineStyle3: {
            width: '100%',
            justifyContent: 'space-between',
            paddingBottom: 12,
            display: companyName === '' ? 'none' : 'flex'
        },
        inlineStyle4: { color: AddressTextColor, fontSize: 15 },
        inlineStyle5: {
            width: '100%',
            justifyContent: 'space-between',
            paddingBottom: 12,
            display: productName === '' ? 'none' : 'flex'
        },
        inlineStyle6: { color: AddressTextColor, fontSize: 15 },
        inlineStyle7: { width: '100%', justifyContent: 'space-between', paddingBottom: 12 },
        inlineStyle8: { color: AddressTextColor, fontSize: 15 },
        inlineStyle9: {
            width: '100%',
            justifyContent: 'space-between',
            paddingBottom: 12,
            display: productName === '' ? 'flex' : 'none'
        },
        inlineStyle10: { color: AddressTextColor, fontSize: 15 }
    } as const;

    return (
        <Fragment>
            <View style={inlineStyles1.inlineStyle1} />
            <View style={[styles.boxV, inlineStyles1.inlineStyle2]}>
                <View style={[styles.boxH, inlineStyles1.inlineStyle3]}>
                    <Text style={styles.catTitle}>{'Company'}</Text>
                    <Text style={[styles.value, inlineStyles1.inlineStyle4]}>{companyName}</Text>
                </View>
                <View style={[styles.boxH, inlineStyles1.inlineStyle5]}>
                    <Text style={styles.catTitle}>{'Plan'}</Text>
                    <Text style={[styles.value, inlineStyles1.inlineStyle6]}>{productName}</Text>
                </View>
                <View style={[styles.boxH, inlineStyles1.inlineStyle7]}>
                    <Text style={styles.catTitle}>{'Fee'}</Text>
                    <Text style={[styles.value, inlineStyles1.inlineStyle8]}>{`${defaultFee} ${_CHAIN_SYMBOL}`}</Text>
                </View>
                <View style={[styles.boxH, inlineStyles1.inlineStyle9]}>
                    <Text style={styles.catTitle}>{'Amount'}</Text>
                    <Text
                        style={[styles.value, inlineStyles1.inlineStyle10]}
                    >{`${convertAmount({ value: productPrice, isUfct: false, point: productPrice > 0 ? 6 : 0 })} ${productPriceSymbol}`}</Text>
                </View>
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    boxH: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
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

export default TxInfoBox;
