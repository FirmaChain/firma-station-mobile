import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { InputBgColor, InputPlaceholderColor, Lato, TextColor, TextGrayColor, WhiteColor } from "@/constants/theme";

interface Props {
    title: string;
    value: string;
    focus: boolean;
    onPressEvent: Function;
}

const QuestionItem= ({title, value, focus, onPressEvent}:Props) => {
    const val = value;
    const bc = focus? WhiteColor : 'transparent';

    return (
        <View style={styles.viewContainer}>
            <Text style={styles.text}>{title}</Text>
            <TouchableOpacity
                onPress={() => onPressEvent()}>
                <Text style={[styles.quiz, {borderColor: bc, color: val === 'select'? TextGrayColor : TextColor}]}>{val}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default QuestionItem;

const styles = StyleSheet.create({
    viewContainer: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 20,
    },
    text: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
        marginBottom: 5,
    },
    quiz: {
        width: 170,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        color: InputPlaceholderColor,
        overflow: 'hidden'
    }
})
