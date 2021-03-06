import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IProposalVoteState } from "@/hooks/governance/hooks";
import { BoxColor, Lato, TextColor, TextDarkGrayColor } from "@/constants/theme";
import { convertNumber, convertPercentage } from "@/util/common";
import VotingPercentage from "./votingPercentage";

interface IProps {
    data: IProposalVoteState;
    isVotingPeriod: boolean;
}

const VotingSection = ({data, isVotingPeriod}:IProps) => {
    const VoteData = useMemo(() => {
        if(data) 
            return {
                info: [
                    {title: "Quorum", data: convertNumber((data.quorum) * 100).toFixed(2)},
                    {title: "Current Turn out", data: convertNumber((data.currentTurnout * 100)).toFixed(2)}
                ],
                voteInfo : {
                    quorum: convertPercentage(data.quorum),
                    totalVotingPower: data.totalVotingPower,
                    proposalTally: data.proposalTally,
                    voters: data.voters,
                }
            }
        return {
            info: [
                {title: "Quorum", data: 0},
                {title: "Current Turn out", data: 0}
            ],
            voteInfo : {
                quorum: 0,
                totalVotingPower: 0,
                proposalTally: null,
                voters: null,
            }
        }
        
    }, [data]);

    return (
        <View style={[styles.container, isVotingPeriod && {marginBottom: 30}]}>
            <View style={[styles.box, styles.boxV]}>
                <View style={[styles.boxH, {paddingBottom: 12}]}>
                    <Text style={styles.desc}>Voting</Text>
                </View>
                {VoteData.info.map((value, index) => {
                    return (
                        <View key={index} style={[styles.boxH, {paddingBottom: 12}]}>
                            <Text style={styles.title}>{value.title}</Text>
                            <Text style={styles.desc}>{value.data + " %"}</Text>
                        </View>
                    )
                })}
                <VotingPercentage data={VoteData.voteInfo} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    box: {
        backgroundColor: BoxColor,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30
    },
    boxH: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    boxV: {
        alignItems: "flex-start",
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: "600",
        color: TextDarkGrayColor,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "600",
        color: TextColor,
    },
})

export default VotingSection;