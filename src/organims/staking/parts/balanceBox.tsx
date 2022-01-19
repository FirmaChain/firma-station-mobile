import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../components/button/button";
import SmallButton from "../../../components/button/smallButton";
import { ContainerColor } from "../../../constants/theme";
import RewardBox from "./rewardBox";

const cols = 3;
const marginHorizontal = 4;
const marginVertical = 4;
const width = ((Dimensions.get('window').width - 8) / cols) - (marginHorizontal * (cols + 1));

interface Props {
    balances: Array<any>;
}

const BalanceBox = ({balances}:Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                {balances.map((item, index) => {
                    return (
                        <View key={index} style={styles.borderBox}>
                            <Text style={{fontSize: 12, color: "#aaa"}}>{item.title}</Text>
                            <Text style={{textAlign: "right"}}>{item.data.toFixed(2)} FCT</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    box: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    borderBox: {
        width: width,
        justifyContent: "space-evenly",
        marginTop: marginVertical,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        borderColor: ContainerColor, 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
})

export default BalanceBox;