import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ContainerColor } from "../../../constants/theme";
import { ConvertAmount } from "../../../util/common";

interface Props {
    aprApy: any;
    dataArr: Array<any>
}

const cols = 2;
const marginHorizontal = 0;
const marginVertical = 4;
const width = (Dimensions.get('window').width / cols) - (marginHorizontal * (cols + 1));

const PercentageBox = ({aprApy, dataArr}:Props) => {
    return (
        <View style={[styles.boxV, {paddingHorizontal: 20}]}>
            <View style={[styles.borderBox, {width: "100%"}]}>
                <Text style={styles.desc}>APR / <Text style={[styles.desc, {fontSize: 10}]}>APY</Text></Text>
                <Text style={styles.content}>{aprApy.APR}% / <Text style={{fontSize: 12}}>{aprApy.APY}%</Text></Text>
            </View>
            <View style={styles.box}>
                {dataArr.map((grid, index) => {
                    return (
                    <View key={index} style={[styles.boxH, {width: "100%"}]}>
                        {grid.row.map((item:any, index:number) => {
                            return (
                            <View key={index} style={[styles.boxH, {flex: 1}]}>
                                <View style={[styles.borderBox, {flex: 1}]}>
                                    <Text style={styles.desc}>{item.title}</Text>
                                    <Text style={styles.content}>{item.data}%</Text>
                                    {item?.amount && <Text style={[styles.desc, {textAlign: "right"}]}>{ConvertAmount(item.amount, false)} FCT</Text>}
                                </View>
                                {(index < grid.row.length - 1) && <View style={{width: 10}}/>}
                            </View>
                            )
                        })}
                    </View>
                    )
                })}
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    boxH: {
        flexDirection: "row",
    },
    boxV: {
        alignItems: "flex-start",
    },
    borderBox: {
        width: width,
        marginTop: marginVertical,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        borderColor: ContainerColor, 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    desc: {
        width: "auto",
        color: "#aaa",
        fontSize: 12,
        paddingBottom: 5,
    },
    content: {
        width: "100%",
        color: "#1e1e1e",
        textAlign: "right",
        fontSize: 16,
        paddingBottom: 5,
    },
})

export default PercentageBox;