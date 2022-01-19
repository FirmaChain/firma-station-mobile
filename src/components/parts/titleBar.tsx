import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Lato, TextColor } from "../../constants/theme";
import { ScreenWidth } from "../../util/getScreenSize";

interface Props {
    title: string;
}

const TitleBar = ({title}:Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
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
    },
    title: {
        fontFamily: Lato,
        fontSize: 24,
        fontWeight: 'bold',
        color: TextColor,
    }
})

export default TitleBar;