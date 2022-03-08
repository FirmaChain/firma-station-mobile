import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Button from "@/components/button/button";
import CustomModal from "@/components/modal/customModal";
import { CHECK_ACTIVATE_BIO_AUTH_MODAL_TEXT } from "@/constants/common";
import { Lato, TextCatTitleColor, TextColor, WhiteColor } from "@/constants/theme";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { getUseBioAuth } from "@/util/wallet";
import { FingerPrint } from "@/components/icon/icon";

interface Props {
    walletName: string;
    visible: boolean;
    handleOpen: Function;
    handleResult: (result:boolean) => void;
}

const BioAuthModal = (props:Props) => {
    const {walletName, visible, handleOpen, handleResult} = props;

    const confirmBioAuth = async() => {
        const result = await getUseBioAuth(walletName);
        if(result){
            handleResult(true);
        } else {
            const auth = await confirmViaBioAuth();
            if(auth){
                handleResult(true);
            } else {
                return handleResult(false);
            }
        }
    }

    return (
        <CustomModal
            visible={visible} 
            handleOpen={handleOpen}>
                <View style={styles.modalTextContents}>
                    <View style={styles.textBox}>
                        <FingerPrint size={80} color={WhiteColor}/>
                        <Text style={[styles.title, {fontWeight: "bold"}]}>{CHECK_ACTIVATE_BIO_AUTH_MODAL_TEXT.title}</Text>
                        <Text style={styles.desc}>{CHECK_ACTIVATE_BIO_AUTH_MODAL_TEXT.desc}</Text>
                    </View>
                    <View style={styles.buttonBox}>
                        <View style={{marginBottom: 10}}>
                            <Button
                                title={CHECK_ACTIVATE_BIO_AUTH_MODAL_TEXT.confirmTitle}
                                active={true}
                                onPressEvent={confirmBioAuth}/>
                        </View>
                        <View>
                            <Button
                                title={CHECK_ACTIVATE_BIO_AUTH_MODAL_TEXT.cancelTitle}
                                active={true}
                                border={true}
                                onPressEvent={() => handleResult(false)}/>
                        </View>
                    </View>
                </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalTextContents: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    textBox: {
        flex: 6,
        justifyContent:"center",
        alignItems: "center",
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        textAlign: "center",
        color: TextCatTitleColor,
        marginVertical: 15,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        textAlign: "center",
        color: TextColor,
        marginBottom: 15,
    },
    buttonBox: {
        flex: 1,
        paddingBottom: Platform.select({android: 30, ios: 50}),
        justifyContent: "flex-end",
    },
})

export default BioAuthModal;