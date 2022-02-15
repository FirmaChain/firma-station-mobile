import React, { useEffect, useState } from "react";
import Button from "@/components/button/button";
import InputSetVertical from "@/components/input/inputSetVertical";
import { PLACEHOLDER_FOR_PASSWORD, SETTING_BIO_AUTH_MODAL_TEXT } from "@/constants/common";
import { StyleSheet, Text, View } from "react-native";
import CustomModal from "../../../components/modal/customModal";
import { Lato, TextCatTitleColor, TextColor } from "../../../constants/theme";
import { decrypt, keyEncrypt } from "../../../util/keystore";
import { getChain } from "../../../util/secureKeyChain";
import { WalletNameValidationCheck } from "../../../util/validationCheck";

interface Props {
    walletName: string;
    open: boolean;
    setOpenModal: Function;
    bioAuthhandler: Function;
}

const BioAuthOnModal = ({walletName, open, setOpenModal, bioAuthhandler}: Props) => {
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
                        if(w !== null) {
                            setActive(true);
                        } else {
                            setActive(false);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    setActive(false);
                });
            } 
        } else {
            setActive(false);
        }
    }

    const handleBioAuth = () => {
        if(active === false) return;
        bioAuthhandler && bioAuthhandler(password);
    }

    const handleModal = (open:boolean) => {
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
            handleOpen={handleModal}>
                <View style={styles.modalTextContents}>
                    <Text style={[styles.title, {fontWeight: "bold"}]}>{SETTING_BIO_AUTH_MODAL_TEXT.title}</Text>
                    <InputSetVertical
                        title={SETTING_BIO_AUTH_MODAL_TEXT.desc}
                        placeholder={PLACEHOLDER_FOR_PASSWORD}
                        secure={true}
                        onChangeEvent={handleInputChange}/>
                    <Button
                        title={SETTING_BIO_AUTH_MODAL_TEXT.confirmTitle}
                        active={active}
                        onPressEvent={handleBioAuth}/>
                </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
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
})

export default BioAuthOnModal;