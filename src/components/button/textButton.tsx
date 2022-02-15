import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Lato, TextColor } from "../../constants/theme";

const TextButton: React.FC<{
    title: string;
    onPressEvent: Function;
}> = ({title, onPressEvent}) => {
    const handleOnPress = (value?:any) => {
        onPressEvent && onPressEvent(value);
    }

    return (
        <TouchableOpacity style={{flexDirection: "row"}} onPress={()=>handleOnPress()}>
            <Text style={[styles.title, styles.button]}>{title}</Text>
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
        backgroundColor: "#0f3f92",
    },
})