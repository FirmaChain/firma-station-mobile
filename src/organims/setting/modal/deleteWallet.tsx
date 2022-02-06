import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomModal from "../../../components/modal/customModal";
import { TextColor } from "../../../constants/theme";
import { decrypt, keyEncrypt } from "../../../util/keystore";
import { getChain } from "../../../util/secureKeyChain";
import { WalletNameValidationCheck } from "../../../util/validationCheck";

interface Props {
    walletName: string;
    open: boolean;
    setOpenModal: Function;
    deleteWallet: Function;
}

const DeleteWallet = ({walletName, open, setOpenModal, deleteWallet}: Props) => {
    const delAlertText = {
        title: 'Delete wallet',
        desc: 'Are you sure you want to delete this wallet?\nYour wallet cannot be recovered without seed phrase.',
        confirmTitle: 'Delete'
    }
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(false);

    const handleInputChange = async(val:string) => {
        setPassword(val);
        if(val.length >= 10){
            let nameCheck = await WalletNameValidationCheck(walletName);
            if(nameCheck){
                const key:string = keyEncrypt(walletName, val);
                await getChain(walletName).then(res => {
                    if(res){
                        let w = decrypt(res.password, key);
                        if(w.length > 0) {
                            setActive(true);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    setActive(false);
                });
            } 
        }
    }

    const handleDeleteWallet = () => {
        if(active === false) return;
        deleteWallet && deleteWallet();
    }

    const handleDelModal = (open:boolean) => {
        setOpenModal && setOpenModal(open);
    }

    useEffect(() => {
        if(open === false){
            setPassword('');
            setActive(false);
        } 
    }, [open])

    return (
        <CustomModal
            visible={open} 
            handleOpen={handleDelModal}>
                <View style={styles.modalTextContents}>
                    <Text style={styles.title}>{delAlertText.title}</Text>
                    <Text style={styles.desc}>{delAlertText.desc}</Text>
                    <View style={styles.modalPWBox}>
                        <Text style={[styles.title, {fontSize: 14}]}>Password</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder={"Must be at least 10 characters"}
                            secureTextEntry={true}
                            autoCapitalize = 'none'
                            value={password}
                            onChangeText={text => handleInputChange(text)}/>
                    </View>
                    <TouchableOpacity disabled={!active} style={[styles.delButton, {opacity: active? 1 : 0.3}]} onPress={() => handleDeleteWallet()}>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>{delAlertText.confirmTitle}</Text>
                    </TouchableOpacity>
                </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalTextContents: {
        padding: 20,
    },
    title: {
        color: TextColor,
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
    },
    desc: {
        fontSize: 14,
    },
    modalPWBox: {
        paddingVertical: 20,
    },
    input: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: '#fff',
        marginBottom: 5,
    },
    delButton: {
        height: 50,
        borderRadius: 8,
        backgroundColor: "tomato",
        alignItems: "center",
        justifyContent: "center"
    }
})

export default DeleteWallet;