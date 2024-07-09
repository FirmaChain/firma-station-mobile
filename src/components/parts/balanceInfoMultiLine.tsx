import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderColor, Lato, TextCatTitleColor, TextColor } from '@/constants/theme';
import { convertAmount } from '@/util/common';
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    available: number;
    reward: number;
    topTitle?: string;
    topSymbol?: string;
    bottomTitle?: string;
    bottomSymbol?: string;
}

const BalanceInfoMultiLine = ({ available = 0, reward = 0, topTitle = 'Total Delegate', topSymbol = CHAIN_SYMBOL(), bottomTitle = 'Total Reward', bottomSymbol = CHAIN_SYMBOL() }: IProps) => {
    return (
        <View style={styles.box}>
            <View style={styles.boxH}>
                <Text style={styles.title}>{topTitle}</Text>
                <Text style={styles.balance}>
                    {convertAmount({ value: available, point: 6 })}
                    <Text style={[styles.title]}>{`  ${topSymbol}`}</Text>
                </Text>
            </View>
            <View style={styles.boxH}>
                <Text style={styles.title}>{bottomTitle}</Text>
                <Text style={styles.balance}>
                    {convertAmount({ value: reward, point: 6 })}
                    <Text style={[styles.title]}>{`  ${bottomSymbol}`}</Text>
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

export default BalanceInfoMultiLine;
