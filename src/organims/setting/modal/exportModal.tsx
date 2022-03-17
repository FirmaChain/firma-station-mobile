import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Copy } from "@/components/icon/icon";
import { BgColor, BoxColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from "@/constants/theme";
import { COPIED_CLIPBOARD } from "@/constants/common";
import QRCode from "react-native-qrcode-svg";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import Button from "@/components/button/button";

interface Props {
    type: string;
    value: string;
    onPressEvent: ()=>void;
}

const ExportModal = ({type, value, onPressEvent}:Props) => {

    const modalText = {
        title: type,
        confirmTitle: 'Export'
    }

    const copyPrivateKey = () => {
        Clipboard.setString(value);
        Toast.show({
            type: 'info',
            text1: COPIED_CLIPBOARD + type,
        });
    }

    return (
        <View style={styles.modalContents}>
            <View style={styles.box}>
                <Text style={styles.title}>{modalText.title}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.privatekeyWrapper}>
                    <Text style={styles.privatekey}>{value}</Text>
                    <TouchableOpacity onPress={copyPrivateKey}>
                        <Copy size={25} color={WhiteColor}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.qrcodeWapper}>
                    <QRCode
                        value={value}
                        size={130}/>
                </View>
            </View>
            <Button
                title="Ok"
                active={true}
                onPressEvent={onPressEvent}/>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContents: {
        padding: 20,
        width: "100%",
        height: "auto",
    },
    box: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    container: {
        borderRadius: 4,
        backgroundColor: BoxColor,
        padding: 20,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    privatekeyWrapper: {
        borderRadius: 4,
        backgroundColor: BgColor,
        padding: 20,
        marginBottom: 20,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    qrcodeWapper: {
        padding: 30, 
        borderRadius: 4,
        backgroundColor: WhiteColor,
    },
    icon: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    privatekey: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        marginRight: 15,
        color: TextColor,
    },
    IconWrapper: {
        maxWidth: 40,
        alignItems: "flex-end"
    }
})

export default ExportModal;