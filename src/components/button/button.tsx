import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderColor, DisableColor, Lato, PointColor, TextColor, TextDisableColor, TextGrayColor } from "@/constants/theme";

const Button: React.FC<{
    title: string;
    active: boolean;
    border?: boolean;
    onPressEvent: () => void;
}> = ({title, active, border = false, onPressEvent}) => {

    return (
        <TouchableOpacity 
            disabled={!active} 
            onPress={() => onPressEvent()}
            style={[styles.button , !active? styles.disableButton : border? styles.borderButton : styles.blueButton]} >
            <Text style={[styles.text, !active?{color: TextDisableColor}: border?{color:TextGrayColor}:{color:TextColor}]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button;

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        borderRadius: 4,
    },
    disableButton: {
        backgroundColor: DisableColor,
    },
    blueButton: {
        backgroundColor: PointColor,
    },
    borderButton: {
        borderWidth: 1,
        borderColor: BorderColor,
    },
    text: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    }
})