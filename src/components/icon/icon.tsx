import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";

interface Props {
    size: number;
    color?: string;
    active?: boolean;
}

export const Close = ({size, color}:Props) => {
    return (
        <Ionicons name="close-outline" size={size} color={color}/>
    )
}

export const QRCodeIcon = ({size, color}:Props) => {
    return (
        <Ionicons name="ios-qr-code-outline" size={size} color={color}/>
    )
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

export const Setting = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="setting" size={size} color={color}/>
    )
}

export const BackArrow = ({size, color}:Props) => {
    return (
        <MaterialIcons name="arrow-back-ios" size={size} color={color}/>
    )
}

export const ForwardArrowWithTail = ({size, color}:Props) => {
    return (
        <Ionicons name="arrow-forward" size={size} color={color}/>
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

export const CaretUp = ({size, color}:Props) => {
    return (
        <Ionicons name="caret-up" size={size} color={color} />
    )
}

export const Radio = ({size, color, active}:Props) => {
    return (
        <MaterialCommunityIcons name={active?"radiobox-marked":"radiobox-blank"} size={size} color={color} />
    )
}

export const Person = ({size, color}:Props) => {
    return (
        <Ionicons name="ios-person-circle-outline" size={size} color={color} />
    )
}

export const ExclamationCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="exclamationcircleo" size={size} color={color} />
    )
}

export const QuestionCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="questioncircleo" size={size} color={color} />
    )
}

export const SuccessCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="checkcircleo" size={size} color={color} />
    )
}

export const FailCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="closecircleo" size={size} color={color} />
    )
}

export const SortASC = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="sort-ascending" size={size} color={color} />
    )
}

export const SortDESC = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="sort-descending" size={size} color={color} />
    )
}

export const FingerPrint = ({size, color}:Props) => {
    return (
        <Ionicons name="ios-finger-print" size={size} color={color} />
    )
}

export const ExternalLink = ({size, color}:Props) => {
    return (
        <Octicons name="link-external" size={size} color={color} />
    )
}

