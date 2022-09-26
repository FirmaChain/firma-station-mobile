import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { convertAmount, resizeFontSize } from '@/util/common';
import { BgColor, Lato, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { getTokenBalance } from '@/util/firma';
import { useIsFocused } from '@react-navigation/native';

interface IProps {
    tokenData: {
        denom: string;
        symbol: string;
    };
}

const BalanceBox = ({ tokenData }: IProps) => {
    const isFocused = useIsFocused();

    const { wallet } = useAppSelector((state) => state);
    const [balanceTextSize, setBalanceTextSize] = useState(20);
    const [balance, setBalance] = useState(0);

    const tokenDenom = useMemo(() => {
        if (tokenData?.denom !== undefined) return tokenData.denom;
        return '';
    }, [tokenData]);

    const tokenSymbol = useMemo(() => {
        if (tokenData?.symbol !== undefined) return tokenData.symbol;
        return '';
    }, [tokenData]);

    const getBalance = async () => {
        try {
            let result = await getTokenBalance(wallet.address, tokenDenom);
            setBalanceTextSize(resizeFontSize(result, 100000000000, 20));
            setBalance(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            if (tokenDenom !== '') {
                getBalance();
            }
        }
    }, [isFocused, tokenDenom]);

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <View>
                    <View style={styles.boxH}>
                        <Text style={styles.title}>My Token</Text>
                        <Text style={[styles.balance, { fontSize: balanceTextSize }]}>
                            {convertAmount(balance, true, 2)}
                            <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${tokenSymbol}`}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 20
    },
    box: {
        borderRadius: 8,
        backgroundColor: BgColor,
        paddingHorizontal: 20,
        paddingVertical: 22,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    boxH: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: Lato,
        fontWeight: '600',
        fontSize: 18,
        color: TextDarkGrayColor
    },
    balance: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: '600',
        color: TextColor,
        textAlign: 'right'
    }
});

export default BalanceBox;
