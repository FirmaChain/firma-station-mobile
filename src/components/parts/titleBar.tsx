import React from "react";
import { Keyboard, Pressable, StyleSheet, Text } from "react-native";
import { Lato, TextColor } from "@/constants/theme";
import { ScreenWidth } from "@/util/getScreenSize";

interface Props {
    title: string;
}

const TitleBar = ({title}:Props) => {
    return (
        <Pressable style={styles.container} onPress={()=>Keyboard.dismiss()}>
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: ScreenWidth(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 18,
    },
    title: {
        fontFamily: Lato,
        fontSize: 24,
        fontWeight: 'bold',
        color: TextColor,
    }
})

export default TitleBar;