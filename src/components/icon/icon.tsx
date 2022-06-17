import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

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


export const TopRightArrow = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="arrow-top-right" size={size} color={color}/>
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
export const UpArrow = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="caretup" size={size} color={color} />
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

export const QuestionFilledCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="questioncircle" size={size} color={color} />
    )
}

export const SuccessCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="checkcircleo" size={size} color={color} />
    )
}

export const VerifiedCircle = ({size, color}:Props) => {
    return (
        <MaterialIcons name="verified" size={size} color={color} />
    )
}

export const VoteCircle = ({size, color}:Props) => {
    return (
        <Octicons name="check-circle-fill" size={size} color={color} />
    )
}

export const SuccessFilledCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="checkcircle" size={size} color={color} />
    )
}

export const FailCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="closecircleo" size={size} color={color} />
    )
}

export const FailFilledCircle = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="closecircle" size={size} color={color} />
    )
}

export const SortASC = ({size, color}:Props) => {
    return (
        <Octicons name="sort-asc" size={size} color={color} />
    )
}

export const SortDESC = ({size, color}:Props) => {
    return (
        <Octicons name="sort-desc" size={size} color={color} />
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

export const ListEdit = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="playlist-edit" size={size} color={color} />
    )
}

export const ListEditDone = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="playlist-check" size={size} color={color} />
    )
}

export const CheckIcon = ({size, color}:Props) => {
    return (
        <Ionicons name="checkmark-sharp" size={size} color={color} />
    )
}

export const MenuIcon = ({size, color}:Props) => {
    return (
        <MaterialCommunityIcons name="menu" size={size} color={color} />
    )
}

export const ScrollToTop = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="upcircle" size={size} color={color} />
    )
}

export const SendIcon = ({size, color}:Props) => {
    return (
        <FontAwesome name="send" size={size} color={color} />
    )
}

export const LockIcon = ({size, color}:Props) => {
    return (
        <SimpleLineIcons name="lock" size={size} color={color} />
    )
}

export const ValidateIcon = ({size, color}:Props) => {
    return (
        <AntDesignIcons name="rightsquare" size={size} color={color} />
    )
}

export const SquareIcon = ({size, color}:Props) => {
    return (
        <Ionicons name="ios-square" size={size} color={color} />
    )
}
