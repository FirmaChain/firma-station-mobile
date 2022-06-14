import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSelfDelegationData, ValidatorData } from "@/hooks/staking/hooks";
import { convertAmount } from "@/util/common";
import { BoxColor, DividerColor, Lato, PointLightColor, TextColor, TextDarkGrayColor, TextGrayColor } from "@/constants/theme";

interface Props {
    data: ValidatorData;
}

const cols = 2;
const marginHorizontal = 0;
const marginVertical = 4;
const width = (Dimensions.get('window').width / cols) - (marginHorizontal * (cols + 1));

const PercentageBox = ({data}:Props) => {

    // chain upgrade response
    const {selfDelegation} = useSelfDelegationData(data.address.operatorAddress, data.address.accountAddress);

    const percentData = [
        {row: [{
            title: "Voting Power",
            data: data.votingPower.data,
            amount: data.votingPower.amount,
        },{
            title: "Self-Delegation",
            data: selfDelegation.data,
            amount: selfDelegation.amount,
        }]},
        {row: [{
            title: "Commission",
            data: data.commission.data,
        },{
            title: "Uptime",
            data: data.uptime.data,
        }]}
    ]

    return (
        <View style={[styles.container]}>
            <View style={[styles.box, {paddingHorizontal: 20, paddingVertical: 18, marginBottom: 16}]}>
                <View style={[styles.wrapperH, {flex: 1, justifyContent: "space-around"}]}>
                    <Text style={styles.title}>APR</Text>
                    <Text style={styles.data}>{data.APR} %</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.wrapperH, {flex: 1, justifyContent: "space-around"}]}>
                    <Text style={styles.title}>APY</Text>
                    <Text style={styles.data}>{data.APY} %</Text>
                </View>
            </View>

            <View style={[styles.box, {paddingVertical: 24}]}>
                <View style={styles.wrapBox}>
                    {/* 
                    // chain upgrade response
                    {data.state.map((grid, index) => {
                    */}
                    {percentData.map((grid, index) => {
                        return (
                        // chain upgrade response
                        // <View key={index} style={[styles.wrapperH, index < data.state.length - 1 && {paddingBottom: 34}]}>
                        <View key={index} style={[styles.wrapperH, index < percentData.length - 1 && {paddingBottom: 34}]}>
                            {grid.row.map((item:any, index:number) => {
                                return (
                                <View key={index} style={[styles.wrapperH, {flex: 1, alignItems: "center"}]}>
                                    <View style={[styles.wrapperV, {alignItems:"center", flex: 1}]}>
                                        <Text style={[styles.title, {fontSize: 14, paddingBottom: 10, color: TextDarkGrayColor}]}>{item.title}</Text>
                                        <Text style={[styles.data, {fontSize: 22, paddingBottom: 6}]}>{item.data}%</Text>
                                        {item.amount === undefined? null:<Text style={styles.desc}>{convertAmount(item.amount, false)} FCT</Text>}
                                    </View>
                                    {(index < grid.row.length - 1) && <View style={[styles.divider, {height: 54}]}/>}
                                </View>
                                )
                            })}
                        </View>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    box: {
        flexDirection: "row",
        backgroundColor: BoxColor,
        borderRadius: 8,
    },
    wrapBox: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    wrapperH: {
        flexDirection: "row",
        alignItems: "center",
    },
    wrapperV: {
        alignItems: "flex-start",
    },
    divider: {
        width: 1,
        backgroundColor: DividerColor,
    },
    title: {
        fontFamily: Lato,
        fontWeight: "600",
        fontSize: 16,
        color: PointLightColor,
    },
    data: {
        fontFamily: Lato,
        fontWeight: "600",
        fontSize: 18,
        color: TextColor,
    },
    desc: {
        fontFamily: Lato,
        fontWeight: "normal",
        fontSize: 13,
        color: TextGrayColor,
    },
    borderBox: {
        width: width,
        marginTop: marginVertical,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        alignItems: "center",
    },
})

export default PercentageBox;