import React from "react";
import { Keyboard, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GrayColor, Lato, TextCatTitleColor, TextColor, TextWarnColor } from "@/constants/theme";
import { ScreenWidth } from "@/util/getScreenSize";
import { QuestionFilledCircle } from "../icon/icon";

interface Props {
    title: string;
    handleGuide?: ()=>void;
}

const TitleBar = ({title, handleGuide}:Props) => {
    return (
        <Pressable style={styles.container} onPress={()=>Keyboard.dismiss()}>
            <Text style={styles.title}>{title}</Text>
            {handleGuide &&
            <TouchableOpacity style={styles.guide} onPress={()=>handleGuide()}>
                <QuestionFilledCircle size={18} color={GrayColor}/>
            </TouchableOpacity>
            }
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: ScreenWidth(),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 18,
    },
    title: {
        fontFamily: Lato,
        fontSize: 24,
        fontWeight: 'bold',
        color: TextColor,
    },
    guide: {
        paddingLeft: 5,
        paddingRight: 10,
        paddingVertical: 5,
        marginTop: 3,
    }
})

export default TitleBar;