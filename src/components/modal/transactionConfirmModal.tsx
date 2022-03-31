import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { convertAmount } from "@/util/common";
import { BorderColor, BoxColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import Button from "../button/button";
import CustomModal from "./customModal";
import ValidationModal from "./validationModal";
import { useAppSelector } from "@/redux/hooks";

interface Props {
    title: string,
    amount: number;
    fee: number;
    open: boolean;
    setOpenModal: Function;
    transactionHandler: (password:string) => void; 
}

const TransactionConfirmModal = ({title, amount = 0, fee = 0, open, setOpenModal, transactionHandler}: Props) => {
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
        transactionHandler(result);
        handleModal(false);
    }

    const handleModal = (open:boolean) => {
        setOpenModal && setOpenModal(open);
    }


    useEffect(() => {
        if(common.appState === "background") handleModal(false);
    }, [common.appState])

    return (
        <CustomModal
            visible={open}
            handleOpen={handleModal}>
                <>
                <View style={[styles.modalTextContents, {display: openValidationModal? "none":"flex"}]}>
                    <View style={styles.receiptBox}>
                        <View style={[styles.boxH, {justifyContent: "flex-start", alignItems: "center"}]}>
                            <Text style={styles.receiptTitle}>{signMoalText.title}</Text>
                        </View>
                        {amount > 0 &&
                        <View style={[styles.boxH, styles.receiptDesc, {borderTopWidth: 1, borderTopColor: BorderColor}]}>
                            <Text style={styles.itemTitle}>Amount</Text>
                            <Text style={styles.itemBalance}>{convertAmount(amount, false, 6)}<Text style={styles.itemTitle}>  FCT</Text></Text>
                        </View>
                        }
                        <View style={[styles.boxH, styles.receiptDesc]}>
                            <Text style={styles.itemTitle}>Fee</Text>
                            <Text style={styles.itemBalance}>{Number(fee / 1000000).toFixed(6)}<Text style={styles.itemTitle}>  FCT</Text></Text>
                        </View>
                    </View>
                    <View style={styles.modalPWBox}>
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
    modalPWBox: {
        paddingTop: 20,
    },
    receiptBox: {
        padding: 20,
        borderRadius: 4,
        backgroundColor: BoxColor,
    },
    receiptTitle: {
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