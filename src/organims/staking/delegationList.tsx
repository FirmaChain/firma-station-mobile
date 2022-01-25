import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BoxColor, DisableColor, Lato, PointLightColor, TextGrayColor } from "../../constants/theme";
import MonikerSection from "./parts/list/monikerSection";
import DataSection from "./parts/list/dataSection";
import { StakeInfo } from "@/hooks/staking/hooks";
import { convertAmount } from "@/util/common";

interface Props {
    delegations: Array<StakeInfo>;
    navigateValidator: Function;
}

const DelegationList = ({delegations, navigateValidator}:Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List 
                    <Text style={{color: PointLightColor}}> {delegations.length}</Text>
                </Text>
            </View>
            {delegations.map((value, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => navigateValidator(value.validatorAddress)}>
                        <View style={[styles.item]}>
                            <MonikerSection validator={value} />
                            <DataSection title="Delegated" data={convertAmount(value.amount) + " FCT"} />
                            <DataSection title="Reward" data={convertAmount(value.reward) + " FCT"} />
                            <View style={{paddingBottom: 22}} />
                            {index < delegations.length - 1  && <View style={styles.divider} />}
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        overflow: "hidden",
        justifyContent: 'center',
        marginBottom: 20,
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: BoxColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    item : {
        paddingTop: 22,
        backgroundColor: BoxColor,
    },
    title: {
        flex: 2,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: DisableColor,
    }
})

export default DelegationList;