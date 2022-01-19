import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { WhiteColor } from "../../constants/theme";

interface Props {
    onPressEvent: Function;
}

const ArrowButton = ({onPressEvent}:Props) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={() => onPressEvent()}>
            <Icon name="arrow-back-ios" color={WhiteColor} size={25} />
        </TouchableOpacity>
    );
};

export default ArrowButton;