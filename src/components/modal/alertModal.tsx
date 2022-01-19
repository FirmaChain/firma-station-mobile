import React from "react";
import { Modal, TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { ContainerColor, TextColor, TextGrayColor } from "../../constants/theme";

interface Props {
    visible: boolean;
    handleOpen: Function;
    isSingleButton?: boolean;
    title: string;
    desc: string;
    confirmTitle?: string;
    onConfirmEvent?: Function;
}

const AlertModal = ({visible, handleOpen, isSingleButton = false, title, desc, confirmTitle, onConfirmEvent}:Props) => {

    const closeModal = () => {
        handleOpen && handleOpen(false);
    }

    const handleConfirm = () => {
        onConfirmEvent && onConfirmEvent();
        closeModal();
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}>
                    <View style={styles.modalContainer}> 
                        <View style={styles.modalBox}>
                            <View style={styles.textBox}>
                                <Text style={styles.title}>{title}</Text>
                                <Text style={styles.desc}>{desc}</Text>
                            </View>
                            <View style={styles.buttonBox}>
                                <TouchableOpacity 
                                    style={isSingleButton?
                                        [styles.button, {padding: 15, borderBottomEndRadius: 8, borderBottomStartRadius: 8}]:
                                        [styles.button, {borderBottomLeftRadius: 8}]} 
                                    onPress={()=>closeModal()}>
                                    <Text style={styles.buttonTitle}>{isSingleButton? 'OK':'Cancel'}</Text>
                                </TouchableOpacity>
                                {isSingleButton === false && 
                                <>
                                <View style={{width: 1, height: '100%', backgroundColor: '#fff'}}/>
                                <TouchableOpacity style={[styles.button, {borderBottomRightRadius: 8}]} onPress={()=>handleConfirm()}>
                                    <Text style={styles.buttonTitle}>{confirmTitle}</Text>
                                </TouchableOpacity>
                                </>
                                }
                            </View>
                        </View>
                    </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: 300,
        height: 'auto',
        maxHeight: 500,
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
    },
    textBox: {
        padding: 20,
    },
    title: {
        color: TextColor,
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 15,
    },
    desc: {
        fontSize: 14,
        textAlign: "center",
    },
    buttonBox: {
        width: '100%',
        height: 50,
        flexDirection: "row",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        zIndex: 99,
        flex: 1,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ContainerColor,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: TextGrayColor,
    }
})

export default AlertModal;