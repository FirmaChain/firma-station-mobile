import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ProposalTitleState } from '@/hooks/governance/hooks';
import { PROPOSAL_STATUS, STATUS_BACKGROUND_COLOR, STATUS_COLOR } from '@/constants/common';
import { Lato, TextColor } from '@/constants/theme';

interface Props {
    data: ProposalTitleState
}

const TitleSection = ({data}:Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={
                    [styles.status, 
                    data.status !== '' && {backgroundColor: STATUS_BACKGROUND_COLOR[data.status], color: STATUS_COLOR[data.status]}
                    ]}>{PROPOSAL_STATUS[data.status]}</Text>
                <Text style={styles.title}>{data.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 32,
        paddingBottom: 20,
    },
    box: {
        alignItems: "flex-start",
    },
    status: {
        fontFamily: Lato,
        fontWeight: "bold",
        fontSize: 13,
        borderRadius: 10,
        textAlign: "center",
        overflow: "hidden",
        paddingHorizontal: 14,
        paddingVertical: 5,
        marginBottom: 10,
    },
    title: {
        width: "100%",
        fontFamily: Lato,
        fontSize: 22,
        fontWeight: "bold",
        color: TextColor,
    },
})


export default TitleSection;