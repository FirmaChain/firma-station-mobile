import React, { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddressTextColor, Lato, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import { convertAmount } from '@/util/common';
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    defaultFee: number;
    companyName: string;
    productName: string;
    productPrice: number;
    productPriceSymbol: string;
}

const TxInfoBox = ({ defaultFee, companyName, productName, productPrice, productPriceSymbol }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    return (
        <Fragment>
            <View style={{ width: '100%', height: 1, backgroundColor: WhiteColor + '10' }} />
            <View style={[styles.boxV, { paddingTop: 20, paddingBottom: 17 }]}>
                <View
                    style={[
                        styles.boxH,
                        { width: '100%', justifyContent: 'space-between', paddingBottom: 12, display: companyName === '' ? 'none' : 'flex' }
                    ]}
                >
                    <Text style={styles.catTitle}>{'Company'}</Text>
                    <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{companyName}</Text>
                </View>
                <View
                    style={[
                        styles.boxH,
                        { width: '100%', justifyContent: 'space-between', paddingBottom: 12, display: productName === '' ? 'none' : 'flex' }
                    ]}
                >
                    <Text style={styles.catTitle}>{'Plan'}</Text>
                    <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{productName}</Text>
                </View>
                <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                    <Text style={styles.catTitle}>{'Fee'}</Text>
                    <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{`${defaultFee} ${_CHAIN_SYMBOL}`}</Text>
                </View>
                <View
                    style={[
                        styles.boxH,
                        { width: '100%', justifyContent: 'space-between', paddingBottom: 12, display: productName === '' ? 'flex' : 'none' }
                    ]}
                >
                    <Text style={styles.catTitle}>{'Amount'}</Text>
                    <Text style={[styles.value, { color: AddressTextColor, fontSize: 15 }]}>{`${convertAmount({ value: productPrice, isUfct: false, point: productPrice > 0 ? 6 : 0 })} ${productPriceSymbol}`}</Text>
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
