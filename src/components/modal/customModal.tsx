import React from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { BgColor } from "@/constants/theme";

interface Props {
    visible: boolean;
    handleOpen: Function;
    children: JSX.Element;
}

const CustomModal = ({visible, handleOpen, children}:Props) => {
    const closeModal = () => {
        handleOpen && handleOpen(false);
    }

    return (
        <View style={[styles.container, {display: visible? "flex":"none", flex: visible? 1:0}]}>
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={closeModal}
                visible={visible}>
                    <KeyboardAvoidingView
                        enabled 
                        behavior={Platform.select({android: undefined, ios: 'padding'})} 
                        style={{flex: 1}}>
                            <Pressable style={styles.modalContainer} onPress={()=>closeModal()}/> 
                            <Pressable style={styles.modalBox} onPress={()=>Keyboard.dismiss()}>
                                {children} 
                            </Pressable>
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
        opacity: 0.5,
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
        backgroundColor: BgColor,
        borderRadius: 4,
        paddingBottom: 20,
        zIndex: 9999,
    }
})

export default CustomModal;