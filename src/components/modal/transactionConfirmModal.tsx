import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomModal from "./customModal";
import { BorderColor, BoxColor, Lato, TextColor, TextGrayColor } from "../../constants/theme";
import { decrypt, keyEncrypt } from "../../util/keystore";
import { getChain } from "../../util/secureKeyChain";
import { WalletNameValidationCheck } from "../../util/validationCheck";
import InputSetVertical from "../input/inputSetVertical";
import Button from "../button/button";
import { convertCurrent, convertNumber } from "@/util/common";
import { getPasswordViaBioAuth, getUseBioAuth, getWallet } from "@/util/wallet";
import { confirmViaBioAuth } from "@/util/bioAuth";

interface Props {
    title: string,
    walletName: string;
    amount: number;
    open: boolean;
    setOpenModal: Function;
    transactionHandler: Function; 
}

const TransactionConfirmModal = ({title, walletName, amount = 0, open, setOpenModal, transactionHandler}: Props) => {
    const signMoalText = {
        title: title,
        confirmTitle: 'Confirm'
    }

    const [password, setPassword] = useState('');
    const [active, setActive] = useState(false);
    const [useBio, setUseBio] = useState(false);

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
                        } else {
                            setActive(false);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    setActive(false);
                });
            } 
        }
    }

    const handleTransaction = async() => {
        if(active === false) return;

        let passwordFromBio = '';
        if(useBio){
            const auth = await confirmViaBioAuth();
            if(auth){
                await getPasswordViaBioAuth().then(res => {
                    passwordFromBio = res;
                }).catch(error => console.log(error));
            } else {
                return;
            }
        }
        
        const result = useBio? passwordFromBio : password;
        
        transactionHandler && transactionHandler(result);
        handleModal(false);
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


    useEffect(() => {
        const getUseBioAuthState = async() => {
            const result = await getUseBioAuth();
            setActive(result);
            setUseBio(result);
        }
        getUseBioAuthState();
    }, []);

    return (
        <CustomModal
            visible={open} 
            handleOpen={handleModal}>
                <View style={styles.modalTextContents}>
                    <View style={styles.receiptBox}>
                        <Text style={styles.receiptTitle}>{signMoalText.title}</Text>
                        {amount > 0 &&
                        <View style={[styles.boxH, styles.receiptDesc, {borderTopWidth: 1, borderTopColor: BorderColor}]}>
                            <Text style={styles.itemTitle}>Amount</Text>
                            <Text style={styles.itemBalance}>{convertCurrent(convertNumber((amount)))}<Text style={styles.itemTitle}>  FCT</Text></Text>
                        </View>
                        }
                        <View style={[styles.boxH, styles.receiptDesc]}>
                            <Text style={styles.itemTitle}>Fee</Text>
                            <Text style={styles.itemBalance}>{Number(0.20).toFixed(2)}<Text style={styles.itemTitle}>  FCT</Text></Text>
                        </View>
                    </View>
                    <View style={styles.modalPWBox}>
                        {!useBio &&
                        <InputSetVertical
                            title="Password"
                            message=""
                            validation={true}
                            secure={true}
                            placeholder="Muse be at least 10 characters"
                            onChangeEvent={handleInputChange}/>
                        }
                        <Button
                            title={signMoalText.confirmTitle}
                            active={active}
                            onPressEvent={handleTransaction}/>
                    </View>
                </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalTextContents: {
        width: "100%",
        padding: 20,
    },
    desc: {
        fontSize: 14,
    },
    boxH: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalPWBox: {
        paddingTop: 20,
    },
    receiptBox: {
        padding: 20,
        borderRadius: 4,
        backgroundColor: BoxColor,
    },
    receiptTitle: {
        width: "100%",
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextGrayColor,
        paddingVertical: 10,
    },
    receiptDesc: {
        paddingVertical: 10,
    },
    itemTitle: {
        fontFamily: Lato,
        color: TextGrayColor,
        fontWeight: "normal",
        fontSize: 14,
    },
    itemBalance: {
        fontFamily: Lato,
        color: TextColor,
        fontWeight: "normal",
        fontSize: 16,
    }
})

export default TransactionConfirmModal;