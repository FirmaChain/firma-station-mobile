import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Lato, TextDarkGrayColor, TextDisableColor } from "@/constants/theme";

interface Props {
    title: string;
    data: string;
}

const DataSection = ({title, data}:Props) => {
    return (
        <View style={styles.vdWrapperH}>
            <Text style={styles.descTitle}>{title}</Text>
            <Text style={styles.descItem}>{data}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    descTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDisableColor,
    },
    descItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "600",
        color: TextDarkGrayColor,
    },
})

export default DataSection;