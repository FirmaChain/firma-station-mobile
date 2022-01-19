import { BorderColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    walletName: String;
    available: number;
}

const WalletInfo = ({walletName, available}:Props) => {
    
    return (
        <View style={styles.boxH}>
            <Text style={styles.title}>Available</Text>
            <Text style={styles.balance}>{available.toFixed(2)}
                <Text style={[styles.title, {fontSize: 14}]}>  FCT</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    boxH: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottomWidth: 1,
        borderBottomColor: BorderColor,
        paddingVertical: 20,
        marginBottom: 20,
    },
    title: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "normal",
        color: TextGrayColor,
    },
    balance: {
        fontSize: 20,
        fontFamily: Lato,
        fontWeight: "normal",
        color: TextColor,
    }
})

export default WalletInfo;