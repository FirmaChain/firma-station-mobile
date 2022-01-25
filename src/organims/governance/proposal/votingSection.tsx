import { BoxColor, Lato, TextColor, TextDarkGrayColor } from "@/constants/theme";
import moment from "moment";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { convertNumber, convertPercentage, convertTime } from "../../../util/common";
import VotingPercentage from "./votingPercentage";

interface Props {
    data: any;
}

const VotingSection = ({data}:Props) => {
    const VoteData = useMemo(() => {
        if(data) 
            return {
                info: [
                    {title: "Quorum", data: convertPercentage(data.quorum)},
                    {title: "Current Turn out", data: convertPercentage(data.currentTurnout)}
                ],
                voteInfo : {
                    quorum: convertPercentage(data.quorum),
                    totalVotingPower: data.stakingPool.totalVotingPower,
                    proposalTally: data.proposalTally,
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
            }
        }
        
    }, [data]);

    return (
        <View style={styles.container}>
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
        marginVertical: 30,
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
    // boxInfo: {
    //     alignItems: "flex-start", 
    //     paddingHorizontal: 20,
    //     paddingVertical: 10,
    // },
    // infoTitle: {
    //     width: 100,
    //     color: "#aaa",
    //     fontSize: 14,
    //     fontWeight: "bold",
    //     marginRight: 15,
    // }, 
    // infoDesc: {
    //     fontSize: 14,
    //     flex: 1,
    // }
})

export default VotingSection;