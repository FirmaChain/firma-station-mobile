import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { IStakingState } from '@/hooks/staking/hooks';
import { FirmaUtil } from '@firmachain/firma-js';
import { convertAmount, convertCurrent, convertNumber, makeDecimalPoint, resizeFontSize } from '@/util/common';
import { FIRMA_LOGO } from '@/constants/images';
import { CHAIN_SYMBOL, CURRENCY_SYMBOL } from '@/constants/common';
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { ForwardArrow } from '@/components/icon/icon';
import SmallButton from '@/components/button/smallButton';
import Toast from 'react-native-toast-message';
import { getTokenList } from '@/util/firma';
import { useFocusEffect } from '@react-navigation/native';
import { IBC_CONFIG } from '../../../../config';
import { IBCTokenState, useIBCTokenContext } from '@/context/ibcTokenContext';
import ConnectedSign from '@/components/parts/connectedSign';
import { useFetchPrices } from '@/hooks/wallet/hooks';

interface IProps {
    stakingValues: IStakingState | null;
    handleSend: () => void;
    handleStaking: () => void;
    handleSendIBC: (token: IBCTokenState) => void;
}

const BalanceBox = ({ stakingValues, handleSend, handleStaking, handleSendIBC }: IProps) => {
    const { staking, wallet } = useAppSelector((state) => state);
    const { tokenList, setTokenList, setIbcToken } = useIBCTokenContext();
    const { priceData } = useFetchPrices()

    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const getOtherTokenList = async () => {
        try {
            const list = await getTokenList(wallet.address);
            setTokenList(list);
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    }

    const IBCToken: IBCTokenState[] | null = useMemo(() => {
        const ibcArray = Object.entries(IBC_CONFIG).map(([key, value]) => ({
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
    }, [tokenList])


    const available = useMemo(() => {
        if (stakingValues === null) return 0;
        return stakingValues.available;
    }, [stakingValues]);

    const delegated = useMemo(() => {
        if (stakingValues === null) return 0;
        return convertCurrent(makeDecimalPoint(stakingValues.delegated));
    }, [stakingValues]);

    const undelegate = useMemo(() => {
        if (stakingValues === null) return 0;
        return convertCurrent(makeDecimalPoint(stakingValues.undelegate));
    }, [stakingValues]);

    const reward = useMemo(() => {
        return convertCurrent(makeDecimalPoint(staking.stakingReward));
    }, [staking.stakingReward]);

    const currencyData = (price: number) => {
        let decimal = 2;
        if (price < 0.0001) decimal = 6;
        if (price < 0.001) decimal = 5;
        if (price < 0.01) decimal = 4;
        if (price < 0.1) decimal = 3;
        return convertCurrent(makeDecimalPoint(price.toFixed(6), decimal));
    }

    const balanceTextSize = useMemo(() => {
        return resizeFontSize(convertNumber(FirmaUtil.getFCTStringFromUFCT(available)), 100000, 20);
    }, [available]);

    const ibcBalanceTextSize = (amount: number | string, decimal: number) => {
        const _amount = convertAmount({ value: amount, isUfct: false, point: 2, decimal: decimal })
        return resizeFontSize(convertNumber(_amount), 10000000000000, 16)
    }

    const currencySymbol = CURRENCY_SYMBOL['USD'];

    useFocusEffect(
        useCallback(() => {
            setIbcToken(null);
            getOtherTokenList()
        }, [])
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
                    <View style={[styles.wrapperH, { alignItems: 'flex-start' }]}>
                        <Image style={styles.logo} source={FIRMA_LOGO} />
                        <View>
                            <View style={[styles.currency, { alignItems: 'center' }]} >
                                <Text style={[styles.balance, { fontSize: balanceTextSize, paddingLeft: 5 }]}>
                                    {convertAmount({ value: available })}
                                </Text>
                                <Text style={[styles.chainName, { paddingLeft: 6, fontSize: 16 }]}>{` ${_CHAIN_SYMBOL}`}</Text>
                            </View>
                            <Currency chainName={'firmachain'} symbol={_CHAIN_SYMBOL} />
                        </View>
                    </View>
                    <SmallButton title="Send" active={available > 0} size={90} onPressEvent={handleSend} />
                </View>
                {IBCToken &&
                    <View>
                        <View style={[styles.divider, { height: IBCToken.length > 0 ? 1 : 0 }]} />
                        <View style={styles.ibcTitleWrap}>
                            <Text style={styles.ibcTitle}>{'IBC Coin'}</Text>
                            <ConnectedSign />
                        </View>
                        {IBCToken.map((value, index) => {
                            return (
                                <View key={`IBC-${index}`} style={{ maxHeight: 500, overflow: 'hidden', marginBottom: 13 }}>
                                    <View style={[styles.wrapperH, { justifyContent: 'space-between' }]}>
                                        <View style={[styles.wrapperH, { justifyContent: 'space-between', width: '100%' }]}>
                                            <View style={styles.currency} >
                                                <Image style={[styles.tokenLogo]} source={{ uri: value.icon }} />
                                                <View>
                                                    <View style={[styles.currency, { alignItems: 'center' }]} >
                                                        <Text style={[styles.balance, { fontSize: ibcBalanceTextSize(value.amount, value.decimal), paddingRight: 6 }]}>{convertAmount({ value: value.amount, isUfct: false, point: 2, decimal: value.decimal })}</Text>
                                                        <Text style={styles.chainName}>{value.displayName.toUpperCase()}</Text>
                                                    </View>
                                                    <Currency chainName={value.chainName} symbol={value.displayName.toUpperCase()} />
                                                </View>
                                            </View>
                                            <SmallButton title={'Send'} active={convertNumber(value.amount) > 0} onPressEvent={() => handleSendIBC(value)} size={90} height={42} border={true} color={'transparent'} />
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                        }

                    </View>}
            </View>

            <TouchableOpacity style={[styles.box, { marginVertical: 16, paddingHorizontal: 0 }]} onPress={() => handleStaking()}>
                <View style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }]}>
                    <Text style={styles.title}>Staking</Text>
                    <ForwardArrow size={20} color={TextCatTitleColor} />
                </View>
                <View style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center', paddingTop: 18 }]}>
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, { fontSize: 14 }]}>Delegated</Text>
                        <Text style={[styles.balance, { fontSize: 18 }]}>{delegated}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, { fontSize: 14 }]}>Undelegate</Text>
                        <Text style={[styles.balance, { fontSize: 18 }]}>{undelegate}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, { fontSize: 14 }]}>Reward</Text>
                        <Text style={[styles.balance, { fontSize: 18 }]}>{reward}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
        height: 24
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
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
        color: TextColor + 70,
        paddingTop: 2
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
        marginRight: 4
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
        paddingBottom: 12
    },
    ibcTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: '600',
        color: TextCatTitleColor
    },
});

export default BalanceBox;
