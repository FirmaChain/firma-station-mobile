import React from "react";
import { BgColor, BoxColor, Lato, TextColor } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    title: string;
    content: string;
}

const TextMenuItem = ({title, content}:Props) => {
    return (
        <View style={styles.listItem}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: BoxColor,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: .5,
        borderBottomColor: BgColor,
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    },
    content: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
    }
})

export default TextMenuItem;