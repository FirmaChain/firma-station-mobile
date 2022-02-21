import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ExclamationCircle } from "@/components/icon/icon";
import { BoxColor, Lato, TextWarnColor } from "@/constants/theme";

interface Props {
    bgColor?: string;
    text: string;
}

const WarnContainer = ({bgColor = BoxColor, text}:Props) => {
    return (
        <View style={[styles.wranContainer, {backgroundColor: bgColor}]}>
            <View style={styles.box}>
                <View style={{height: 20, justifyContent: "center"}}>
                    <ExclamationCircle size={15} color={TextWarnColor} />
                </View>
                <Text style={styles.warnText}>{text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wranContainer: {
        fontFamily: Lato,
        backgroundColor: BoxColor,
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 15,
        overflow: 'hidden',
    },
    box: {
        flexDirection: "row",
        justifyContent: "flex-start", 
        alignItems: "flex-start"
    },
    warnText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: TextWarnColor,
        paddingLeft: 10,
    },
})

export default WarnContainer;