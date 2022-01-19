import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface Props {
    bgColor?: string;
    children: JSX.Element;
}

const ViewContainer = ({bgColor, children}:Props) => {
    return (
        <View style={[styles.viewContainer, {backgroundColor: bgColor}]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 6,
        paddingBottom: Platform.OS === "ios"? 50 : 30,
    },
})

export default ViewContainer;