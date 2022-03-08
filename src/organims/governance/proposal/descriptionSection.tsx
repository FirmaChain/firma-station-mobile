import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BoxColor, DividerColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from "@/constants/theme";
import { PROPOSAL_MESSAGE_TYPE, PROPOSAL_STATUS_DEPOSIT_PERIOD } from "@/constants/common";
import { convertAmount, convertTime } from "@/util/common";
import { ProposalDescriptionState } from "@/hooks/governance/hooks";

interface Props {
    data: ProposalDescriptionState;
}

const DescriptionSection = ({data}:Props) => {

    const InfoSection = useMemo(() => {
        if(data) return [
            {title: "Proposal Type", data: PROPOSAL_MESSAGE_TYPE[data.proposalType]},
            {title: "Submit Time", data: convertTime(data.submitTime, true)},
            {title: "Voting Start Time", data: data.status === PROPOSAL_STATUS_DEPOSIT_PERIOD? null : convertTime(data.votingStartTime, true)},
            {title: "Voting End Time", data: data.status === PROPOSAL_STATUS_DEPOSIT_PERIOD? null : convertTime(data.votingEndTime, true)},
        ]
        return [
            {title: "Proposal Type", data: ''},
            {title: "Submit Time", data: ''},
            {title: "Voting Start Time", data: null},
            {title: "Voting End Time", data: null},
        ]
    }, [data]);

    const Description = useMemo(() => {
        if(data) return {title: "Description", data: data.description}
        return {title: "Description", data: ''}
    }, [data]);

    const Classified = useMemo(() => {
        if(data) return data.classified;
        return null;
    }, [data]);

    const combinedDeposit = (proposalDeposit:Array<any>) => {
        let deposit:number = 0;
        proposalDeposit.map(data => deposit += Number(data.amount));
        return deposit;
    }

    const DepositSection = useMemo(() => {
        if(data) return [
            {title: "Deposit Period", data: data.depositPeriod},
            {title: "Min Deposit Amount", data: convertAmount(data.minDeposit) + " FCT"},
            {title: "Current Deposit", data: convertAmount(combinedDeposit(data.proposalDeposit)) + " FCT"},
        ]
        return [
            {title: "Deposit Period", data: ''},
            {title: "Min Deposit Amount", data: '0 FCT'},
            {title: "Current Deposit", data: '0 FCT'},
        ]
    }, [data]);

    const convertClassified = (classified:any) => {
        if(classified === undefined || classified === null) return;
        if(classified.changes) {
            return (
                <View style={[styles.boxV, {paddingTop: 30}]}>
                    <Text style={[styles.title, styles.titleV]}>Change Parameters</Text>
                    <Text style={[styles.desc, {fontSize: 16}]}>{JSON.stringify(classified.changes)}</Text>
                </View>
            )
        }

        if(classified.version) {
            return (
                <View style={styles.boxV}>
                    <View style={[styles.boxV, {paddingTop: 30}]}>
                        <Text style={[styles.title, styles.titleV]}>Height</Text>
                        <Text style={[styles.desc, {fontSize: 16}]}>{classified.height}</Text>
                    </View>
                    <View style={[styles.boxV, {paddingTop: 30}]}>
                        <Text style={[styles.title, styles.titleV]}>Version</Text>
                        <Text style={[styles.desc, {fontSize: 16}]}>{classified.version}</Text>
                    </View>
                    <View style={[styles.boxV, {paddingTop: 30}]}>
                        <Text style={[styles.title, styles.titleV]}>Info</Text>
                        <Text style={[styles.desc, {fontSize: 16}]}>{classified.info}</Text>
                    </View>
                </View>
            )
        }

        if(classified.recipient) {
            return (
                <View style={styles.boxV}>
                    <View style={[styles.boxV, {paddingTop: 30}]}>
                        <Text style={[styles.title, styles.titleV]}>Recipient</Text>
                        <Text style={[styles.desc, {fontSize: 16}]}>{classified.recipient}</Text>
                    </View>
                    <View style={[styles.boxV, {paddingTop: 30}]}>
                        <Text style={[styles.title, styles.titleV]}>Amount</Text>
                        <Text style={[styles.desc, {fontSize: 16}]}>{convertAmount(classified.amount) + " FCT"}</Text>
                    </View>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.divider}/>
            <View style={[styles.boxV, {paddingVertical: 20}]}>
                {InfoSection.map((value, index) => {
                    return (
                        <View key={index} 
                            style={[
                                styles.boxH, 
                                {justifyContent: "space-between"}, 
                                index <= InfoSection.length - 1 && {paddingBottom: 10},
                                !value.data && {display: "none"}
                            ]}>
                            <Text style={[styles.title, {fontSize: 14}]}>{value.title}</Text>
                            <Text style={[styles.desc, {fontSize: 14, color: TextDarkGrayColor}]}>{value.data}</Text>
                        </View>
                    )
                })}
            </View>
            <View style={styles.divider}/>
            <View style={[styles.boxV, {paddingVertical: 30}]}>
                <View style={styles.boxV}>
                    <Text style={[styles.title, styles.titleV]}>{Description.title}</Text>
                    <Text style={[styles.desc, {fontSize: 16}]}>{Description.data}</Text>
                </View>
                {convertClassified(Classified)}
                <View style={styles.depositBox}>
                    {DepositSection.map((value, index) => {
                        return (
                            <View key={index} style={[styles.boxH, {justifyContent: "space-between"}, index <= InfoSection.length - 1 && {paddingBottom: 12}]}>
                                <Text style={[styles.title, {fontSize: 14}]}>{value.title}</Text>
                                <Text style={[styles.desc, {fontSize: index === 0? 13 : 14, color: TextColor}]}>{value.data}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
            <View style={styles.divider}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: DividerColor,
    },
    boxH: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    depositBox: {
        width: "100%",
        backgroundColor: BoxColor,
        borderRadius: 8,
        padding: 20,
        marginTop: 36,
    },
    boxV: {
        alignItems: "flex-start",
    },
    title: {
        fontFamily: Lato,
        fontWeight: "600",
        color: TextDarkGrayColor,
    },
    desc: {
        fontFamily: Lato,
        fontWeight: "normal",
        color: TextCatTitleColor,
    },
    titleV: {
        fontSize: 18, 
        paddingBottom: 11,
    }
})

export default DescriptionSection;