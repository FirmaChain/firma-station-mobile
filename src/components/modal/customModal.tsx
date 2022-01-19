import { BgColor, BoxColor } from "@/constants/theme";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

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
        <View style={[styles.container, {display: visible? "flex":"none"}]}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}>
                    <Pressable style={styles.modalContainer} onPress={()=>closeModal()}/> 
                    <View style={styles.modalBox}>
                        {children} 
                    </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        maxHeight: 500,
        shadowColor: BgColor,
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BgColor,
        borderRadius: 4,
        paddingBottom: 20,
        zIndex: 1000,
    }
})

export default CustomModal;