import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BoxColor, DividerColor, Lato, PointLightColor, TextColor, TextDarkGrayColor, TextGrayColor } from "../../../constants/theme";
import { convertAmount } from "../../../util/common";

interface Props {
    APR: string;
    APY: string;
    dataArr: Array<any>;
}

const cols = 2;
const marginHorizontal = 0;
const marginVertical = 4;
const width = (Dimensions.get('window').width / cols) - (marginHorizontal * (cols + 1));

const PercentageBox = ({APR, APY, dataArr}:Props) => {

    return (
        <View style={[styles.container]}>
            <View style={[styles.box, {paddingHorizontal: 20, paddingVertical: 18, marginBottom: 16}]}>
                <View style={[styles.wrapperH, {flex: 1, justifyContent: "space-around"}]}>
                    <Text style={styles.title}>APR</Text>
                    <Text style={styles.data}>{APR} %</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.wrapperH, {flex: 1, justifyContent: "space-around"}]}>
                    <Text style={styles.title}>APY</Text>
                    <Text style={styles.data}>{APY} %</Text>
                </View>
            </View>

            <View style={[styles.box, {paddingVertical: 24}]}>
                <View style={styles.wrapBox}>
                    {dataArr.map((grid, index) => {
                        return (
                        <View key={index} style={[styles.wrapperH, index < dataArr.length - 1 && {paddingBottom: 34}]}>
                            {grid.row.map((item:any, index:number) => {
                                return (
                                <View key={index} style={[styles.wrapperH, {flex: 1, alignItems: "center"}]}>
                                    <View style={[styles.wrapperV, {alignItems:"center", flex: 1}]}>
                                        <Text style={[styles.title, {fontSize: 14, paddingBottom: 10}]}>{item.title}</Text>
                                        <Text style={[styles.data, {fontSize: 22, paddingBottom: 6}]}>{item.data}%</Text>
                                        {item?.amount && <Text style={styles.desc}>{convertAmount(item.amount, false)} FCT</Text>}
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