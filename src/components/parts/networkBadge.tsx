import React from "react";
import { FailedColor, Lato, TextColor } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    top: number;
    title: string;
}

const NetworkBadge = ({top, title}:Props) => {
    return (
        <View style={[styles.container, {top: top}]}>
            <Text style={styles.badge}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute", 
        paddingHorizontal: 20, 
        width: "100%", 
        alignItems: "flex-end"
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: FailedColor,
        color: TextColor,
        fontFamily: Lato,
        fontWeight: "bold",
        fontSize: 12,
    }
})

export default NetworkBadge;