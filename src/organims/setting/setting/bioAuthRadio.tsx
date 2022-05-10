import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BgColor, BoxColor, DisableColor, Lato, PointColor, TextColor, WhiteColor } from "@/constants/theme";
import { BIOAUTH_ACTIVATE, SETTING_BIO_AUTH_MODAL_TEXT } from "@/constants/common";
import { getUseBioAuth, removePasswordViaBioAuth, removeUseBioAuth, setPasswordViaBioAuth, setUseBioAuth } from "@/util/wallet";
import { confirmViaBioAuth } from "@/util/bioAuth";
import RadioOnModal from "../modal/bioAuthOnModal";
import Toast from "react-native-toast-message";
import { useAppSelector } from "@/redux/hooks";
import { easeInAndOutCustomAnim, LayoutAnim } from "@/util/animation";

interface Props {
    wallet: any;
}

const BioAuthRadio = ({wallet}:Props) => {
    const {common} = useAppSelector(state => state);

    const [openBioModal, setOpenBioModal] = useState(false);
    const [useBio, setUseBio] = useState(false);

    const closeBioModal = (open:boolean) => {
        setOpenBioModal(open);
        if(common.appState === "active"){
            setUseBio(open);
            handleBioAuthState();
        }
    }

    const handleBioAuth = async(value:boolean) => {
        LayoutAnim();
        easeInAndOutCustomAnim(150);
        if(value === false){
            handleBioAuthState();
        }
        setOpenBioModal(value);
        setUseBio(value);
    }

    const handleToast = () => {
        Toast.show({
            type: 'info',
            text1: BIOAUTH_ACTIVATE,
        });
    }

    const handleBioAuthState = (password?:string) => {
        if(password){
            confirmViaBioAuth().then(res => {
                if(res){
                    setPasswordViaBioAuth(password);
                    setUseBioAuth(wallet.name);
                    handleToast();
                } else {
                    handleBioAuth(false);
                }
            });
            setOpenBioModal(false);
        } else {            
            removePasswordViaBioAuth();
            removeUseBioAuth(wallet.name);
        }
    }

    useEffect(() => {
        const getUseBioAuthState = async() => {
            const result = await getUseBioAuth(wallet.name);
            setUseBio(result);
        }

        getUseBioAuthState();
    }, []);

    return (
        <View style={styles.listItem}>
            <Text style={styles.itemTitle}>Use Bio Auth</Text>
            <TouchableOpacity onPress={()=>handleBioAuth(!useBio)}>
                <View style={[styles.radioWrapper, useBio?{backgroundColor: PointColor, alignItems: "flex-end"}:{backgroundColor: DisableColor}]}>
                    <View style={styles.radio} />
                </View>
            </TouchableOpacity>
            <RadioOnModal
                walletName={wallet.name}
                open={openBioModal}
                book={SETTING_BIO_AUTH_MODAL_TEXT}
                setOpenModal={closeBioModal}
                bioAuthhandler={handleBioAuthState}/>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: BoxColor,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: .5,
        borderBottomColor: BgColor,
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: "center",
        padding: 3,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor,
    }
})

export default BioAuthRadio;