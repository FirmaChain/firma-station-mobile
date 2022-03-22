import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PROPOSAL_STATUS, PROPOSAL_STATUS_DEPOSIT_PERIOD, STATUS_BACKGROUND_COLOR, STATUS_COLOR } from "@/constants/common";
import { BoxColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor, TextDisableColor, TextGrayColor } from "@/constants/theme";
import { convertNumber, convertTime } from "@/util/common";
import { ProposalItemState } from "@/hooks/governance/hooks";

interface Props {
    proposals: Array<ProposalItemState>;
    handleDetail: Function;
}

const ProposalList = ({proposals, handleDetail}:Props) => {

    const handleProposalDetail = (proposalId:number) => {
        handleDetail && handleDetail(proposalId);
    }

    const handlePeriodStatus = (proposal:any) => {
        let period = '';
        if(proposal.status === PROPOSAL_STATUS_DEPOSIT_PERIOD){
            period = "Deposit ends : " + convertTime(proposal.depositEndTime, false);
        } else {
            period = "Voting ends : " + convertTime(proposal.votingEndTime, false);
        }

        return {
            period: period,
            dDay: getDDays(convertTime(proposal.depositEndTime, false)),
        }
    }

    const getDDays = (date:string) => {
        const period = new Date(date);
        const today = new Date();

        const gap = period.getTime() - today.getTime();
        const result = Math.ceil(gap / (1000 * 60 * 60 * 24));

        if(result > 1) return result + " days left";
        if(result === 1) return result + " day left";
        return "";
    }

    return (
        <View style={styles.container}>
            {proposals.map((proposal, index) => {
                const periodState = handlePeriodStatus(proposal);
                return (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.item} 
                        onPress={() => handleProposalDetail(convertNumber(proposal.proposalId))}>
                            <View style={[styles.wrapperH, {paddingBottom: 10}]}>
                                <Text style={styles.id}># {proposal.proposalId}</Text>
                                <Text style={[styles.status, {backgroundColor: STATUS_BACKGROUND_COLOR[proposal.status], color: STATUS_COLOR[proposal.status]}]}>{PROPOSAL_STATUS[proposal.status]}</Text>
                            </View>
                            <View style={[styles.wrapperH, {paddingBottom: 10}]}>
                                <Text style={styles.title}>{proposal.title}</Text>
                            </View>
                            <View style={styles.wrapperH}>
                                <Text style={[styles.period, {color: TextDisableColor}]}>
                                    {periodState.period}
                                </Text>
                                <Text style={[styles.period, {color: TextCatTitleColor, fontWeight: "600"}]}>{periodState.dDay}</Text>
                            </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 32,
    },
    item: {
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 26,
        backgroundColor: BoxColor,
        borderRadius: 8,
        marginBottom: 12,
    },
    wrapperH: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    wrapperV: {
        justifyContent: "flex-start"
    },
    descWrapperH: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 5,
    },
    id: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "600",
        color: TextDarkGrayColor,
    },
    status: {
        fontFamily: Lato,
        fontWeight: "bold",
        fontSize: 11,
        borderRadius: 10,
        textAlign: "center",
        overflow: "hidden",
        color: TextGrayColor,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    title: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "bold",
        color: TextColor,
    },
    period: {
        fontFamily: Lato,
        fontSize: 14,
    },
})

export default React.memo(ProposalList);