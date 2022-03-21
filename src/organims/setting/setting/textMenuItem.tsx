import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BgColor, BoxColor, Lato, TextColor, WhiteColor } from "@/constants/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Props {
    title: string;
    content: string;
    bgColor?: string;
    icon?: boolean;
    iconType?: string;
    iconName?: string;
}

const TextMenuItem = ({title, content, bgColor = BoxColor, icon = false, iconType = "", iconName = ""}:Props) => {

    const Icon = () => {
        switch (iconType) {
            case "MaterialCommunityIcons":
                return <MaterialCommunityIcons name={iconName} size={15} color={WhiteColor} />
            case "MaterialIcons":
                return <MaterialIcons name={iconName} size={15} color={WhiteColor} />
            case "AntDesign":
                return <AntDesignIcons name={iconName} size={15} color={WhiteColor} />
            case "Ionicons":
                return <Ionicons name={iconName} size={15} color={WhiteColor} />
            default:
                break;
        }
    }

    return (
        <View style={[styles.listItem, {backgroundColor: bgColor}]}>
            <Text style={styles.itemTitle}>{title}</Text>
            <View style={styles.contentWrapper}>
                <Text style={[styles.content, {paddingRight: icon? 5:0}]}>{content}</Text>
                {icon && Icon()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
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
    contentWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    content: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
    }
})

export default TextMenuItem;