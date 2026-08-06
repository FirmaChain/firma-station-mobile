import React, { useMemo } from 'react';
import { TextColor } from '@/constants/theme';
import { makeDecimalPoint } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

import { TrendingDownIcon, TrendingUpIcon } from '@/components/icon/icon';

interface IProps {
    // FIXME: Chain information is supplied by an external endpoint without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chainInfo: any;
}

const ChainInfoBox = ({ chainInfo }: IProps) => {
    const data = chainInfo;

    const currentPrice = useMemo(() => {
        if (data?.market_data === undefined) return 0;
        return data.market_data.current_price.usd;
    }, [data]);

    const priceChangePercentage = useMemo(() => {
        if (data?.market_data === undefined) return 0;
        return makeDecimalPoint(data.market_data.price_change_percentage_24h, 2);
    }, [data]);
    const isMinus = Number(priceChangePercentage) < 0;

    const inlineStyles1 = {
        inlineStyle1: { color: isMinus ? 'tomato' : 'forestgreen' }
    } as const;

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Current price:</Text>
                {data && (
                    <Text style={styles.title}>
                        $<Text style={styles.price}>{currentPrice}</Text>
                    </Text>
                )}
            </View>
            <View style={styles.box}>
                <Text style={styles.desc}>(coingecko)</Text>
                <View style={styles.box}>
                    {/* <Icon name={isMinus ? 'trending-down' : 'trending-up'} color={isMinus ? 'tomato' : 'forestgreen'} size={15} /> */}
                    {isMinus ? <TrendingDownIcon size={15} color="tomato" /> : <TrendingUpIcon size={15} color="forestgreen" />}
                    <Text style={[styles.changePercentage, inlineStyles1.inlineStyle1]}>{priceChangePercentage}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 70,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center'
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        color: TextColor
    },
    price: {
        color: TextColor,
        fontWeight: '700'
    },
    changePercentage: {
        fontSize: 12,
        fontWeight: '700',
        paddingLeft: 5
    },
    desc: {
        color: TextColor,
        fontSize: 12
    }
});

export default ChainInfoBox;
