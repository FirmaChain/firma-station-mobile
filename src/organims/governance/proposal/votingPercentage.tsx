import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BgColor, BorderColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from "@/constants/theme";
import { convertAmount, convertNumber, convertPercentage } from "../../../util/common";
import { CaretUp } from "@/components/icon/icon";

interface Props {
    data: any;
}

const VotingPercentage = ({data}:Props) => {
    const tally = useMemo(() => {
        if(data.proposalTally)
            return [
                { title: "YES", vote: data.proposalTally.yes},
                { title: "NO", vote: data.proposalTally.no },
                { title: "NoWithVeto", vote: data.proposalTally.noWithVeto },
                { title: "Abstain", vote: data.proposalTally.abstain }
            ]

        return [
            { title: "YES", vote: 0 },
            { title: "NO", vote: 0 },
            { title: "NoWithVeto", vote: 0 },
            { title: "Abstain", vote: 0 }
        ]
    }, [data]);

    const totalVote = () => {
        let total:number = 0;
        tally.filter(type => type.title !== "Abstain").map(item => total += item.vote);

        return total;
    }

    const votingColor = (vote:string) => {
        switch (vote) {
            case "YES":
                return "#3dd598";
            case "NO":
                return "#ffc542";
            case "NoWithVeto":
                return "#de3d3d";
            case "Abstain":
                return "#92929d";
        }
    }
    
    const calculateRatio = (value:number, max:number|string) => {
        if(value === 0 || max === 0 || max === undefined) return 0;
        const ratio = Number(value) / Number(max);
        return ratio;
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.background}>
                {tally.map((item, index) => {
                    if(item.title !== "Abstain"){
                        return (
                            <View key={index} 
                            style={
                                [styles.percentage, 
                                {
                                    backgroundColor: votingColor(item.title), 
                                    flex: calculateRatio(item.vote, data.totalVotingPower), 
                                    marginLeft: -10, 
                                    paddingLeft: 10,
                                    zIndex: 5 - index,
                                }]} />
                        )
                    }
                })}
            </View>
            <View style={styles.quorumWrapper}>
                <View style={[styles.quorumLine, {left: convertNumber(data.quorum) + "%" }]} />
                <View style={[styles.quorum, {left: convertNumber(data.quorum) + "%", marginLeft: -9 }]}>
                    <CaretUp size={20} color={WhiteColor} />
                </View>
            </View>

            <View style={[styles.box]}>
                {tally.map((item, index) => {
                    const odd = (index + 1) % 2;
                    return (
                    <View key={index} style={[styles.voteBox, {marginRight: odd === 1? 11:0, marginBottom: 11}]}>
                        <View style={[styles.boxH, {paddingBottom: 8}]}>
                            <View style={[styles.voteDot, {backgroundColor: votingColor(item.title)}]} />
                            <Text style={[styles.vote, {color: votingColor(item.title)}]}>{item.title}</Text>
                        </View>
                        <View style={styles.dataBox}>
                            {item.title !== "Abstain" && <Text style={styles.percent}>{convertPercentage(calculateRatio(item.vote, totalVote())) + ' %'}</Text>}
                            <Text style={[styles.amount, {textAlign: "right"}]}>{convertAmount(item.vote)}</Text>
                        </View>
                    </View>
                    )
                })}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        paddingTop: 25,
    },
    background: {
        flex: 100,
        height: 12,
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: BorderColor,
        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
    },
    percentage: {
        height: 12,
        borderRadius: 8,
    },
    quorumWrapper: {
        flex: 100,
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 47,
    },
    quorum: {
        position: "absolute",
        alignItems: "flex-end",
    },
    quorumLine: {
        position: "absolute", 
        top: -18, 
        height: 25, 
        width: 2, 
        backgroundColor: WhiteColor, 
    },
    box: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    boxH: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    voteBox: {
        flex: 1,
        minWidth: 122,
        maxWidth: 142,
        paddingVertical: 17,
        borderRadius: 8,
        backgroundColor: BgColor,
        alignItems: "center",
    },
    vote: {
        width: "auto",
        fontFamily: Lato,
        fontWeight: "600",
        fontSize: 16,
    },
    voteDot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        marginRight: 4,
        overflow: "hidden",
    },
    dataBox: {
        height: 43,
        justifyContent: "center",
        alignItems: "center",
    },
    percent: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "bold",
        color: TextColor,
        paddingBottom: 6,
    },
    amount: {
        fontFamily: Lato,
        fontSize: 12,
        color: TextCatTitleColor,
    },
})

export default VotingPercentage;