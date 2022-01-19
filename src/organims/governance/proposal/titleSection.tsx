import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { PROPOSAL_STATUS, STATUS_COLOR } from '../../../constants/common';
import { TextGrayColor } from '../../../constants/theme';

interface Props {
    data: {
        id: number;
        title: string;
        status: string;
    }
}

const TitleSection = ({data}:Props) => {
    return (
        <View style={[styles.boxH, {alignItems: "flex-start", paddingHorizontal: 20}]}>
            <Text style={styles.id}># {data.id}</Text>
            <Text style={styles.proposalTitle}>{data.title}</Text>
            <Text style={[styles.status, {backgroundColor: STATUS_COLOR[data.status]}]}>{PROPOSAL_STATUS[data.status]}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    boxH: {
        flexDirection: "row",
    },
    divier: {
        height: 1,
        backgroundColor: "#aaa",
        marginVertical: 10,
        marginHorizontal: 20,
    },
    id: {
        fontSize: 14,
        color: "#aaa",
    },
    proposalTitle: {
        flex: 1,
        fontSize: 16,
        textAlign: "left",
        marginHorizontal: 10,
    },
    status: {
        width: 60,
        fontSize: 8,
        borderRadius: 4,
        textAlign: "center",
        overflow: "hidden",
        color: TextGrayColor,
        padding: 5,
    },
})


export default TitleSection;