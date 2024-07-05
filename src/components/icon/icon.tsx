import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

interface IProps {
    size: number;
    color?: string;
    active?: boolean;
}

export const Close = ({ size, color }: IProps) => {
    return <Ionicons name="ios-close" size={size} color={color} />;
};

export const QRCodeIcon = ({ size, color }: IProps) => {
    return <MaterialIcons name="qr-code" size={size} color={color} />;
};

export const QRCodeScannerIcon = ({ size, color }: IProps) => {
    return <MaterialIcons name="qr-code-scanner" size={size} color={color} />;
};

export const Copy = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="content-copy" size={size} color={color} />;
};

export const Paste = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="content-paste" size={size} color={color} />;
};

export const Setting = ({ size, color }: IProps) => {
    return <AntDesignIcons name="setting" size={size} color={color} />;
};

export const TopRightArrow = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="arrow-top-right" size={size} color={color} />;
};

export const BackArrow = ({ size, color }: IProps) => {
    return <MaterialIcons name="arrow-back-ios" size={size} color={color} />;
};

export const ForwardArrowWithTail = ({ size, color }: IProps) => {
    return <Ionicons name="arrow-forward" size={size} color={color} />;
};

export const BackArrowWithTail = ({ size, color }: IProps) => {
    return <Ionicons name="arrow-back" size={size} color={color} />;
};

export const ForwardArrow = ({ size, color }: IProps) => {
    return <MaterialIcons name="arrow-forward-ios" size={size} color={color} />;
};

export const DownArrow = ({ size, color }: IProps) => {
    return <AntDesignIcons name="caretdown" size={size} color={color} />;
};
export const UpArrow = ({ size, color }: IProps) => {
    return <AntDesignIcons name="caretup" size={size} color={color} />;
};

export const UpEmptyArrow = ({ size, color }: IProps) => {
    return <AntDesignIcons name="up" size={size} color={color} />;
};

export const DownEmptyArrow = ({ size, color }: IProps) => {
    return <AntDesignIcons name="down" size={size} color={color} />;
};

export const MoreViewArrow = ({ size, color }: IProps) => {
    return <Ionicons name="caret-up" size={size} color={color} />;
};

export const RefreshIcon = ({ size, color }: IProps) => {
    return <MaterialIcons name="refresh" size={size} color={color} />;
};

export const Radio = ({ size, color, active }: IProps) => {
    return <MaterialCommunityIcons name={active ? 'radiobox-marked' : 'radiobox-blank'} size={size} color={color} />;
};

export const Person = ({ size, color }: IProps) => {
    return <Ionicons name="ios-person-circle-outline" size={size} color={color} />;
};

export const ExclamationCircle = ({ size, color }: IProps) => {
    return <AntDesignIcons name="exclamationcircleo" size={size} color={color} />;
};

export const QuestionCircle = ({ size, color }: IProps) => {
    return <AntDesignIcons name="questioncircleo" size={size} color={color} />;
};

export const QuestionFilledCircle = ({ size, color }: IProps) => {
    return <AntDesignIcons name="questioncircle" size={size} color={color} />;
};

export const SuccessCircle = ({ size, color }: IProps) => {
    return <AntDesignIcons name="checkcircleo" size={size} color={color} />;
};

export const VerifiedCircle = ({ size, color }: IProps) => {
    return <MaterialIcons name="verified" size={size} color={color} />;
};

export const VoteCircle = ({ size, color }: IProps) => {
    return <Octicons name="check-circle-fill" size={size} color={color} />;
};

export const SuccessFilledCircle = ({ size, color }: IProps) => {
    return <AntDesignIcons name="checkcircle" size={size} color={color} />;
};

export const FailCircle = ({ size, color }: IProps) => {
    return <AntDesignIcons name="closecircleo" size={size} color={color} />;
};

export const FailFilledCircle = ({ size, color }: IProps) => {
    return <AntDesignIcons name="closecircle" size={size} color={color} />;
};

export const SortASC = ({ size, color }: IProps) => {
    return <Octicons name="sort-asc" size={size} color={color} />;
};

export const SortDESC = ({ size, color }: IProps) => {
    return <Octicons name="sort-desc" size={size} color={color} />;
};

export const FingerPrint = ({ size, color }: IProps) => {
    return <Ionicons name="ios-finger-print" size={size} color={color} />;
};

export const ExternalLink = ({ size, color }: IProps) => {
    return <Octicons name="link-external" size={size} color={color} />;
};

export const ListEdit = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="playlist-edit" size={size} color={color} />;
};

export const ListEditDone = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="playlist-check" size={size} color={color} />;
};

export const CheckIcon = ({ size, color }: IProps) => {
    return <Ionicons name="checkmark-sharp" size={size} color={color} />;
};

export const MenuIcon = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="menu" size={size} color={color} />;
};

export const ScrollToTop = ({ size, color }: IProps) => {
    return <AntDesignIcons name="upcircle" size={size} color={color} />;
};

export const SendIcon = ({ size, color }: IProps) => {
    return <FontAwesome name="send" size={size} color={color} />;
};

export const LockIcon = ({ size, color }: IProps) => {
    return <SimpleLineIcons name="lock" size={size} color={color} />;
};

export const URLLockIcon = ({ size, color }: IProps) => {
    return <FontAwesome name="lock" size={size} color={color} />;
};

export const ValidateIcon = ({ size, color }: IProps) => {
    return <AntDesignIcons name="rightsquare" size={size} color={color} />;
};

export const SquareIcon = ({ size, color }: IProps) => {
    return <Ionicons name="ios-square" size={size} color={color} />;
};

export const StarIcon = ({ size, color }: IProps) => {
    return <Fontisto name="asterisk" size={size} color={color} />;
};

export const FavoriteIcon = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="card-account-details-star-outline" size={size} color={color} />;
};

export const BookmarkPlusIcon = ({ size, color }: IProps) => {
    return <MaterialCommunityIcons name="bookmark-plus-outline" size={size} color={color} />;
};

export const RemoveIcon = ({ size, color }: IProps) => {
    return <Ionicons name="ios-remove-circle-outline" size={size} color={color} />;
};
