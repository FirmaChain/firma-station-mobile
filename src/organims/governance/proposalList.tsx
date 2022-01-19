import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PROPOSAL_STATUS, STATUS_COLOR } from "../../constants/common";
import { ContainerColor, TextGrayColor } from "../../constants/theme";
import { convertNumber } from "../../util/common";

interface Props {
    proposals: Array<any>;
    handleDetail: Function;
}

const ProposalList = ({proposals, handleDetail}:Props) => {

    const handleProposalDetail = (proposalId:number) => {
        handleDetail && handleDetail(proposalId);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Proposals</Text>
            </View>
            <ScrollView>
                {proposals.map((proposal, index) => {
                    return (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.list ,(index === (proposals.length -1) && {borderBottomWidth: 0})]} 
                            onPress={() => handleProposalDetail(convertNumber(proposal.proposalId))}>
                            <View style={[styles.wrapperH, {alignItems: "flex-start"}]}>
                                <View style={styles.wrapperV}>
                                    <Text style={styles.id}># {proposal.proposalId}</Text>
                                </View>
                                <View style={[styles.wrapperV, {marginHorizontal: 10}]}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.proposalTitle}>{proposal.title}</Text>
                                    <Text style={styles.type} numberOfLines={1} ellipsizeMode="tail">{proposal.proposalType}</Text>
                                    <Text style={[styles.status, {backgroundColor: STATUS_COLOR[proposal.status]}]}>{PROPOSAL_STATUS[proposal.status]}</Text>
                                    <Text style={styles.desc} numberOfLines={3} ellipsizeMode="tail">{proposal.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: ContainerColor,
        borderRadius: 8,
        justifyContent: "center",
    },
    header: {
        height: 50,
        paddingHorizontal: 20,
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        backgroundColor: ContainerColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        color: TextGrayColor,
        fontWeight: "bold"
    },
    list: {
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    wrapperH: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    descWrapperH: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 5,
    },
    wrapperV: {
        justifyContent: "flex-start"
    },
    id: {
        fontSize: 14,
        color: "#aaa",
    },
    status: {
        width: 60,
        fontSize: 8,
        borderRadius: 4,
        textAlign: "center",
        overflow: "hidden",
        color: TextGrayColor,
        padding: 5,
        marginBottom: 5,
    },
    proposalTitle: {
        flex: 1,
        fontSize: 14,
        textAlign: "left",
    },
    type: {
        fontSize: 12,
        color: "#aaa",
        fontWeight: "bold",
        marginBottom: 5,
    },
    desc: {
        fontSize: 12,
        color: "#aaa",
    },
})

export default React.memo(ProposalList);