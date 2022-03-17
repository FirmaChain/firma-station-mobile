import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QRCODE_SCANNER_MODAL_TEXT, WRONG_ADDRESS } from "@/constants/common";
import { Lato, TextCatTitleColor, WhiteColor } from "@/constants/theme";
import { ScreenHeight, ScreenWidth } from "@/util/getScreenSize";
import { addressCheck } from "@/util/firma";
import { Close } from "../icon/icon";
import { BarCodeReadEvent } from "react-native-camera";
import QRCodeScanner from "react-native-qrcode-scanner";
import Toast from "react-native-toast-message";
import CustomToast from "../toast/customToast";

interface Props {
    isAddress?: boolean;
    visible: boolean;
    handleOpen: (open:boolean)=>void;
    ReaderHandler: Function;
}

const QRCodeScannerModal = ({isAddress = false, visible, handleOpen, ReaderHandler}:Props) => {
    
    const handleReader = (event:BarCodeReadEvent) => {
        if(isAddress){
            if(addressCheck(event.data) === false){
                return Toast.show({
                    type: 'error',
                    text1: WRONG_ADDRESS,
                });
            }
        }

        ReaderHandler && ReaderHandler(event.data);
        closeModal();
    }

    const closeModal = () => {
        handleOpen(false);
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            onRequestClose={closeModal}
            visible={visible}>
                <View style={styles.container}>
                    <QRCodeScanner
                        reactivate={true}
                        showMarker={true}
                        onRead={handleReader}
                        cameraStyle={{height: ScreenHeight()}}
                        customMarker={
                            <View style={styles.rectangleContainer}>
                                <View style={styles.topOverlay}>
                                    <TouchableOpacity style={{padding: 20}} onPress={()=>closeModal()}>
                                        <Close size={30} color={WhiteColor} />
                                    </TouchableOpacity>
                                    <Text style={styles.title}>{QRCODE_SCANNER_MODAL_TEXT}</Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={styles.leftAndRightOverlay} />
                                    <View style={styles.rectangle} />
                                    <View style={styles.leftAndRightOverlay} />
                                </View>
                                <View style={styles.bottomOverlay} />
                                <CustomToast />
                            </View>
                        }/>
                </View>
        </Modal>
    )
}

export default QRCodeScannerModal;

const overlayColor = "rgba(0,0,0,0.5)";

const rectDimensions = ScreenWidth() * 0.65;
const rectBorderWidth = ScreenWidth() * 0.005;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: overlayColor,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        width: "100%",
        fontFamily: Lato,
        fontSize: 25,
        textAlign: "center",
        color: TextCatTitleColor,
    },
    rectangleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
      },
    
      rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        borderWidth: rectBorderWidth,
        borderColor: WhiteColor,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
      },
    
      topOverlay: {
        flex: 1,
        height: ScreenWidth(),
        width: ScreenWidth(),
        backgroundColor: overlayColor,
        justifyContent: "space-between",
        paddingVertical: 30,
      },
    
      bottomOverlay: {
        flex: 1,
        height: ScreenWidth(),
        width: ScreenWidth(),
        backgroundColor: overlayColor,
        paddingBottom: ScreenWidth() * 0.1
      },
    
      leftAndRightOverlay: {
        height: ScreenWidth() * 0.65,
        width: ScreenWidth(),
        backgroundColor: overlayColor
      },
})
