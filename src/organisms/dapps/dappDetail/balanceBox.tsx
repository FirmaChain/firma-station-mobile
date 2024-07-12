import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { convertAmount, resizeFontSize } from '@/util/common';
import { BgColor, Lato, RestakeActiveColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { getCW20Balance, getTokenBalance } from '@/util/firma';
import { useIsFocused } from '@react-navigation/native';
import { ITokenState } from '.';
import SmallButton from '@/components/button/smallButton';
import { Image } from 'react-native';

interface IProps {
    tokenData: ITokenState | null;
    cw20Contract: string | null;
    marketingLogo: string | null;
    decimal: number | null;
    moveToSendScreen: () => void;
}

const BalanceBox = ({ tokenData, cw20Contract, marketingLogo, decimal, moveToSendScreen }: IProps) => {
    const isFocused = useIsFocused();

    const { wallet } = useAppSelector((state) => state);
    const [balanceTextSize, setBalanceTextSize] = useState(20);
    const [balance, setBalance] = useState(0);

    const tokenDenom = useMemo(() => {
        if (tokenData !== null) return tokenData.denom;
        return '';
    }, [tokenData]);

    const tokenSymbol = useMemo(() => {
        if (tokenData !== null) return tokenData.symbol;
        return '';
    }, [tokenData]);

    const getBalance = async () => {
        try {
            let result = 0;
            if (cw20Contract === null || cw20Contract === '0x' || cw20Contract === '') {
                result = await getTokenBalance(wallet.address, tokenDenom);
            } else {
                result = await getCW20Balance(cw20Contract, wallet.address);
            }
            setBalanceTextSize(resizeFontSize(result, 100000000000, 20));
            setBalance(result);
        } catch (error) {
            console.log(error);
        }
    };

    const isCW20 = useMemo(() => {
        return !Boolean(cw20Contract === null || cw20Contract === '0x' || cw20Contract === '')
    }, [cw20Contract])


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
                    {isCW20 ?
                        <View style={styles.boxV}>
                            <View style={[styles.cw20Titlewrap, { paddingBottom: 5 }]}>
                                <Text style={styles.title}>My Token</Text>
                            </View>
                            <View style={[styles.cw20Titlewrap, { width: '100%', justifyContent: 'space-between' }]}>
                                <View style={styles.balanceWrap}>
                                    <Image style={styles.logo} source={{ uri: marketingLogo === null ? '' : marketingLogo }} />
                                    <Text style={[styles.balance, { fontSize: balanceTextSize }]}>
                                        {convertAmount({ value: balance, isUfct: false, decimal: decimal })}
                                        <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${tokenSymbol.toUpperCase()}`}</Text>
                                    </Text>
                                </View>
                                <SmallButton title="Send" active={balance > 0 && isCW20} size={90} onPressEvent={moveToSendScreen} />
                            </View>
                        </View>
                        :
                        <View style={styles.boxH}>
                            <Text style={styles.title}>My Token</Text>
                            <Text style={[styles.balance, { fontSize: balanceTextSize }]}>
                                {convertAmount({ value: balance })}
                                <Text style={[styles.title, { fontSize: 14, fontWeight: 'normal' }]}>{` ${tokenSymbol.toUpperCase()}`}</Text>
                            </Text>
                        </View>
                    }
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
        paddingLeft: 17,
        paddingRight: 20,
        paddingVertical: 20,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    boxH: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boxV: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    cw20Titlewrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    title: {
        fontFamily: Lato,
        fontWeight: '600',
        fontSize: 16,
        color: TextDarkGrayColor
    },
    balanceWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    logo: {
        width: 30,
        height: 30,
        borderRadius: 100
    },
    balance: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: '600',
        color: TextColor,
        textAlign: 'right',
        paddingLeft: 5
    }
});

export default BalanceBox;
