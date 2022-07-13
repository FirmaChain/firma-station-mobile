import React from "react";
import { BgColor, BoxColor, Lato, TextColor, WhiteColor } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ForwardArrow } from "@/components/icon/icon";

interface IProps {
    title: string;
    path: string;
    handleMenus: (path:string) => void;
}

const MenuItem = ({title, path, handleMenus}:IProps) => {
    return (
        <TouchableOpacity onPress={()=>handleMenus(path)}>
            <View style={styles.listItem}>
                <Text style={styles.itemTitle}>{title}</Text>
                <ForwardArrow size={20} color={WhiteColor} />
            </View>
        </TouchableOpacity>
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
})

export default MenuItem;