import { BorderColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import { convertAmount, convertNumber } from "@/util/common";
import { getBalanceFromAdr } from "@/util/firma";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    walletName: string;
    address: string;
}

const WalletInfo = ({walletName, address}:Props) => {

    const [available, setAvailable] = useState(0);

    const availableBalance = useMemo(() => {
        return convertAmount(available);
    }, [available]);

    useEffect(() => {
        const getAvailable = async() => {
            const balance = await getBalanceFromAdr(address);
            setAvailable(convertNumber(balance));
        }
        getAvailable();
    }, []);
    
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