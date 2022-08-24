import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { convertAmount } from "@/util/common";
import { BgColor } from "@/constants/theme";
import { RESTAKE_STATUS } from "@/constants/common";
import DataSection from "../list/dataSection";
import MonikerSection from "../list/monikerSection";

interface IProps {
    data: any;
    navigate: (address:string) => void;
}

const RestakeItem = ({data, navigate}:IProps) => {
    const status = useMemo(() => {
        if(data.delegated === 0){
            return RESTAKE_STATUS["NO_DELEGATION"];
        } else {
            if(data.isActive){
                return RESTAKE_STATUS["ACTIVE"];
            } else {
                return RESTAKE_STATUS["INACTIVE"];
            }
        }
    }, [data])

    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item]}>
                <MonikerSection validator={data} />
                <DataSection title="Delegated" data={convertAmount(data.delegated, true, 6) + " FCT"} />
                <DataSection title="Reward" data={convertAmount(data.stakingReward, true, 6) + " FCT"} />
                <DataSection title="Grant Status" data={status.title} color={status.color} label={true}/>
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

export default RestakeItem;