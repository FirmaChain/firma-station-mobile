import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Copy } from "../../../components/icon/icon";
import { ContainerColor } from "../../../constants/theme";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

interface Props {
    title: string;
    address: string;
}

const AddressBox = ({title, address}:Props) => {

    const copyToClipboard = () => {
        Clipboard.setString(address);

        const msg = 'Copied ' + title;
        
        Toast.show({
            type: 'info',
            text1: msg,
        });
    }

    return (
        <View style={{paddingHorizontal: 20}}>
            <TouchableOpacity onPress={() => copyToClipboard()}>
                <View style={[styles.boxV, styles.borderBox]}>
                    <View style={[styles.boxH, {width: "100%", justifyContent: "space-between"}]}>
                        <Text style={styles.desc}>{title}</Text>
                        <Copy size={13} />
                    </View>
                    <Text style={styles.content} numberOfLines={1} ellipsizeMode={"middle"}>{address}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    boxH: {
        flexDirection: "row",
    },
    boxV: {
        alignItems: "flex-start",
    },
    borderBox: {
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderColor: ContainerColor, 
        borderWidth: 1, 
        borderRadius: 8, 
        marginVertical: 5
    },
    desc: {
        width: "auto",
        color: "#aaa",
        fontSize: 12,
        paddingBottom: 5,
    },
    content: {
        width: "100%",
        color: "#1e1e1e",
        fontSize: 14,
        paddingBottom: 5,
    },
})

export default AddressBox;