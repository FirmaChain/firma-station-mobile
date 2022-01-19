import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Lato, PointColor, TextColor } from "../../constants/theme";

const SmallButton: React.FC<{
    title: string;
    onPressEvent: Function;
    size?: number
}> = ({title, onPressEvent, size = 100}) => {

    const handleOnPress = (value?:any) => {
        onPressEvent && onPressEvent(value);
    }

    return (
        <TouchableOpacity onPress={()=>handleOnPress()}>
            <Text style={[styles.button, {width: size}]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default SmallButton;

const styles = StyleSheet.create({
    
    button: {
        fontFamily: Lato,
        color: TextColor,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "normal",
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: PointColor,
        overflow: "hidden",
        borderRadius: 4,
    },
})