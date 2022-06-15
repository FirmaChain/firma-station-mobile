import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { convertAmount, convertNumber } from "@/util/common";
import { BorderColor, DisableColor, Lato, TextCatTitleColor, TextDarkGrayColor, TextDisableColor, WhiteColor } from "@/constants/theme";
import Button from "../button/button";
import CustomModal from "./customModal";
import ValidationModal from "./validationModal";
import { useAppSelector } from "@/redux/hooks";

interface Props {
    title: string,
    amount: number;
    fee: number;
    vote?: string;
    open: boolean;
    setOpenModal: Function;
    transactionHandler: (password:string) => void; 
}

const TransactionConfirmModal = ({title, amount = 0, fee = 0, vote = "", open, setOpenModal, transactionHandler}: Props) => {
    const {common} = useAppSelector(state => state);

    const signMoalText = {
        title: title,
        confirmTitle: 'Confirm'
    }

    const [openValidationModal, setOpenValidationModal] = useState(false);
    const handleValidation = (open:boolean) => {
        setOpenValidationModal(open);
    }

    const handleTransaction = (result: string) => {
        if(common.appState === "active"){
            transactionHandler(result);
        }
        handleModal(false);
    }

    const handleModal = (open:boolean) => {
        setOpenModal && setOpenModal(open);
    }

    useEffect(() => {
        if(common.appState !== "active" && common.isBioAuthInProgress === false) handleModal(false);
    }, [common.appState])

    return (
        <CustomModal
            visible={open}
            handleOpen={handleModal}>
                <>
                <View style={[styles.modalTextContents, {display: openValidationModal? "none":"flex"}]}>
                    <View style={[styles.boxH, {justifyContent: "flex-start", alignItems: "center"}]}>
                        <Text style={styles.receiptTitle}>{signMoalText.title}</Text>
                    </View>
                    <View style={styles.receiptBox}>
                        {vote !== "" &&
                        <View style={[styles.boxH, styles.receiptDesc, {borderBottomWidth: 1, borderBottomColor: BorderColor}]}>
                            <Text style={styles.itemTitle}>Vote</Text>
                            <Text style={[styles.itemBalance, {color: WhiteColor, fontWeight: "bold"}]}>{vote}</Text>
                        </View>
                        }
                        {amount > 0 &&
                        <View style={[styles.boxH, styles.receiptDesc, {borderBottomWidth: 1, borderBottomColor: BorderColor}]}>
                            <Text style={styles.itemTitle}>Amount</Text>
                            <Text style={styles.itemBalance}>
                                {convertAmount(amount, false, 6)}
                                <Text style={[styles.itemTitle, {fontSize: 14, color: TextDisableColor}]}>  FCT</Text>
                            </Text>
                        </View>
                        }
                        <View style={[styles.boxH, styles.receiptDesc]}>
                            <Text style={styles.itemTitle}>Fee</Text>
                            <Text style={[styles.itemBalance, {color: TextCatTitleColor}]}>
                                {convertNumber(convertAmount((fee / 1000000), false, 6))}
                                <Text style={[styles.itemTitle, {fontSize: 14, color: TextDisableColor}]}>  FCT</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.modalButtonBox}>
                        <Button
                            title={signMoalText.confirmTitle}
                            active={true}
                            onPressEvent={() => handleValidation(true)}/>
                    </View>
                </View>
                <ValidationModal
                    type={"transaction"}
                    open={openValidationModal}
                    setOpenModal={handleValidation}
                    validationHandler={handleTransaction}/>
                </>
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
    modalButtonBox: {
        paddingTop: 30,
    },
    receiptBox: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: DisableColor,
    },
    receiptTitle: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextDarkGrayColor,
        paddingBottom: 20,
    },
    receiptDesc: {
        paddingVertical: 15,
    },
    itemTitle: {
        fontFamily: Lato,
        color: TextCatTitleColor,
        fontWeight: "normal",
        fontSize: 16,
    },
    itemBalance: {
        fontFamily: Lato,
        color: WhiteColor,
        fontWeight: "normal",
        fontSize: 16,
    }
})

export default TransactionConfirmModal;