import React from "react";
import { TouchableOpacity } from "react-native";
import { WhiteColor } from "../../constants/theme";
import { BackArrow } from "../icon/icon";

interface Props {
    onPressEvent: Function;
}

const ArrowButton = ({onPressEvent}:Props) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={() => onPressEvent()} style={{paddingRight: 15}}>
            <BackArrow size={25} color={WhiteColor} />
        </TouchableOpacity>
    );
};

export default ArrowButton;