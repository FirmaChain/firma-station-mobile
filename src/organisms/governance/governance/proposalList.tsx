import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PROPOSAL_NOT_REGISTERED, PROPOSAL_STATUS, PROPOSAL_STATUS_DEPOSIT_PERIOD, STATUS_COLOR } from '@/constants/common';
import { BoxColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor, TextDisableColor, TextGrayColor } from '@/constants/theme';
import { convertNumber, convertTime } from '@/util/common';
import { IProposalItemState } from '@/hooks/governance/hooks';
import { fadeIn } from '@/util/animation';
import ProposalSkeleton from '@/components/skeleton/proposalSkeleton';

interface IProps {
    volumes: number;
    proposals: Array<IProposalItemState>;
    handleDetail: Function;
}

const ProposalList = ({ volumes, proposals, handleDetail }: IProps) => {
    const fadeAnimProposal = useRef(new Animated.Value(0)).current;

    const handleProposalDetail = (proposalId: number) => {
        handleDetail && handleDetail(proposalId);
    };

    const handlePeriodStatus = (proposal: any) => {
        let period = '';
        if (proposal.status === PROPOSAL_STATUS_DEPOSIT_PERIOD) {
            period = 'Deposit ends : ' + convertTime(proposal.depositEndTime, false);
        } else {
            period = 'Voting ends : ' + convertTime(proposal.votingEndTime, false);
        }

        return {
            period: period,
            dDay: getDDays(convertTime(proposal.depositEndTime, false))
        };
    };

    const getDDays = (date: string) => {
        const period = new Date(date);
        const today = new Date();

        const gap = period.getTime() - today.getTime();
        const result = Math.ceil(gap / (1000 * 60 * 60 * 24));

        if (result > 1) return result + ' days left';
        if (result === 1) return result + ' day left';
        return '';
    };

    useEffect(() => {
        if (proposals.length >= volumes) {
            fadeIn(Animated, fadeAnimProposal, 500);
        }
    }, [proposals]);

    return (
        <View style={styles.container}>
            {volumes > 0 ? (
                proposals.length > 0 ? (
                    proposals.map((proposal, index) => {
                        const periodState = handlePeriodStatus(proposal);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.item}
                                onPress={() => handleProposalDetail(convertNumber(proposal.proposalId))}
                            >
                                <Animated.View style={{ opacity: fadeAnimProposal }}>
                                    <View style={[styles.wrapperH, { paddingBottom: 10 }]}>
                                        <Text style={styles.id}># {proposal.proposalId}</Text>
                                        <Text
                                            style={[
                                                styles.status,
                                                {
                                                    backgroundColor: STATUS_COLOR[proposal.status] + '30',
                                                    color: STATUS_COLOR[proposal.status]
                                                }
                                            ]}
                                        >
                                            {PROPOSAL_STATUS[proposal.status]}
                                        </Text>
                                    </View>
                                    <View style={[styles.wrapperH, { paddingBottom: 10 }]}>
                                        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
                                            {proposal.title}
                                        </Text>
                                    </View>
                                    <View style={styles.wrapperH}>
                                        <Text style={[styles.period, { color: TextDisableColor }]}>{periodState.period}</Text>
                                        <Text style={[styles.period, { color: TextCatTitleColor, fontWeight: '600' }]}>
                                            {periodState.dDay}
                                        </Text>
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <ProposalSkeleton volumes={volumes} />
                )
            ) : (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.notice}>{PROPOSAL_NOT_REGISTERED}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 32,
        paddingBottom: 20,
        paddingHorizontal: 20
    },
    item: {
        height: 130,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 26,
        backgroundColor: BoxColor,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12
    },
    wrapperH: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapperV: {
        justifyContent: 'flex-start'
    },
    descWrapperH: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 5
    },
    id: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: '600',
        color: TextDarkGrayColor
    },
    status: {
        fontFamily: Lato,
        fontWeight: 'bold',
        fontSize: 11,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        color: TextGrayColor,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    title: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: 'bold',
        color: TextColor
    },
    period: {
        fontFamily: Lato,
        fontSize: 14
    },
    notice: {
        width: '100%',
        textAlign: 'center',
        fontFamily: Lato,
        fontSize: 18,
        color: TextDarkGrayColor,
        opacity: 0.8
    }
});

export default React.memo(ProposalList);
