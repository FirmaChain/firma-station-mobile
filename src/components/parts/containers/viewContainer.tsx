import React from "react";
import { Keyboard, Platform, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

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