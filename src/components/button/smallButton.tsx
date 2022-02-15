import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { DisableColor, Lato, PointColor, TextColor } from "../../constants/theme";

const SmallButton: React.FC<{
    title: string;
    onPressEvent: Function;
    size?: number;
    height?: number;
    color?: string;
    active?: boolean;
}> = ({title, onPressEvent, size = 100, height, color = PointColor, active = true}) => {
    const [buttonHeight, setButtonHeight] = useState(42);
    const handleOnPress = (value?:any) => {
        if(active === false) return;
        onPressEvent && onPressEvent(value);
    }

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
                backgroundColor: active?color:DisableColor}]} 
            onPress={()=>handleOnPress()}>
            <Text style={[styles.buttonText, {opacity: active? 1: 0.5}]}>{title}</Text>
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