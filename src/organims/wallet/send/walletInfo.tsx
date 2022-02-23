import { BorderColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import { useBalanceData } from "@/hooks/wallet/hooks";
import { convertAmount } from "@/util/common";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    available: number;
}

const WalletInfo = ({available = 0}:Props) => {
    
    return (
        <View style={styles.boxH}>
            <Text style={styles.title}>Available</Text>
            <Text style={styles.balance}>{convertAmount(available)}
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