import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BgColor, BoxColor, Lato, TextColor, WhiteColor } from "@/constants/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

interface Props {
    title: string;
    content: string;
    bgColor?: string;
    titleColor?: string;
    contentColor?: string;
    icon?: boolean;
    iconColor?: string;
    iconType?: string;
    iconName?: string;
}

const TextMenuItem = 
    ({title, 
    content, 
    bgColor = BoxColor, 
    titleColor = TextColor, 
    contentColor = TextColor, 
    icon = false, 
    iconColor = WhiteColor,
    iconType = "", 
    iconName = ""}:Props) => {

    const Icon = () => {
        switch (iconType) {
            case "MaterialCommunityIcons":
                return <MaterialCommunityIcons name={iconName} size={15} color={iconColor} />
            case "MaterialIcons":
                return <MaterialIcons name={iconName} size={15} color={iconColor} />
            case "AntDesign":
                return <AntDesignIcons name={iconName} size={15} color={iconColor} />
            case "Ionicons":
                return <Ionicons name={iconName} size={15} color={iconColor} />
            case "SimpleLineIcons":
                return <SimpleLineIcons name={iconName} size={15} color={iconColor} />
            default:
                break;
        }
    }

    return (
        <View style={[styles.listItem, {backgroundColor: bgColor}]}>
            <Text style={[styles.itemTitle, {color: titleColor}]}>{title}</Text>
            <View style={styles.contentWrapper}>
                <Text style={[styles.content, {color: contentColor, paddingRight: icon? 5:0}]}>{content}</Text>
                {icon && 
                <View style={{paddingTop: 1}}>
                    {Icon()}
                </View>
                }
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
    },
    contentWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    content: {
        fontFamily: Lato,
        fontSize: 16,
    }
})

export default TextMenuItem;