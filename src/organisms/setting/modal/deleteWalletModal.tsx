import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PLACEHOLDER_FOR_PASSWORD, SETTING_DELETE_WALLET_TEXT } from "@/constants/common";
import { BgColor, FailedColor, GrayColor, Lato, TextCatTitleColor, TextWarnColor } from "@/constants/theme";
import { WalletNameValidationCheck } from "@/util/validationCheck";
import { decrypt, keyEncrypt } from "@/util/keystore";
import { getChain } from "@/util/secureKeyChain";
import CustomModal from "@/components/modal/customModal";
import InputSetVertical from "@/components/input/inputSetVertical";
import { QuestionFilledCircle } from "@/components/icon/icon";
import WarnContainer from "@/components/parts/containers/warnContainer";

interface Props {
    walletName: string;
    open: boolean;
    setOpenModal: Function;
    deleteWallet: Function;
}

const DeleteWalletModal = ({walletName, open, setOpenModal, deleteWallet}: Props) => {
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(false);

    const handleInputChange = async(val:string) => {
        setPassword(val);
        if(val.length >= 10){
            let nameCheck = await WalletNameValidationCheck(walletName);
            if(nameCheck){
                const key:string = keyEncrypt(walletName, val);
                try {
                    const result = await getChain(walletName);
                    if(result){
                        let w = decrypt(result.password, key);
                        if(w !== null) {
                            setActive(true);
                        } else {
                            setActive(false);
                        }
                    }
                } catch (error) {
                    console.log(error);
                    setActive(false);
                }
            } 
        } else {
            setActive(false);
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
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.title}>{SETTING_DELETE_WALLET_TEXT.title}</Text>
                    </View>
                    <Text style={styles.desc}>{SETTING_DELETE_WALLET_TEXT.desc}</Text>
                    {/* <View style={{paddingVertical: 20}}>
                        <WarnContainer text={SETTING_DELETE_WALLET_TEXT.desc} bgColor={BgColor}/>
                    </View> */}
                    <View style={{paddingBottom: 15}}>
                        <InputSetVertical
                            title={"Password"}
                            bgColor={BgColor}
                            placeholder={PLACEHOLDER_FOR_PASSWORD}
                            secure={true}
                            onChangeEvent={handleInputChange}/>
                    </View>
                    <TouchableOpacity disabled={!active} style={[styles.delButton, {opacity: active? 1 : 0.3}]} onPress={() => handleDeleteWallet()}>
                        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>{SETTING_DELETE_WALLET_TEXT.confirmTitle}</Text>
                    </TouchableOpacity>
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
        fontWeight: "600",
        color: TextCatTitleColor,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 15,
        color: TextWarnColor,
        paddingVertical: 10,
    },
    delButton: {
        height: 50,
        borderRadius: 4,
        backgroundColor: FailedColor,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default DeleteWalletModal;