import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getUniqueId } from "react-native-device-info";
import { USE_BIO_AUTH } from "@/constants/common";
import { BgColor, BoxColor, DisableColor, Lato, PointColor, TextColor, WhiteColor } from "@/constants/theme";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { removeChain, setChain } from "@/util/secureKeyChain";
import { getUseBioAuth, getWalletWithAutoLogin, setPasswordViaBioAuth } from "@/util/wallet";
import BioAuthOnModal from "../modal/bioAuthOnModal";
import Toast from "react-native-toast-message";

interface Props {
    wallet: any;
}

const BioAuthRadio = ({wallet}:Props) => {
    const [openBioModal, setOpenBioModal] = useState(false);
    const [useBio, setUseBio] = useState(false);

    const closeBioModal = (open:boolean) => {
        setOpenBioModal(open);
        setUseBio(open);
        handleBioAuthState();
    }

    const handleBioAuth = async(value:boolean) => {
        if(value === false){
            handleBioAuthState();
        }
        setOpenBioModal(value);
        setUseBio(value);
    }

    const handleToast = () => {
        const msg = 'Bio Auth has been activated';
        Toast.show({
            type: 'info',
            text1: msg,
        });
    }

    const handleBioAuthState = async(password?:string) => {
        if(password){
            confirmViaBioAuth().then(res => {
                if(res){
                    setPasswordViaBioAuth(password);
                    setChain(USE_BIO_AUTH + wallet.name, "true");
                    handleToast();
                } else {
                    handleBioAuth(false);
                }
            });
            setOpenBioModal(false);
        } else {
            let timestamp = 0;
            await getWalletWithAutoLogin().then(res => {
                if('') return null;
                const result = JSON.parse(res);
                timestamp = result.timestamp;
            }).catch(error => {
                console.log('error : ' + error);
                return null;
            })
            await removeChain(getUniqueId + timestamp.toString())
            .catch(error => console.log(error));
            setChain(USE_BIO_AUTH + wallet.name, "false");
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
            <BioAuthOnModal
                walletName={wallet.name}
                open={openBioModal}
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