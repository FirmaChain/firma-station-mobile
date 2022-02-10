import { BorderColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import { useBalanceData } from "@/hooks/wallet/hooks";
import { convertAmount } from "@/util/common";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    address?: string;
    available?: number;
}

const WalletInfo = ({address = '', available = 0}:Props) => {
    const {balance} = useBalanceData(address);
    const [availableValue, setAvailableValue] = useState(balance);

    const availableBalance = useMemo(() => {
        return convertAmount(availableValue);
    }, [availableValue]);

    useEffect(() => {
        if(available !== 0) return setAvailableValue(available);
        return setAvailableValue(balance);
    }, [balance, available])
    
    return (
        <View style={styles.boxH}>
            <Text style={styles.title}>Available</Text>
            <Text style={styles.balance}>{availableBalance}
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