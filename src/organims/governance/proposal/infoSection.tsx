import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PROPOSAL_MESSAGE_TYPE } from "../../../constants/common";
import { convertTime } from "../../../util/common";

interface Props {
    data: {
        type: string;
        submitTime: string;
        description: string;
        classified: any;
    }
}

const InfoSection = ({data}:Props) => {
    const convertClassified = (classified:any) => {
        if(classified === undefined) return;
        if(classified.changes) {
            return (
                <View style={[styles.boxH, styles.boxInfo]}>
                    <Text numberOfLines={2} style={styles.infoTitle}>Change Parameters</Text>
                    <Text style={styles.infoDesc}>{JSON.stringify(classified.changes)}</Text>
                </View>
            )
        }

        if(classified.version) {
            return (
                <>
                <View style={[styles.boxH, styles.boxInfo]}>
                    <Text numberOfLines={2} style={styles.infoTitle}>Height</Text>
                    <Text style={styles.infoDesc}>{classified.height}</Text>
                </View>
                <View style={[styles.boxH, styles.boxInfo]}>
                    <Text numberOfLines={2} style={styles.infoTitle}>Version</Text>
                    <Text style={styles.infoDesc}>{classified.version}</Text>
                </View>
                <View style={[styles.boxH, styles.boxInfo]}>
                    <Text numberOfLines={2} style={styles.infoTitle}>Info</Text>
                    <Text style={styles.infoDesc}>{classified.info}</Text>
                </View>
                </>
            )
        }

        if(classified.recipient) {
            return (
                <>
                <View style={[styles.boxH, styles.boxInfo]}>
                    <Text numberOfLines={2} style={styles.infoTitle}>Recipient</Text>
                    <Text style={styles.infoDesc}>{classified.recipient}</Text>
                </View>
                <View style={[styles.boxH, styles.boxInfo]}>
                    <Text numberOfLines={2} style={styles.infoTitle}>Amount</Text>
                    <Text style={styles.infoDesc}>{classified.amount}</Text>
                </View>
                </>
            )
        }
    }

    return (
        <View style={styles.boxV}>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Proposal Type</Text>
                <Text style={styles.infoDesc}>{PROPOSAL_MESSAGE_TYPE[data.type]}</Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Submit Time</Text>
                <Text style={styles.infoDesc}>{convertTime(data.submitTime)}</Text>
            </View>
            <View style={[styles.boxH, styles.boxInfo]}>
                <Text style={styles.infoTitle}>Description</Text>
                <Text style={styles.infoDesc}>{data.description}</Text>
            </View>
            {convertClassified(data.classified)}
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

export default InfoSection;