import React from "react";
import { StyleSheet, View } from "react-native";
import { convertAmount, convertTime } from "@/util/common";
import { RedelegationInfo } from "@/hooks/staking/hooks";
import { BgColor } from "@/constants/theme";
import DataSection from "../list/dataSection";
import MonikerSectionForRedelegate from "../list/monikerSectionForRedelegate";

interface Props {
    data: RedelegationInfo;
    navigate: (address:string) => void;
}


const RedelegateItem = ({data, navigate}:Props) => {
    return (
        <View style={[styles.item]}>
            <MonikerSectionForRedelegate validators={data} navigateValidator={navigate}/>
            <DataSection title="Amount" data={convertAmount(data.balance) + " FCT"} />
            <DataSection title="Linked Until" data={convertTime(data.completionTime, true)} />
            <View style={{paddingBottom: 22}} />
        </View>
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

export default RedelegateItem;