import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BgColor, BoxColor, Lato, TextColor } from "@/constants/theme";
import { getWalletList, removeUseBioAuth, removeWallet, setWalletList } from "@/util/wallet";
import DeleteWalletModal from "../modal/deleteWalletModal";

interface Props {
    wallet: any;
    handleGuide: (key:string) => void;
    handleDisconnect: () => void;
}

const Delete = ({wallet, handleGuide, handleDisconnect}:Props) => {

    const [openDelModal, setOpenDelModal] = useState(false);
    const handleDelModal = (open:boolean) => {
        setOpenDelModal(open);
    }

    const handleDeleteWallet = async() => {
        await removeWallet(wallet.name);
        await removeUseBioAuth(wallet.name);
        
        let newList:string = '';
        await getWalletList().then(res => {
            let arr = res !== undefined? res : [];
            
            if(arr.length > 1){
                arr.filter(item => item !== wallet.name).map((item) => {
                    newList += item + "/";
                });
                newList = newList.slice(0, -1);
            }
            setWalletList(newList);
            handleDelModal(false);
            handleDisconnect();
        }).catch(error => {
            console.log(error)
        });
    }

    const handleMoveToGuide = (key:string) => {
        handleDelModal(false);
        handleGuide(key);
    }
    
    return (
        <View>
            <TouchableOpacity onPress={() => handleDelModal(true)}>
                <View style={[styles.listItem, {justifyContent: "center"}]}>
                    <Text style={[styles.itemTitle, {color: "tomato", fontWeight:"bold"}]}>Delete Wallet</Text>
                </View>
            </TouchableOpacity>

            <DeleteWalletModal
                walletName={wallet.name} 
                open={openDelModal} 
                handleGuide={handleMoveToGuide}
                setOpenModal={handleDelModal}
                deleteWallet={handleDeleteWallet}/>
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
})

export default Delete;