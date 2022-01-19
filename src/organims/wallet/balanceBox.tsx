import { ForwardArrow } from "@/components/icon/icon";
import { FIRMA_LOGO } from "@/constants/images";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SmallButton from "../../components/button/smallButton";
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "../../constants/theme";


interface Props {
    balance: Array<any>;
    reward: any;
    handleSend: Function;
    handleDelegate: Function;
}

const BalanceBox = ({balance, reward, handleSend, handleDelegate}:Props) => {
    const balanceData = useMemo(() => {
        let data = []
        if(balance !== undefined && reward !== undefined) { 
            data = balance.concat(reward);
        } else {
            data = [
                {title: "Available", data: 0},
                {title: "Delegated", data: 0},
                {title: "Undelegate", data: 0},
                {title: "Staking reward", data: 0},
            ]
        }   
        
        return data;

    }, [balance, reward]);

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Available</Text>
                <View style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center", paddingTop: 20, paddingBottom: 19}]}>
                    <View style={styles.wrapperH}>
                        <Image style={styles.logo} source={FIRMA_LOGO} />
                        <Text style={styles.balance}>100.23
                            <Text style={styles.chainName}>   FCT</Text>
                        </Text>
                    </View>
                    <SmallButton
                        title="Send"
                        onPressEvent={handleSend}/>
                </View>
                <View style={styles.divider} />
                <View style={[styles.wrapperH, {justifyContent: "space-between", paddingTop: 12}]}>
                    <Text style={[styles.chainName, {fontSize: 16}]}>Total Balance</Text>
                    <Text style={[styles.balance, {fontSize: 16}]}>1,112.15
                        <Text style={[styles.chainName, {fontSize: 16}]}>   USD</Text>
                    </Text>
                </View>
            </View>

            <View style={[styles.box, {marginVertical: 24}]}>
                <View style={[styles.wrapperH, {justifyContent: "space-between", alignItems: "center"}]}>
                    <Text style={styles.title}>Staking</Text>
                    <TouchableOpacity onPress={()=>handleDelegate()}>
                        <ForwardArrow size={20} color={TextCatTitleColor}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.wrapperH, {justifyContent: "space-evenly", alignItems: "center" ,paddingTop: 25}]}>
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Delegated</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>4.32</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Undelegate</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>0.32</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, {fontSize: 14}]}>Reward</Text>
                        <Text style={[styles.balance, {fontSize: 18}]}>1.88</Text>
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
        marginTop: 24,
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
        color: TextColor,
        paddingHorizontal: 6,
    },
    chainName: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextDarkGrayColor,
    },
    stakingWrapper: {
        height: 51,
        justifyContent: "space-between",
        alignItems: "center"
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