import { ForwardArrow } from "@/components/icon/icon";
import { FIRMA_LOGO } from "@/constants/images";
import { StakingValues } from "@/hooks/staking/hooks";
import { convertCurrent, convertNumber, convertToFctNumber, make2DecimalPlace, resizeFontSize } from "@/util/common";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SmallButton from "../../components/button/smallButton";
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "../../constants/theme";

interface Props {
    balance: number;
    stakingValues: StakingValues;
    handleSend: Function;
    handleDelegate: Function;
}

const BalanceBox = ({balance, stakingValues, handleSend, handleDelegate}:Props) => {
    const [chainInfo, setChainInfo]:Array<any> = useState([]);
    const [balanceTextSize, setBalanceTextSize] = useState(28);

    const currentPrice = useMemo(() => {
        if(chainInfo?.market_data === undefined) return 0;
        return Number(chainInfo.market_data.current_price.usd);
    }, [chainInfo]);

    const available = useMemo(() => {
        return convertToFctNumber(balance);
    }, [balance])

    const delegated = useMemo(() => {
        return convertCurrent(make2DecimalPlace(stakingValues.delegated));
    }, [stakingValues]);

    const undelegate = useMemo(() => {
        return convertCurrent(make2DecimalPlace((stakingValues.undelegate)));
    }, [stakingValues]);

    const reward = useMemo(() => {
        return convertCurrent(make2DecimalPlace((stakingValues.stakingReward)));
    }, [stakingValues]);
    
    const exchangeData = useMemo(() => {
        return convertCurrent(make2DecimalPlace((available * currentPrice)));
    }, [currentPrice, available])

    const getChainInfo = async() => {
        await fetch('https://api.coingecko.com/api/v3/coins/firmachain')
        .then((res) => res.json())
        .then((resJson) => {
            setChainInfo(resJson);
        })
    }

    useEffect(() => {
        getChainInfo();
    }, [])

    useEffect(() => {
        setBalanceTextSize(resizeFontSize(available, 10000, 28));
    }, [available]);
    

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Available</Text>
                <View style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center", paddingTop: 8, paddingBottom: 19}]}>
                    <View style={[styles.wrapperH, {alignItems: "center"}]}>
                        <Image style={styles.logo} source={FIRMA_LOGO} />
                        <Text style={[styles.balance, {fontSize:balanceTextSize}]}>{convertCurrent(make2DecimalPlace(available))}
                            <Text style={styles.chainName}>   FCT</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title="Send"
                        onPressEvent={handleSend}/>
                </View>
                <View style={styles.divider} />
                <View style={[styles.wrapperH, {justifyContent: "space-between", paddingTop: 12}]}>
                    <Text style={[styles.chainName, {fontSize: 16}]}>USD</Text>
                    <Text style={[styles.balance, {fontSize: 16}]}>$ {exchangeData}</Text>
                </View>
            </View>

            <View style={[styles.box, {marginVertical: 16, paddingHorizontal: 0}]}>
                <View style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center",paddingHorizontal: 20}]}>
                    <Text style={styles.title}>Staking</Text>
                    <TouchableOpacity onPress={()=>handleDelegate()}>
                        <ForwardArrow size={20} color={TextCatTitleColor}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.wrapperH, {flex: 3, justifyContent: "space-between", alignItems: "center" ,paddingTop: 18}]}>
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Delegated</Text>
                        <Text style={[styles.balance, {fontSize: resizeFontSize(stakingValues.delegated, 100000, 18)}]}>{delegated}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Undelegate</Text>
                        <Text style={[styles.balance, {fontSize: resizeFontSize(stakingValues.undelegate, 100000, 18)}]}>{undelegate}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Reward</Text>
                        <Text style={[styles.balance, {fontSize: resizeFontSize(stakingValues.stakingReward, 100000, 18)}]}>{reward}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        paddingHorizontal: 20,
        marginTop: 16,
    },
    box: {
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30,
    },
    wrapperH: {
        flexDirection: "row",
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextCatTitleColor,
    },
    logo: {
        width: 30,
        height: 30,
    },
    balance: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        color: TextColor,
        paddingLeft: 6,
    },
    chainName: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        textAlign: "center",
        color: TextDarkGrayColor,
    },
    stakingWrapper: {
        flex: 1,
        height: 51,
        justifyContent: "space-between",
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: DisableColor,
    },
    dividerV: {
        width: .5,
        height: 50,
        backgroundColor: DisableColor,
    }
})

export default BalanceBox;