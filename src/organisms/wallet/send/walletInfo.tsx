import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BorderColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from "@/constants/theme";
import { convertAmount } from "@/util/common";

interface Props {
    type?: string;
    available: number;
    reward?: number;
}

const WalletInfo = ({type, available = 0, reward = 0}:Props) => {
    
    return (
        <View style={styles.box}>
        <View style={styles.boxH}>
            <Text style={styles.title}>{type === "Restake"? "Total Delegate":"Available"}</Text>
            <Text style={styles.balance}>{convertAmount(available, true, 6)}
                <Text style={[styles.title, {fontSize: 14}]}>  FCT</Text>
            </Text>
        </View>
        <View style={[styles.boxH, {display: (type === "Delegate" || type === "Restake")?"flex":"none", justifyContent: "flex-end", paddingVertical: 0, paddingBottom: 10}]}>
            <Text style={[styles.title, {fontSize: 14, color: TextGrayColor}]}>{type === "Restake"? "Total Reward":"Reward"}</Text>
            <Text style={[styles.balance, {fontSize: 14, color: TextGrayColor}]}>{convertAmount(reward, true, 6)}
                <Text style={[styles.title, {fontSize: 12, color: TextGrayColor}]}>  FCT</Text>
            </Text>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        borderBottomColor: BorderColor,
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginBottom: 20,
    },
    boxH: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingVertical: 5,
    },
    title: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "normal",
        color: TextCatTitleColor,
    },
    balance: {
        fontSize: 20,
        fontFamily: Lato,
        fontWeight: "normal",
        color: TextColor,
    }
})

export default WalletInfo;