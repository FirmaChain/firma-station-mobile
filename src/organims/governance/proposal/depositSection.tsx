import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { convertToFctNumber } from "../../../util/common";

interface Props {
    data: any;
}

const DepositSection = ({data}:Props) => {

    const combinedDeposit = (proposalDeposit:Array<any>) => {
        let deposit:number = 0;
        proposalDeposit.map(data => deposit += Number(data.amount));

        return deposit;
    }

    return (
        <View style={styles.boxV}>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={[styles.infoTitle, {fontSize: 16}]}>Deposit</Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Deposit Period</Text>
                <Text style={styles.infoDesc}>{data.depositPeriod}</Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Min Deposit Amount</Text>
                <Text style={styles.infoDesc}>{convertToFctNumber(data.minDeposit).toFixed(2)} FCT</Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Current Deposit</Text>
                <Text style={styles.infoDesc}>{convertToFctNumber(combinedDeposit(data.proposalDeposit)).toFixed(2)} FCT</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boxH: {
        flexDirection: "row",
    },
    boxV: {
        alignItems: "flex-start",
    },
    boxInfo: {
        alignItems: "flex-start", 
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    infoTitle: {
        width: 100,
        color: "#aaa",
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 15,
    }, 
    infoDesc: {
        fontSize: 14,
        flex: 1,
    }
})

export default DepositSection;