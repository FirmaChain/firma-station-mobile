import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ContainerColor, TextGrayColor } from "../../../constants/theme";
import { convertToFctNumber } from "../../../util/common";

interface Props {
    delegations: Array<any>
}

const DelegationsListBox = ({delegations}:Props) => {
    const delegator = delegations.sort((a, b) => (b.amount - a.amount));

    const convertAmount = (amount:string | number) => {
        return Number(convertToFctNumber(amount).toFixed(2)).toLocaleString(undefined, {minimumFractionDigits: 2});
    }

    return (
        <View style={[styles.boxV, {flex: 1, marginVertical: 5}]}>
            <View style={[styles.boxH, {backgroundColor: ContainerColor, borderTopLeftRadius: 8, borderTopRightRadius: 8}]}>
                <Text style={[styles.text, {color: TextGrayColor}]}>Delegator</Text>
                <Text style={[styles.text, {color: TextGrayColor, textAlign: "right"}]}>Amount</Text>
            </View>
            <View style={styles.borderBox}>
                <ScrollView>
                {delegator.map((item, index) => {
                    return (
                        <View key={index} style={[styles.boxH, (index < delegations.length - 1) && styles.border]}>
                            <Text numberOfLines={1} ellipsizeMode="middle" style={styles.text}>{item.address}</Text>
                            <Text style={[styles.text, {textAlign: "right"}]}>{convertAmount(item.amount)} FCT</Text>
                        </View>
                    )
                })}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    boxH: {
        width: "100%", 
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    border: {
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
    },
    boxV: {
        alignItems: "flex-start",
    },
    borderBox: {
        borderColor: ContainerColor, 
        borderWidth: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        maxHeight: 150,
    },
    text: {
        flex: 1,
    },

})

export default DelegationsListBox;