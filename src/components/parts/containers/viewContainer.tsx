import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface Props {
    bgColor?: string;
    full?: boolean;
    children: JSX.Element;
}

const ViewContainer = ({bgColor, full = false, children}:Props) => {
    return (
        <View 
            style={[styles.viewContainer, 
            {backgroundColor: bgColor, 
            paddingBottom: full? 0 : Platform.OS === "ios"? 50 : 30}]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 6,
    },
})

export default ViewContainer;