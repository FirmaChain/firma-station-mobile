import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AddressBoxColor, AddressTextColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from "@/constants/theme";
import { ADDRESS_QRCODE_MODAL_TEXT, COPIED_CLIPBOARD } from "@/constants/common";
import { Copy, QRCodeIcon } from "@/components/icon/icon";
import CustomModal from "@/components/modal/customModal";
import Button from "@/components/button/button";
import QRCode from "react-native-qrcode-svg";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

interface Props {
    address: string;
}

const AddressBox = ({address}: Props) => {
    const [openQRModal, setOpenQRModal] = useState(false);

    const handleAddressToClipboard = () => {
        Clipboard.setString(address);
        Toast.show({
            type: 'info',
            text1: COPIED_CLIPBOARD + "address",
          });
    }

    const handleQRCode = (value:boolean) => {
        setOpenQRModal(value);
    }

    return (
        <View style={styles.container}>
            <Text numberOfLines={1} ellipsizeMode="middle" style={styles.address}>{address}</Text>
            <View style={styles.iconWrapper}>
                <TouchableOpacity style={{marginRight: 10}} onPress={handleAddressToClipboard}>
                    <Copy size={20} color={TextCatTitleColor}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQRCode(true)}>
                    <QRCodeIcon size={20} color={TextCatTitleColor}/>
                </TouchableOpacity>
            </View>
            <CustomModal
                visible={openQRModal}
                handleOpen={handleQRCode}>
                    <View style={styles.modalTextContents}>
                        <Text style={[styles.title, {fontWeight: "bold"}]}>{ADDRESS_QRCODE_MODAL_TEXT.title}</Text>
                        <View style={styles.qrcodeContainer}>
                            <View style={styles.qrcodeWapper}>
                                <QRCode
                                    size={130}
                                    value={address}/>
                            </View>
                        </View>
                        <Button
                            title={ADDRESS_QRCODE_MODAL_TEXT.confirmTitle}
                            active={true}
                            onPressEvent={() => handleQRCode(false)}/>
                    </View>
            </CustomModal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 44,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 20,
        backgroundColor: AddressBoxColor,
        borderRadius: 4,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    address: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: AddressTextColor,
    },
    iconWrapper: {
        flex: 1,
        maxWidth: 60,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    modalTextContents: {
        width: "100%",
        padding: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        color: TextCatTitleColor,
        marginBottom: 15,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextColor,
    },
    qrcodeContainer: {
        borderRadius: 4,
        padding: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrcodeWapper: {
        padding: 30, 
        borderRadius: 4,
        backgroundColor: WhiteColor,
    }
})

export default AddressBox;