import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BoxColor, DividerColor, Lato, TextAddressColor, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { CHAIN_SYMBOL, PROPOSAL_MESSAGE_TYPE, PROPOSAL_STATUS_DEPOSIT_PERIOD } from '@/constants/common';
import { convertAmount, convertTime } from '@/util/common';
import { IProposalDescriptionState } from '@/hooks/governance/hooks';
import { ICON_LINK_ARROW } from '@/constants/images';

interface IProps {
    data: IProposalDescriptionState;
    handleMoveToExplorer: () => void;
}

const DescriptionSection = ({ data, handleMoveToExplorer }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const isDepositPeriod = useMemo(() => {
        return data.status === PROPOSAL_STATUS_DEPOSIT_PERIOD;
    }, [data.status]);

    const InfoSection = useMemo(() => {
        if (data)
            return [
                { title: 'Proposal Type', data: PROPOSAL_MESSAGE_TYPE[data.proposalType] },
                { title: 'Submit Time', data: convertTime(data.submitTime, true) },
                { title: 'Voting Start Time', data: isDepositPeriod ? null : convertTime(data.votingStartTime, true) },
                { title: 'Voting End Time', data: isDepositPeriod ? null : convertTime(data.votingEndTime, true) },
                { title: 'Deposit Period', data: isDepositPeriod ? data.depositPeriod : null },
                { title: 'Min Deposit Amount', data: isDepositPeriod ? `${convertAmount(data.minDeposit)} ${_CHAIN_SYMBOL}` : null },
                { title: 'Current Deposit', data: isDepositPeriod ? `${convertAmount(data.proposalDeposit)} ${_CHAIN_SYMBOL}` : null }
            ];
        return [
            { title: 'Proposal Type', data: '' },
            { title: 'Submit Time', data: '' },
            { title: 'Voting Start Time', data: null },
            { title: 'Voting End Time', data: null },
            { title: 'Deposit Period', data: null },
            { title: 'Min Deposit Amount', data: null },
            { title: 'Current Deposit', data: null }
        ];
    }, [data, isDepositPeriod]);

    const Description = useMemo(() => {
        if (data) return { title: 'Description', data: data.description };
        return { title: 'Description', data: '' };
    }, [data]);

    const Classified = useMemo(() => {
        if (data) return data.classified;
        return null;
    }, [data]);

    const convertClassified = (classified: any) => {
        if (classified === undefined || classified === null) return;
        if (classified.changes) {
            return (
                <View style={styles.depositBox}>
                    <Text style={[styles.title, styles.titleV, { color: TextColor }]}>Change Parameters</Text>
                    <Text style={[styles.desc, { fontSize: 16 }]}>{JSON.stringify(classified.changes)}</Text>
                </View>
            );
        }

        if (classified.version) {
            return (
                <View style={styles.boxV}>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Height</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.height}</Text>
                    </View>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Version</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.version}</Text>
                    </View>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Info</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.info}</Text>
                    </View>
                </View>
            );
        }

        if (classified.recipient) {
            return (
                <View style={styles.boxV}>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Recipient</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{classified.recipient}</Text>
                    </View>
                    <View style={[styles.boxV, { paddingTop: 30 }]}>
                        <Text style={[styles.title, styles.titleV]}>Amount</Text>
                        <Text style={[styles.desc, { fontSize: 16 }]}>{`${convertAmount(classified.amount)} ${_CHAIN_SYMBOL}`}</Text>
                    </View>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.divider} />
            <View style={[styles.boxV, { paddingTop: 20, paddingBottom: 10 }]}>
                {InfoSection.map((value, index) => {
                    return (
                        <View
                            key={index}
                            style={[
                                styles.boxH,
                                { justifyContent: 'space-between' },
                                index <= InfoSection.length - 1 && { paddingBottom: 10 },
                                !value.data && { display: 'none' }
                            ]}
                        >
                            <Text style={[styles.title, { fontSize: 14 }]}>{value.title}</Text>
                            <Text style={[styles.desc, { fontSize: 14, color: TextDarkGrayColor }]}>{value.data}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={[styles.boxH, { justifyContent: 'flex-end', paddingBottom: 30 }]}>
                <TouchableOpacity style={[styles.boxH, { width: 'auto' }]} onPress={handleMoveToExplorer}>
                    <Text style={[styles.desc, { fontSize: 16, color: TextAddressColor }]}>More View</Text>
                    <Image style={styles.arrowIcon} source={ICON_LINK_ARROW} />
                </TouchableOpacity>
            </View>
            <View style={styles.dividerDashed} />
            <View style={[styles.boxV, { paddingVertical: 30 }]}>
                <View style={styles.boxV}>
                    <Text style={[styles.title, styles.titleV, { color: TextColor }]}>{Description.title}</Text>
                    <Text style={[styles.desc, { fontSize: 16 }]}>{Description.data}</Text>
                </View>
                {convertClassified(Classified)}
            </View>
            <View style={styles.dividerDashed} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: DividerColor
    },
    dividerDashed: {
        width: '100%',
        height: 0,
        borderWidth: 1,
        borderColor: DividerColor,
        borderStyle: 'dashed'
    },
    boxH: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    depositBox: {
        width: '100%',
        backgroundColor: BoxColor,
        borderRadius: 8,
        padding: 20,
        marginTop: 36
    },
    boxV: {
        alignItems: 'flex-start'
    },
    title: {
        fontFamily: Lato,
        fontWeight: '600',
        color: TextDarkGrayColor
    },
    desc: {
        fontFamily: Lato,
        fontWeight: 'normal',
        color: TextCatTitleColor
    },
    titleV: {
        fontSize: 18,
        paddingBottom: 11
    },
    arrowIcon: {
        width: 16,
        maxWidth: 16,
        height: 16,
        overflow: 'hidden',
        marginLeft: 2
    }
});

export default DescriptionSection;
