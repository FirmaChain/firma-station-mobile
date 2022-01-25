import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

interface Props {
    size: number;
    color?: string;
}

export const Copy = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="content-copy" size={size} color={color}/>
    )
}

export const Paste = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="content-paste" size={size} color={color}/>
    )
}

export const ForwardArrow = ({size, color}:Props) => {
    return (
        <MaterialIcons name="arrow-forward-ios" size={size} color={color}/>
    )
}

export const DownArrow = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="caretdown" size={size} color={color} />
    )
}

export const UpEmptyArrow = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="up" size={size} color={color} />
    )
}

export const Person = ({size, color}:Props) => {
    return (
        <Ionicons name="ios-person-circle-outline" size={size} color={color} />
    )
}