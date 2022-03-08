import React, { useMemo } from "react";
import { DownArrow } from "@/components/icon/icon";
import { InputBgColor, InputPlaceholderColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    handleOpenModal: Function;
    selectedWallet: string;
}

const WalletSelector = ({handleOpenModal, selectedWallet}:Props) => {

    const selectIdle = useMemo(() => {
        if(selectedWallet === "") return true;
        return false;
    }, [selectedWallet])

    return (
        <View style={styles.walletContainer}>
            <Text style={styles.title}>Wallet</Text>
            <TouchableOpacity style={styles.walletBox} onPress={() => handleOpenModal(true)}>
                <Text style={[styles.wallet, selectIdle && {color: InputPlaceholderColor}]}>{selectIdle? 'Select your wallet' : selectedWallet}</Text>
                <DownArrow size={10} color={InputPlaceholderColor} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    walletContainer: {
        marginBottom: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
        marginBottom: 5,
    },
    walletBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
    wallet: {
        fontFamily: Lato,
        fontSize:14,
        color: TextColor,
    },
})


export default WalletSelector;