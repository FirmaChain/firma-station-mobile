import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { IStakingState } from '@/hooks/staking/hooks';
import { FirmaUtil } from '@firmachain/firma-js';
import { convertAmount, convertCurrent, convertNumber, makeDecimalPoint, resizeFontSize } from '@/util/common';
import { FIRMA_LOGO } from '@/constants/images';
import { CHAIN_SYMBOL, CURRENCY_SYMBOL } from '@/constants/common';
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useIBCTokenContext } from '@/context/ibcTokenContext';
import { useFetchPrices } from '@/hooks/wallet/hooks';
import SmallButton from '@/components/button/smallButton';
import ConnectedSign from '@/components/parts/connectedSign';
import { IBCDataState } from '.';

interface IProps {
    stakingValues: IStakingState | null;
    handleSend: () => void;
    handleStaking: () => void;
    handleSendIBC: (token: IBCDataState) => void;
}

const BalanceBox = ({ stakingValues, handleSend, handleSendIBC }: IProps) => {
    const { tokenList, ibcTokenConfig } = useIBCTokenContext();
    const { priceData, fetchPrices } = useFetchPrices()

    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const IBCToken: IBCDataState[] | null = useMemo(() => {
        if (ibcTokenConfig === null) return [];

        const ibcArray = Object.entries(ibcTokenConfig).map(([key, value]) => ({
            ...value,
            key
        }));

        const list = ibcArray.filter((value) => value.enable).map((value) => {
            const token = tokenList.find(token => token.denom.toLowerCase() === value.denom.toLowerCase());
            return {
                ...value,
                amount: token ? token.amount : '0',
            }
        })

        return list;
    }, [tokenList, ibcTokenConfig])

    const available = useMemo(() => {
        if (stakingValues === null) return 0;
        return stakingValues.available;
    }, [stakingValues]);

    const currencyData = (price: number) => {
        let decimal = 2;
        if (price < 0.0001) decimal = 6;
        if (price < 0.001) decimal = 5;
        if (price < 0.01) decimal = 4;
        if (price < 0.1) decimal = 3;
        return convertCurrent(makeDecimalPoint(price.toFixed(6), decimal));
    }

    const balanceTextSize = useMemo(() => {
        return resizeFontSize(convertNumber(FirmaUtil.getFCTStringFromUFCT(available)), 100000, 24);
    }, [available]);

    const ibcBalanceTextSize = (amount: number | string, decimal: number) => {
        const _amount = convertAmount({ value: amount, isUfct: false, point: 2, decimal: decimal })
        return resizeFontSize(convertNumber(_amount), 10000000000000, 18)
    }

    const currencySymbol = CURRENCY_SYMBOL['USD'];

    useFocusEffect(
        useCallback(() => {
            if (priceData === null) {
                fetchPrices();
            }
        }, [priceData])
    )

    const Currency = useCallback(({ chainName, symbol }: { chainName: string, symbol: string }) => {
        if (priceData === null) return null;
        if (priceData[chainName] === undefined) return null;

        return (
            <Text style={styles.currencyBalance}>{`1 ${symbol} = ${currencySymbol}${currencyData(priceData[chainName])}`}</Text>
        )
    }, [priceData])

    return (
        <View style={styles.container}>
            <View style={[styles.box, { paddingBottom: 20 }]}>
                <Text style={styles.title}>Available</Text>
                <View
                    style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }]}
                >
                    <View>
                        <View style={[styles.wrapperH, { alignItems: 'center' }]}>
                            <Image style={styles.logo} source={FIRMA_LOGO} />
                            <View style={[styles.currency, { alignItems: 'flex-end' }]} >
                                <Text style={[styles.balance, { fontSize: balanceTextSize }]}>
                                    {convertAmount({ value: available })}
                                </Text>
                                <Text style={[styles.chainName, { paddingLeft: 2, fontSize: 16 }]}>{` ${_CHAIN_SYMBOL}`}</Text>
                            </View>
                        </View>

                        <View style={[styles.wrapperH, { alignItems: 'center' }]}>
                            <View style={[styles.logo, { height: 1, }]} />
                            <Currency chainName={'firmachain'} symbol={_CHAIN_SYMBOL} />
                        </View>
                    </View>
                    <SmallButton title="Send" active={available > 0} size={90} onPressEvent={handleSend} />
                </View>
                {IBCToken &&
                    <View >
                        <View style={[styles.divider, { height: IBCToken.length > 0 ? 1 : 0 }]} />
                        <View style={styles.ibcTitleWrap}>
                            <Text style={styles.ibcTitle}>{'IBC Coin'}</Text>
                            <ConnectedSign />
                        </View>
                        {IBCToken.map((value, index) => {
                            return (
                                <View key={`IBC-${index}`} style={{ maxHeight: 500, overflow: 'hidden', marginBottom: 13 }}>
                                    <View style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center', width: '100%' }]}>
                                        <View>
                                            <View style={[styles.currency, { alignItems: 'center' }]} >
                                                <Image style={[styles.tokenLogo]} source={{ uri: value.icon }} resizeMode={'contain'} />
                                                <View style={[styles.currency, { alignItems: 'flex-end', }]} >
                                                    <Text style={[styles.balance, { fontSize: ibcBalanceTextSize(value.amount, value.decimal) }]}>{convertAmount({ value: value.amount, isUfct: false, point: 2, decimal: value.decimal })}</Text>
                                                    <Text style={[styles.chainName, { paddingLeft: 2 }]}>{value.displayName.toUpperCase()}</Text>
                                                </View>
                                            </View>

                                            <View style={[styles.wrapperH, { alignItems: 'center' }]}>
                                                <View style={[styles.tokenLogo, { height: 1 }]} />
                                                <Currency chainName={value.chainName} symbol={value.displayName.toUpperCase()} />
                                            </View>
                                        </View>
                                        <SmallButton title={'Send'} active={convertNumber(value.amount) > 0} onPressEvent={() => handleSendIBC(value)} size={90} height={42} border={true} color={'transparent'} />
                                    </View>
                                </View>
                            )
                        })
                        }

                    </View>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        paddingHorizontal: 20,
        marginTop: 16
    },
    box: {
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30
    },
    wrapperH: {
        flexDirection: 'row'
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: 'bold',
        color: TextCatTitleColor
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 6
    },
    balance: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        color: TextColor
    },
    currencyBalance: {
        fontFamily: Lato,
        fontSize: 11,
        fontWeight: '400',
        textAlign: 'left',
        color: TextColor + 70,
        paddingTop: 2,
    },
    chainName: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: TextDarkGrayColor
    },
    stakingWrapper: {
        flex: 1,
        height: 51,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    divider: {
        height: 1,
        backgroundColor: DisableColor,
        marginVertical: 20
    },
    dividerV: {
        width: 0.5,
        height: 50,
        backgroundColor: DisableColor
    },
    headerBox: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10
    },
    tokenLogo: {
        width: 22.5,
        height: 22.5,
        marginRight: 6,
    },
    headerAvailableTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextColor,
        paddingHorizontal: 10
    },
    currencyWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    currency: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    ibcTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 18
    },
    ibcTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: '600',
        color: TextCatTitleColor
    },
});

export default BalanceBox;
