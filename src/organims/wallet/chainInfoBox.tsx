import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextColor } from "../../constants/theme";
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    chainInfo: any;
}

const ChainInfoBox = ({chainInfo}:Props) => {
    const data = chainInfo;

    const currentPrice = useMemo(() => {
        if(data?.market_data === undefined) return 0;
        return data.market_data.current_price.usd;
    }, [data]);

    const priceChangePercentage = useMemo(() => {
        if(data?.market_data === undefined) return 0;
        return data.market_data.price_change_percentage_24h.toFixed(2);
    }, [data]);
    const isMinus = priceChangePercentage < 0;

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Current price:</Text>
                {data && 
                    <Text style={styles.title}>$ 
                        <Text style={styles.price}>{currentPrice}</Text>
                    </Text>}
            </View>
            <View style={styles.box}>
                <Text style={styles.desc}>(coingecko)</Text>
                <View style={styles.box}> 
                    <Icon name={isMinus? 'trending-down':'trending-up'} color={isMinus? 'tomato':'forestgreen'} size={15} />
                    <Text style={[styles.changePercentage, {color: isMinus? 'tomato':'forestgreen'}]}>{priceChangePercentage}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
    },
    box: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: TextColor,
    },
    price: {
        color: TextColor,
        fontWeight: 'bold',
    },
    changePercentage: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingLeft: 5,
    },
    desc: {
        color: TextColor,
        fontSize: 12,
    }
})

export default ChainInfoBox;