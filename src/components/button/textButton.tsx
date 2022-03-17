import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { DisableColor, Lato, TextButtonColor, TextColor } from "@/constants/theme";

const TextButton: React.FC<{
    title: string;
    bgColor?: string;
    active?: boolean;
    onPressEvent: Function;
}> = ({title, bgColor = TextButtonColor, active = true, onPressEvent}) => {
    const backgroundColor = active? (bgColor? bgColor:TextButtonColor):DisableColor;

    const handleOnPress = (value?:any) => {
        onPressEvent && onPressEvent(value);
    }

    return (
        <TouchableOpacity disabled={!active} style={{flexDirection: "row"}} onPress={()=>handleOnPress()}>
            <Text style={[styles.title, styles.button, {backgroundColor: backgroundColor}]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default TextButton;

const styles = StyleSheet.create({
    
    title: {
        color: TextColor,
        fontFamily: Lato,
        fontSize: 14,
    },
    button :{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: "hidden",
    },
})