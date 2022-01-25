import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { PROPOSAL_STATUS, STATUS_BACKGROUND_COLOR, STATUS_COLOR } from '../../../constants/common';
import { Lato, TextColor, TextGrayColor } from '../../../constants/theme';

interface Props {
    data: {
        id: number;
        title: string;
        status: string;
    }
}

const TitleSection = ({data}:Props) => {
    const Data = useMemo(() => {
        if(data) return {
            id: data.id,
            title: data.title,
            status: data.status,
        }
        return {
            id: 0,
            title: '',
            status: '',
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={
                    [styles.status, 
                    Data.status !== '' && {backgroundColor: STATUS_BACKGROUND_COLOR[Data.status], color: STATUS_COLOR[Data.status]}
                    ]}>{PROPOSAL_STATUS[Data.status]}</Text>
                <Text style={styles.title}>{Data.title}</Text>
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