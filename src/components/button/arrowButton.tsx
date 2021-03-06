import React from "react";
import { TouchableOpacity } from "react-native";
import { WhiteColor } from "@/constants/theme";
import { BackArrow } from "../icon/icon";

interface IProps {
    onPressEvent: Function;
}

const ArrowButton = ({onPressEvent}:IProps) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={() => onPressEvent()} style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <BackArrow size={25} color={WhiteColor} />
        </TouchableOpacity>
    );
};

export default ArrowButton;