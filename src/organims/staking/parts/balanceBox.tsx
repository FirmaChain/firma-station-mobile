import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../components/button/button";
import SmallButton from "../../../components/button/smallButton";
import { BoxColor, ContainerColor, DisableColor, Lato, TextCatTitleColor, TextColor } from "../../../constants/theme";
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
                        <View style={styles.box}>
                            <View key={index} style={styles.wrapper}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.desc}>{item.data.toFixed(2)}
                                    <Text style={[styles.title, {fontSize: 14}]}>  FCT</Text>
                                </Text>
                            </View>
                            {index < balances.length - 1 && <View style={styles.dividerV} />}
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
        textAlign: "left",
    },
    desc: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        textAlign: "right",
    }
    // box: {
    //     flexDirection: "row",
    //     flexWrap: "wrap",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // borderBox: {
    //     width: width,
    //     justifyContent: "space-evenly",
    //     marginTop: marginVertical,
    //     marginBottom: marginVertical,
    //     marginLeft: marginHorizontal,
    //     marginRight: marginHorizontal,
    //     borderColor: ContainerColor, 
    //     borderWidth: 1,
    //     borderRadius: 8,
    //     padding: 10,
    // },
})

export default BalanceBox;