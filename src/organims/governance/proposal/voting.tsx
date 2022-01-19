import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../components/button/button";
import CustomModal from "../../../components/modal/customModal";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import { ContainerColor, TextColor } from "../../../constants/theme";

const cols = 2;
const marginHorizontal = 4;
const marginVertical = 4;
const width = ((Dimensions.get('window').width - 40) / cols) - (marginHorizontal * (cols + 1));

interface Props {
    transactionHandler: Function;
}

const Voting = ({transactionHandler}:Props) => {
    const votingType = ["YES", "NO", "NoWithVeto", "Abstain"];

    const [selectedVote, setSelectedVote] = useState("");
    const [openVoteModal, setOpenVoteModal] = useState(false);
    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const handleVoteModal = (open:boolean) => {
        setOpenVoteModal(open);
    }

    const handleTransactionModal = (open:boolean) => {
        if(open) handleVoteModal(false);
        setOpenTransactionModal(open);
    }

    const handleVoting = (vote:string) => {
        setSelectedVote(vote);
        handleTransactionModal(true);
    }

    return(
        <>
        <Button title="Vote" active={true} onPressEvent={handleVoteModal} />
        <CustomModal
            visible={openVoteModal} 
            handleOpen={handleVoteModal}>
                <View style={styles.modalTextContents}>
                    <Text style={styles.title}>Voting</Text>
                    <View style={styles.box}>
                        {votingType.map((item, index) => {
                            return (
                            <TouchableOpacity key={index} style={styles.borderBox} onPress={() => handleVoting(item)}>
                                <Text>{item}</Text>
                            </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
        </CustomModal>
        <TransactionConfirmModal transactionHandler={transactionHandler} title={"Vote - " + selectedVote} walletName={""} open={openTransactionModal} setOpenModal={handleTransactionModal} />
        </>
    )
}

const styles = StyleSheet.create({
    modalTextContents: {
        width: "100%",
        padding: 20,
    },
    title: {
        color: TextColor,
        fontSize: 20,
        fontWeight: "600",
    },
    desc: {
        fontSize: 14,
    },
    modalPWBox: {
        paddingVertical: 20,
    },
    
    button: {
        height: 50,
        borderRadius: 8,
        backgroundColor: ContainerColor,
        alignItems: "center",
        justifyContent: "center"
    },
    box: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    borderBox: {
        width: width,
        marginTop: marginVertical,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        borderColor: ContainerColor, 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: "center",
    },
})

export default Voting;