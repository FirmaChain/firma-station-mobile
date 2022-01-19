import moment from "moment";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { convertNumber, convertPercentage, convertTime } from "../../../util/common";
import VotingPercentage from "./votingPercentage";

interface Props {
    data: any;
}

const VotingSection = ({data}:Props) => {
    return (
        <View style={styles.boxV}>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={[styles.infoTitle, {fontSize: 16}]}>Voting</Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Voting time</Text>
                <Text style={styles.infoDesc}>{convertTime(data.votingStartTime)} ~ {convertTime(data.votingEndTime)} </Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Quorum</Text>
                <Text style={styles.infoDesc}>{convertPercentage(data.quorum)}%</Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Current Turnout</Text>
                <Text style={styles.infoDesc}>{convertPercentage(data.currentTurnout)}%</Text>
            </View>
            <VotingPercentage quorum={convertNumber(convertPercentage(data.quorum))} stakingPool={data.stakingPool.totalVotingPower} proposalTally={data.proposalTally} />
        </View>
    )
}

const styles = StyleSheet.create({
    boxH: {
        flexDirection: "row",
    },
    boxV: {
        alignItems: "flex-start",
    },
    boxInfo: {
        alignItems: "flex-start", 
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    infoTitle: {
        width: 100,
        color: "#aaa",
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 15,
    }, 
    infoDesc: {
        fontSize: 14,
        flex: 1,
    }
})

export default VotingSection;