import React, { useEffect } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { BgColor, BoxColor } from "@/constants/theme";
import CustomToast from "../toast/customToast";

interface Props {
    visible: boolean;
    keyboardAvoiing?: boolean;
    lockBackButton?: boolean;
    bgColor?: string;
    handleOpen: (open:boolean) => void;
    children: JSX.Element;
}

const CustomModal = ({visible, keyboardAvoiing = true, lockBackButton = false, bgColor = BoxColor, handleOpen, children}:Props) => {
    const {common} = useAppSelector(state => state);

    const closeModal = () => {
        if(lockBackButton) return;
        handleOpen(false);
    }

    useEffect(() => {
        if(common.appState !== "active" && common.isBioAuthInProgress === false) closeModal();
    }, [common.appState])

    return (
        <View style={[styles.container, {display: visible? "flex":"none", flex: visible? 1:0}]}>
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={closeModal}
                visible={visible}>
                    <KeyboardAvoidingView
                        enabled={keyboardAvoiing}
                        behavior={Platform.select({android: undefined, ios: 'padding'})} 
                        style={{flex: 1}}>
                            <Pressable style={styles.modalContainer} onPress={()=>closeModal()}/> 
                            <Pressable style={[styles.modalBox, {backgroundColor: bgColor}]} onPress={()=>Keyboard.dismiss()}>
                                {children} 
                            </Pressable>
                            <CustomToast />
                    </KeyboardAvoidingView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#000',
        opacity: 0.7,
    },
    modalBox: {
        width: '100%',
        height: 'auto',
        shadowColor: BgColor,
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingBottom: Platform.OS === "ios"? 30: 10,
        zIndex: 9999,
    }
})

export default CustomModal;