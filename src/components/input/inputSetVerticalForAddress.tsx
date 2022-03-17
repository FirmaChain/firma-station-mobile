import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { InputBgColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, TextGrayColor, WhiteColor } from "@/constants/theme";
import { checkCameraPermission } from "@/util/permission";
import { QRCodeIcon } from "../icon/icon";
import Clipboard from "@react-native-clipboard/clipboard";
import TextButton from "../button/textButton";
import QRCodeScannerModal from "../modal/qrCodeScanner";

const InputSetVerticalForAddress: React.FC<{
    title: string;
    numberOnly?: boolean;
    placeholder: string;
    secure?: boolean;
    resetValues?: boolean;
    onChangeEvent: Function;
}> = ({title, numberOnly = false, placeholder, secure = false, resetValues = false, onChangeEvent}) => {
    const [val, setVal] = useState('');
    const [focus, setFocus] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleModal = async(value:boolean) => {
        let permissionGranted = value;
        if(value){
            permissionGranted = await checkCameraPermission();    
        }
        setOpenModal(permissionGranted);
    }

    const handleInputChange = (value: string) => {
        setOpenModal(false);
        setVal(value);
        onChangeEvent && onChangeEvent(value);
    }

    const handlePaste = async() => {
        const copied = await Clipboard.getString();
        handleInputChange(copied);
    }

    useEffect(() => {
        if(resetValues) handleInputChange('');
    }, [resetValues])
    
    return (
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
                <TouchableOpacity style={{marginRight: 15}} onPress={() => handleModal(true)}>
                    <QRCodeIcon size={25} color={WhiteColor} />
                </TouchableOpacity>
                <TextButton title={"Paste"} onPressEvent={handlePaste} />
            </View>
            <TextInput
                style={[styles.input, {borderColor: focus? WhiteColor : 'transparent'}]}
                placeholder={placeholder}
                placeholderTextColor={InputPlaceholderColor}
                secureTextEntry={secure}
                keyboardType={numberOnly? "numeric" : "default"}
                autoCapitalize = 'none'
                value={val}
                selectionColor={WhiteColor}
                onFocus={()=>setFocus(true)}
                onBlur={()=>setFocus(false)}
                onChangeText={text => handleInputChange(text)}/>

            {openModal && <QRCodeScannerModal isAddress={true} visible={openModal} handleOpen={handleModal} ReaderHandler={handleInputChange} />}
        </View>
    )
}

export default InputSetVerticalForAddress;

const styles = StyleSheet.create({
    viewContainer: {
        marginBottom: 8,
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 8,
    },
    messageContainer: {
        height: 17,
        alignItems: 'flex-end',
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
    message: {
        fontSize: 14,
        fontFamily: Lato,
        textAlign: 'right',
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
    modalTextContents: {
        width: "100%",
        paddingBottom: 40,
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
    QRWrapper: {
        padding: 20,
        width: "100%",
        height: 350,
        alignItems: "center",
    },
})
