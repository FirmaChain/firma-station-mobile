import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { convertAmount, convertTime } from "@/util/common";
import { IUndelegationInfo } from "@/hooks/staking/hooks";
import { BgColor } from "@/constants/theme";
import DataSection from "../list/dataSection";
import MonikerSection from "../list/monikerSection";

interface IProps {
    data: IUndelegationInfo;
    navigate: (address:string) => void;
}


const UndelegateItem = ({data, navigate}:IProps) => {
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
    },
})

export default UndelegateItem;