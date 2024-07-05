import React from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import { AddressTextColor, Lato, TextDarkGrayColor } from '@/constants/theme';
import { convertCurrent } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    address: string;
    balance: number;
}

const MyInfoBox = ({ address, balance }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    return (
        <View style={[styles.boxV, { paddingTop: 17, paddingBottom: 30 }]}>
            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between', paddingBottom: 12 }]}>
                <Text style={styles.catTitle}>{'My Address'}</Text>
                <Text style={[styles.value, { color: AddressTextColor }]} numberOfLines={1} ellipsizeMode={'middle'}>
                    {address}
                </Text>
            </View>
            <View style={[styles.boxH, { width: '100%', justifyContent: 'space-between' }]}>
                <Text style={styles.catTitle}>{'My Balance'}</Text>
                <Text style={[styles.value, { color: AddressTextColor }]}>{`${convertCurrent(balance)} ${_CHAIN_SYMBOL}`}</Text>
            </View>
        </View>
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

export default MyInfoBox;
