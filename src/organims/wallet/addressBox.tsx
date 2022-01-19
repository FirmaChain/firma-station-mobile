import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, ContainerColor, Lato, PointColor, TextColor, TextGrayColor } from "../../constants/theme";
import Toast from "react-native-toast-message";
import { Copy } from "../../components/icon/icon";

interface Props {
    address: string;
}

const AddressBox = ({address}: Props) => {

    const handleAddressToClipboard = () => {
        Clipboard.setString(address);
        const msg = 'Copied your address';
        
        Toast.show({
            type: 'info',
            text1: msg,
          });
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handleAddressToClipboard}>
            <Text numberOfLines={1} ellipsizeMode="middle" style={styles.address}>{address}</Text>
            <View style={styles.copyIcon}> 
                <Copy size={20} color={'#fff'}/>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 44,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 20,
        marginTop: 30,
        backgroundColor: PointColor,
        borderRadius: 4,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    address: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
    },
    copyIcon: {
        flex: 1,
        maxWidth: 40,
        alignItems: "flex-end"
    }
})

export default AddressBox;