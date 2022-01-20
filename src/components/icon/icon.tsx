import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesignIcons from "react-native-vector-icons/AntDesign";

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
