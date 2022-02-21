import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { BgColor, BoxColor, DisableColor, Lato, PointLightColor, TextGrayColor } from "../../constants/theme";
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
                    {delegations && <Text style={{color: PointLightColor}}> {delegations.length}</Text>}
                </Text>
            </View>
            {delegations && delegations.map((value, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => navigateValidator(value.validatorAddress)}>
                        <View style={[styles.item]}>
                            <MonikerSection validator={value} />
                            <DataSection title="Delegated" data={convertAmount(value.amount) + " FCT"} />
                            <DataSection title="Reward" data={convertAmount(value.reward) + " FCT"} />
                            <View style={{paddingBottom: 22}} />
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
        paddingHorizontal: 20,
        backgroundColor: BoxColor,
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 5,
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    item : {
        paddingTop: 22,
        backgroundColor: BgColor,
        marginVertical: 5,
        borderRadius: 8,
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