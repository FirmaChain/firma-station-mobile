import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BgColor, BoxColor, Lato, TextColor } from "@/constants/theme";
import DeleteWalletModal from "../modal/deleteWalletModal";
import { removeChain, setChain } from "@/util/secureKeyChain";
import { getWalletList } from "@/util/wallet";
import { WALLET_LIST } from "@/constants/common";

interface Props {
    wallet: any;
    handleDisconnect: () => void;
}

const Delete = ({wallet, handleDisconnect}:Props) => {

    const [openDelModal, setOpenDelModal] = useState(false);
    const handleDelModal = (open:boolean) => {
        setOpenDelModal(open);
    }

    const handleDeleteWallet = async() => {
        await removeChain(wallet.name)
            .then(res => console.log(res))
            .catch(error => console.log(error));

        let newList:string = '';
        await getWalletList().then(res => {
            let arr = res !== undefined? res : [];
            
            if(arr.length > 1){
                arr.filter(item => item !== wallet.name).map((item, index) => {
                    newList += item + "/";
                });
                newList = newList.slice(0, -1);
            }

            setChain(WALLET_LIST, newList);
            handleDelModal(false);
            handleDisconnect();
        }).catch(error => {
            console.log(error)
        });
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