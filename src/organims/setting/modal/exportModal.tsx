import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoxColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from "../../../constants/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import Button from "@/components/button/button";

interface Props {
    privatekey: string;
    onPressEvent: Function;
}

const ExportModal = ({privatekey, onPressEvent}:Props) => {

    const modalText = {
        title: 'Private key',
        confirmTitle: 'Export'
    }

    const copyPrivateKey = () => {
        Clipboard.setString(privatekey);

        const msg = 'Copied your private key';
        
        Toast.show({
            type: 'info',
            text1: msg,
          });
    }

    return (
        <View style={styles.modalContents}>
            <Text style={styles.title}>{modalText.title}</Text>
            <View style={styles.modalPWBox}>
                <TouchableOpacity onPress={() => copyPrivateKey()}>
                    <Icon name="content-copy" size={15} color={WhiteColor} style={styles.icon}/>
                    <Text style={styles.privatekey}>{privatekey}</Text>
                </TouchableOpacity>
            </View>
            <Button
                title="Export"
                active={true}
                onPressEvent={onPressEvent}/>

            {/* <TouchableOpacity style={styles.button} onPress={() => onPressEvent()}>
                <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>{modalText.confirmTitle}</Text>
            </TouchableOpacity> */}
        </View>
    )
}

const styles = StyleSheet.create({
    modalContents: {
        padding: 20,
        width: "100%",
        height: "auto",
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "600",
        color: TextCatTitleColor,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
    },
    modalPWBox: {
        marginVertical: 20,
        borderRadius: 4,
        backgroundColor: BoxColor,
    },
    icon: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    privatekey: {
        padding: 20,
        fontFamily: Lato,
        fontSize: 14,
        color: TextColor,
    }
})

export default ExportModal;