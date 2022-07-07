import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { convertAmount, convertTime } from "@/util/common";
import { UndelegationInfo } from "@/hooks/staking/hooks";
import { BgColor } from "@/constants/theme";
import DataSection from "../list/dataSection";
import MonikerSection from "../list/monikerSection";

interface Props {
    data: UndelegationInfo;
    navigate: (address:string) => void;
}


const UndelegateItem = ({data, navigate}:Props) => {
    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item]}>
                <MonikerSection validator={data} />
                <DataSection title="Amount" data={convertAmount(data.balance) + " FCT"} />
                <DataSection title="Linked Until" data={convertTime(data.completionTime, true)} />
                <View style={{paddingBottom: 22}} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item : {
        paddingTop: 22,
        backgroundColor: BgColor,
        marginVertical: 5,
        borderRadius: 8,
    },
})

export default UndelegateItem;