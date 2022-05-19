import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PLACEHOLDER_FOR_PASSWORD } from "@/constants/common";
import { BgColor, Lato, TextCatTitleColor, TextColor } from "@/constants/theme";
import { decrypt, keyEncrypt } from "@/util/keystore";
import { getChain } from "@/util/secureKeyChain";
import { WalletNameValidationCheck } from "@/util/validationCheck";
import Button from "@/components/button/button";
import InputSetVertical from "@/components/input/inputSetVertical";
import CustomModal from "@/components/modal/customModal";

interface Props {
    walletName: string;
    open: boolean;
    book: {
        title: string;
        desc: string;
        confirmTitle: string;
    }
    setOpenModal: (open:boolean) => void;
    bioAuthhandler: (value:string) => void;
}

const RadioOnModal = ({walletName, open, book, setOpenModal, bioAuthhandler}: Props) => {
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
        bioAuthhandler(password);
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
                    <View style={{flexDirection: "row"}}>
                        <Text style={[styles.title, {fontWeight: "bold"}]}>{book.title}</Text>
                    </View>
                    <View style={{paddingBottom: 15}}>
                        <Text style={styles.desc}>{book.desc}</Text>
                        <InputSetVertical
                            title={""}
                            bgColor={BgColor}
                            placeholder={PLACEHOLDER_FOR_PASSWORD}
                            secure={true}
                            onChangeEvent={handleInputChange}/>
                    </View>
                    <Button
                        title={book.confirmTitle}
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
        fontSize: 16,
        color: TextCatTitleColor,
        marginBottom: -5,
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
    }
})

export default RadioOnModal;