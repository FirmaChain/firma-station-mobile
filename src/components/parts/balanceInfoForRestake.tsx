import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderColor, Lato, TextCatTitleColor, TextColor } from '@/constants/theme';
import { convertAmount } from '@/util/common';
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    available: number;
    reward: number;
}

const BalanceInfoForRestake = ({ available = 0, reward = 0 }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    return (
        <View style={styles.box}>
            <View style={styles.boxH}>
                <Text style={styles.title}>{'Total Delegate'}</Text>
                <Text style={styles.balance}>
                    {convertAmount(available, true, 6)}
                    <Text style={[styles.title]}>{`  ${_CHAIN_SYMBOL}`}</Text>
                </Text>
            </View>
            <View style={styles.boxH}>
                <Text style={styles.title}>{'Total Reward'}</Text>
                <Text style={styles.balance}>
                    {convertAmount(reward, true, 6)}
                    <Text style={[styles.title]}>{`  ${_CHAIN_SYMBOL}`}</Text>
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
        fontSize: 16,
        fontWeight: 'normal',
        color: TextCatTitleColor
    },
    balance: {
        fontSize: 16,
        fontFamily: Lato,
        fontWeight: 'normal',
        color: TextColor
    }
});

export default BalanceInfoForRestake;
