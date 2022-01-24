
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { BoxColor, BoxDarkColor } from "../../../constants/theme";
import Header from "../../header/header";
import TitleBar from "../titleBar";

interface Props {
    title?: string;
    titleOn?: boolean;
    step?: number;
    backEvent: Function;
    children: JSX.Element;
}

const Container = ({title = "", titleOn = true, step = 0, backEvent, children}:Props) => {
    const handleMoveBack = () => {
        backEvent && backEvent();
    }

    return (
        <View style={styles.container}>
            <Header step={step} onPressEvent={() => handleMoveBack()} />
            {titleOn && <TitleBar title={title} />}
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
        backgroundColor: BoxDarkColor,
    },
})

export default Container;