import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface IProps {
    bgColor?: string;
    full?: boolean;
    children: JSX.Element;
}

const ViewContainer = ({bgColor, full = false, children}:IProps) => {
    return (
        <View 
            style={[styles.viewContainer, 
            {backgroundColor: bgColor, 
            paddingBottom: full? 0 : Platform.select({android: 30, ios: 50}),}]}>
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