import React from "react";
import { TouchableOpacity, Linking, StyleSheet, Text } from "react-native";
import { ContainerColor, TextGrayColor } from "../../constants/theme";

const ExplorerBox = () => {

    const moveToExplorer = () => {
        Linking.openURL('https://explorer-devnet.firmachain.org');
    }

    return (
        <TouchableOpacity style={styles.container} onPress={moveToExplorer}>
            <Text style={styles.title}>move to explorer</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        paddingHorizontal: 20,
        margin:20,
        borderRadius: 8,
        backgroundColor: ContainerColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: TextGrayColor,
    }
})

export default ExplorerBox;