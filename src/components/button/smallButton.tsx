import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { BgColor, DisableButtonColor, Lato, PointColor, TextColor, TextGrayColor, WhiteColor } from "@/constants/theme";

interface Props {
    title: string;
    onPressEvent: Function;
    size?: number;
    height?: number;
    color?: string;
    active?: boolean;
    border?: boolean;
    disableColor?: string;
}

const SmallButton = ({title, onPressEvent, size = 100, height, color = PointColor, active = true, border = false, disableColor = DisableButtonColor}:Props) => {
    const [buttonHeight, setButtonHeight] = useState(42);
    const handleOnPress = (value?:any) => {
        if(active === false) return;
        onPressEvent && onPressEvent(value);
    }

    const backgroundColor = useMemo(() => {
        if(active){
            if(border){
                return BgColor;
            } else {
                return color;
            }
        } else {
            return disableColor;
        }
    }, [active, border, color])

    useEffect(() => {
        if(height === 0) return setButtonHeight(0);
        return setButtonHeight(42);
    }, [height]);

    return (
        <TouchableOpacity 
            disabled={!active}
            style={[styles.button, 
                {width: size, 
                height: buttonHeight, 
                borderWidth: (border && active)? 1:0,
                borderColor: WhiteColor,
                backgroundColor: backgroundColor}]} 
            onPress={()=>handleOnPress()}>
            <Text style={[styles.buttonText, {opacity: active? 1: 0.5, color: TextColor}]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default SmallButton;

const styles = StyleSheet.create({
    button: {
        height: 42,
        overflow: "hidden",
        borderRadius: 4,
        justifyContent: "center",
    },
    buttonText: {
        fontFamily: Lato,
        color: TextColor,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "normal",
    }
})