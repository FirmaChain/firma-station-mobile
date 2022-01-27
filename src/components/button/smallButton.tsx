import { LayoutAnim } from "@/util/animation";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Lato, PointColor, TextColor } from "../../constants/theme";

const SmallButton: React.FC<{
    title: string;
    onPressEvent: Function;
    size?: number;
    height?: number;
    color?: string;
}> = ({title, onPressEvent, size = 100, height, color = PointColor}) => {
    const [buttonHeight, setButtonHeight] = useState(42);
    const handleOnPress = (value?:any) => {
        LayoutAnim();
        onPressEvent && onPressEvent(value);
    }

    useEffect(() => {
        if(height === 0) return setButtonHeight(0);
        return setButtonHeight(42);
    }, [height]);

    return (
        <TouchableOpacity onPress={()=>handleOnPress()}>
            <Text style={[styles.button, {width: size, height: buttonHeight, lineHeight: buttonHeight, backgroundColor: color}]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default SmallButton;

const styles = StyleSheet.create({
    button: {
        height: 42,
        fontFamily: Lato,
        color: TextColor,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "normal",
        overflow: "hidden",
        borderRadius: 4,
    },
})