import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import CaretUp from "react-native-vector-icons/Ionicons";
import { ContainerColor } from "../../../constants/theme";
import { ConvertAmount, convertPercentage, convertToFctNumber } from "../../../util/common";

interface Props {
    quorum: number;
    stakingPool: string;
    proposalTally: any;
}

const cols = 2;
const marginHorizontal = 4;
const marginVertical = 4;
const width = (Dimensions.get('window').width / cols) - (marginHorizontal * (cols + 1));

const VotingPercentage = ({quorum, stakingPool, proposalTally}:Props) => {

    const tally = useMemo(() => {
        return [
            { title: "YES", vote: proposalTally.yes },
            { title: "NO", vote: proposalTally.no },
            { title: "NoWithVeto", vote: proposalTally.noWithVeto },
            { title: "Abstain", vote: proposalTally.abstain }
        ]
    }, [proposalTally]);

    const totalVote = () => {
        let total:number = 0;
        tally.filter(type => type.title !== "Abstain").map(item => total += item.vote);

        return total;
    }

    const votingColor = (vote:string) => {
        switch (vote) {
            case "YES":
                return "#61c799";
            case "NO":
                return "#fc3d5b";
            case "NoWithVeto":
                return "#fd9c4a";
            case "Abstain":
                return "#c637ff";
        }
    }
    
    const calculateRatio = (value:number, max:number|string) => {
        const ratio = Number(value) / Number(max);
        return ratio;
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.background}>
                {tally.map((item, index) => {
                    return (
                        <View key={index} style={[styles.percentage, {backgroundColor: votingColor(item.title), flex: calculateRatio(item.vote, stakingPool)}]} />
                    )
                })}
            </View>
            <View style={styles.quorumWrapper}>
                <View style={[styles.quorum, {flex: quorum}]}>
                    <CaretUp name="caret-up" size={20} color={"#6679ff"} />
                </View>
                <View style={{flex: 100-quorum}}/>
            </View>

            <View style={[styles.box]}>
                {tally.map((item, index) => {
                    return (
                    <View key={index} style={[styles.borderBox]}>
                        <View style={[styles.boxH, {justifyContent: "space-between"}]}>
                            <View style={styles.boxH}>
                                <View style={[styles.voteDot, {backgroundColor: votingColor(item.title)}]} />
                                <Text style={styles.vote}>{item.title}</Text>
                            </View>
                            {item.title !== "Abstain" && <Text style={styles.content}>{convertPercentage(calculateRatio(item.vote, totalVote()))}%</Text>}
                        </View>
                        <Text style={[styles.content, {textAlign: "right"}]}>{ConvertAmount(item.vote)}</Text>
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
    },
    background: {
        flex: 100,
        height: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "#348bff",
        borderRadius: 8,
        overflow: "hidden",
        marginHorizontal: 20,
    },
    quorumWrapper: {
        flex: 100,
        marginHorizontal: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    quorum: {
        alignItems: "flex-end",
    },
    percentage: {
        height: 10
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
    borderBox: {
        width: width,
        height: 65,
        justifyContent: "space-evenly",
        marginTop: marginVertical,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        borderColor: ContainerColor, 
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    vote: {
        width: "auto",
        fontSize: 14,
    },
    voteDot: {
        width: 10,
        height: 10,
        borderRadius: 50,
        overflow: "hidden",
        marginRight: 10,
    },
    content: {
        color: "#1e1e1e",
        fontSize: 14,
    },
})

export default VotingPercentage;