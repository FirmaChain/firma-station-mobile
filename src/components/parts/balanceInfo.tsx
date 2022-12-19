import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from '@/constants/theme';
import { convertAmount } from '@/util/common';
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    available: number;
    type?: string;
    reward?: number;
}

const BalanceInfo = ({ type, available = 0, reward = 0 }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    return (
        <View style={styles.box}>
            <View style={styles.boxH}>
                <Text style={styles.title}>{'Available'}</Text>
                <Text style={styles.balance}>
                    {convertAmount(available, true, 6)}
                    <Text style={[styles.title, { fontSize: 14 }]}>{`  ${_CHAIN_SYMBOL}`}</Text>
                </Text>
            </View>
            <View
                style={[
                    styles.boxH,
                    { display: type === 'Delegate' ? 'flex' : 'none', justifyContent: 'flex-end', paddingVertical: 0, paddingBottom: 10 }
                ]}
            >
                <Text style={[styles.title, { fontSize: 14, color: TextGrayColor }]}>{'Reward'}</Text>
                <Text style={[styles.balance, { fontSize: 14, color: TextGrayColor }]}>
                    {convertAmount(reward, true, 6)}
                    <Text style={[styles.title, { fontSize: 12, color: TextGrayColor }]}>{`  ${_CHAIN_SYMBOL}`}</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        borderBottomColor: BorderColor,
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginBottom: 20
    },
    boxH: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 5
    },
    title: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: 'normal',
        color: TextCatTitleColor
    },
    balance: {
        fontSize: 20,
        fontFamily: Lato,
        fontWeight: 'normal',
        color: TextColor
    }
});

export default BalanceInfo;
