import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { getEstimateGasVoting, getFeesFromGas } from "@/util/firma";
import { BgColor, BoxColor, Lato, TextColor, TextDarkGrayColor, WhiteColor } from "@/constants/theme";
import { FIRMACHAIN_DEFAULT_CONFIG } from "@/../config";
import Button from "@/components/button/button";
import CustomModal from "@/components/modal/customModal";
import TransactionConfirmModal from "@/components/modal/transactionConfirmModal";
import AlertModal from "@/components/modal/alertModal";

interface Props {
    isVotingPeriod: boolean;
    proposalId: number;
    transactionHandler: (password:string, gas:number, votingOpt:number) => void;
}

const cols = 2;
const marginHorizontal = 5;
const marginVertical = 5;
const width = ((Dimensions.get('window').width - 20) / cols) - (marginHorizontal * (cols + 1));

const Voting = ({isVotingPeriod, proposalId, transactionHandler}:Props) => {
    const {wallet} = useAppSelector(state => state);
    
    const votingType = ["YES", "NO", "NoWithVeto", "Abstain"];
    
    const [active, setActive] = useState(isVotingPeriod);
    const [votingGas, setVotingGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const [selectedVote, setSelectedVote] = useState("");
    const [openVoteModal, setOpenVoteModal] = useState(false);
    const [openTransactionModal, setOpenTransactionModal] = useState(false);

    const handleVoteModal = (open:boolean) => {
        if(open) setSelectedVote("");
        setOpenVoteModal(open);
    }

    const handleTransactionModal = (open:boolean) => {
        setOpenTransactionModal(open);
    }

    const handleTransaction = (password:string) => {
        if(alertDescription !== '') return handleModalOpen(true);
        transactionHandler(password, votingGas, getVotingOption(selectedVote));
    }

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const getVotingOption = (vote: string) => {
        switch (vote) {
            case "YES":
                return 1;
            case "NO":
                return 3;
            case "NoWithVeto":
                return 4;
            case "Abstain":
                return 2;
            default:
                return 0;
        }
    }

    const handleVoting = async() => {
        handleVoteModal(false);
        setActive(false);
        CommonActions.handleLoadingProgress(true);
        await getEstimateGasVoting(wallet.name, proposalId, getVotingOption(selectedVote)).then(value => {
            setVotingGas(value);
            CommonActions.handleLoadingProgress(false);
        })
        .catch(error => {
            console.log(error);
            setAlertDescription(String(error));
            CommonActions.handleLoadingProgress(false);
            return;
        });
        setActive(true);
        handleTransactionModal(true);
    }

    return(
        <>
        <View style={{paddingHorizontal: 20, display: "flex"}}>
            {isVotingPeriod &&
                <Button title="Vote" active={active} onPressEvent={()=>handleVoteModal(true)} />
            }
        </View>
        <CustomModal
            visible={openVoteModal} 
            handleOpen={handleVoteModal}>
                <View style={styles.modalTextContents}>
                    <Text style={styles.title}>Voting</Text>
                    <View style={styles.box}>
                        {votingType.map((item, index) => {
                            return (
                            <TouchableOpacity 
                                key={index} 
                                style={[
                                    styles.borderBox, 
                                    {
                                        borderColor: selectedVote === item? WhiteColor:BoxColor,
                                        marginBottom: index < 2?marginVertical*4:0,
                                        marginLeft: index%2 === 0?0:marginHorizontal*2,
                                    }
                                ]} 
                                onPress={() => setSelectedVote(item)}>
                                <Text style={[
                                    styles.vote, 
                                    {
                                        color: selectedVote === item? WhiteColor:TextDarkGrayColor,
                                        fontWeight: selectedVote === item? "600":"normal",
                                    }
                                ]}>{item}</Text>
                            </TouchableOpacity>
                            )
                        })}
                    </View>
                    <Button title="Next" active={selectedVote !== ""} onPressEvent={()=> handleVoting()}/>
                </View>
        </CustomModal>
        <TransactionConfirmModal 
            transactionHandler={handleTransaction} 
            title={"Voting"} 
            amount={0}
            vote={selectedVote}
            fee={getFeesFromGas(votingGas)} 
            open={openTransactionModal} 
            setOpenModal={handleTransactionModal} />
        <AlertModal
            visible={isAlertModalOpen}
            handleOpen={handleModalOpen}
            title={"Failed"}
            desc={alertDescription}
            confirmTitle={"OK"}
            type={"ERROR"}/>
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
        fontSize: 20,
        fontWeight: "bold",
        color: TextDarkGrayColor,
    },
    box: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 30,
    },
    borderBox: {
        width: width,
        height: 68,
        borderWidth: 2,
        borderRadius: 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BgColor,
    },
    voteItem: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
    },
    vote: {
        width: "auto",
        fontFamily: Lato,
        fontSize: 16,
    },
})

export default Voting;