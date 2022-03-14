import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, Lato, TextAddressColor, TextColor } from "@/constants/theme";
import { EXPLORER } from "@/../config";

interface Props {
    title: string;
    path: string;
    address: string;
}

const AddressBox = ({title, path, address}:Props) => {
    const openExplorer = (URL:string) => {
        Linking.openURL(EXPLORER + "/" + path + "/" + URL);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.box]}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => openExplorer(address)}>
                    <Text style={styles.content} numberOfLines={1} ellipsizeMode={"middle"}>{address}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    box: {
        alignItems: "flex-start",
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderRadius: 8, 
        marginBottom: 16,
        backgroundColor: BoxColor,
    },
    title: {
        width: "auto",
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "600",
        color: TextColor,
        opacity: .6,
        paddingBottom: 8,
    },
    content: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "normal",
        color: TextAddressColor,
        paddingBottom: 5,
    },
})

export default AddressBox;