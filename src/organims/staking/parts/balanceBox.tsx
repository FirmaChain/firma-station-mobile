import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor } from "../../../constants/theme";
import { convertNumber, resizeFontSize } from "@/util/common";
import { StakingValues } from "@/hooks/staking/hooks";

interface Props {
    stakingValues: StakingValues;
}

const BalanceBox = ({stakingValues}:Props) => {

    const available = useMemo(() => {
        return stakingValues.available;
    }, [stakingValues])

    const delegated = useMemo(() => {
        return stakingValues.delegated;
    }, [stakingValues]);

    const undelegate = useMemo(() => {
        return stakingValues.undelegate;
    }, [stakingValues]);

    const StakingValues = [
        {title: "Available", data: available},
        {title: "Delegated", data: delegated},
        {title: "Undelegated", data: undelegate},
    ]

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                {StakingValues.map((item, index) => {
                    return (
                        <View key={index} style={styles.box}>
                            <View key={index} style={styles.wrapper}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={[styles.desc, {fontSize: resizeFontSize(item.data, 16)}]}>{convertNumber((item.data).toFixed(2)).toLocaleString()}</Text>
                            </View>
                            {index < StakingValues.length - 1 && <View style={styles.dividerV} />}
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: BoxColor,
        borderRadius: 8,
    },
    box: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    wrapper: {
        height: 50,
        justifyContent: "space-between",
    },
    dividerV: {
        width: .5,
        height: 50,
        marginLeft: 20,
        backgroundColor: DisableColor,
    },
    title: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor,
        textAlign: "center",
    },
    desc: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        textAlign: "center",
    }
})

export default BalanceBox;