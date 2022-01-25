import { PROPOSAL_STATUS_DEPOSIT_PERIOD, PROPOSAL_STATUS_VOTING_PERIOD } from "@/constants/common";
import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../../../components/button/button";
import CustomModal from "../../../components/modal/customModal";
import TransactionConfirmModal from "../../../components/modal/transactionConfirmModal";
import { BorderColor, Lato, TextColor } from "../../../constants/theme";

const cols = 2;
const marginHorizontal = 4;
const marginVertical = 4;
const width = ((Dimensions.get('window').width - 40) / cols) - (marginHorizontal * (cols + 1));

interface Props {
    status: string;
    transactionHandler: Function;
    depositHandler: Function;
}

const Voting = ({status, transactionHandler, depositHandler}:Props) => {
    const displayStatus = useMemo(() => {
        if(status === undefined || status === "") return "none";
        if(status === PROPOSAL_STATUS_DEPOSIT_PERIOD || status === PROPOSAL_STATUS_VOTING_PERIOD) return "flex";
    }, [status]);

    const votingType = ["YES", "NO", "No With Veto", "Abstain"];

    const [selectedVote, setSelectedVote] = useState("");
    const [openVoteModal, setOpenVoteModal] = useState(false);
    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const handleDeposit = () => {
        depositHandler && depositHandler();
    }

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
        <View style={{paddingHorizontal: 20, display: displayStatus}}>
            {status === PROPOSAL_STATUS_DEPOSIT_PERIOD && <Button title="Deposit" active={true} onPressEvent={()=>handleDeposit()} />}
            {status === PROPOSAL_STATUS_VOTING_PERIOD && <Button title="Vote" active={true} onPressEvent={()=>handleVoteModal(true)} />}
        </View>
        <CustomModal
            visible={openVoteModal} 
            handleOpen={handleVoteModal}>
                <View style={styles.modalTextContents}>
                    <Text style={styles.title}>Voting</Text>
                    <View style={styles.box}>
                        {votingType.map((item, index) => {
                            return (
                            <TouchableOpacity key={index} style={styles.borderBox} onPress={() => handleVoting(item)}>
                                <Text style={styles.voteItem}>{item}</Text>
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
        fontFamily: Lato,
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
        borderColor: BorderColor, 
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        alignItems: "center",
    },
    voteItem: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
    }
})

export default Voting;