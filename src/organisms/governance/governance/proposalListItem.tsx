import React, { useCallback } from 'react';
import { PROPOSAL_STATUS, PROPOSAL_STATUS_DEPOSIT_PERIOD, STATUS_COLOR } from '@/constants/common';
import { BoxColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor, TextDisableColor, TextGrayColor } from '@/constants/theme';
import { convertNumber, convertTime } from '@/util/common';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IProposalItemState } from '@/hooks/governance/hooks';

interface IProps {
    proposal: IProposalItemState;
    handleDetail: (proposalId: number) => void;
}

const ProposalListItem = ({ proposal, handleDetail }: IProps) => {
    const handleProposalDetail = useCallback(() => {
        handleDetail(convertNumber(proposal.proposalId));
    }, [handleDetail, proposal.proposalId]);

    const handlePeriodStatus = useCallback(() => {
        let period = '';
        if (proposal.status === PROPOSAL_STATUS_DEPOSIT_PERIOD) {
            period = 'Deposit ends : ' + convertTime(proposal.depositEndTime, false);
        } else {
            period = 'Voting ends : ' + convertTime(proposal.votingEndTime, false);
        }

        return {
            period,
            dDay: getDDays(convertTime(proposal.depositEndTime, false))
        };
    }, [proposal]);

    const periodState = handlePeriodStatus();

    return (
        <TouchableOpacity style={styles.item} onPress={handleProposalDetail}>
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
                <Text style={[styles.period, { color: TextCatTitleColor, fontWeight: '600' }]}>{periodState.dDay}</Text>
            </View>
        </TouchableOpacity>
    );
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

const styles = StyleSheet.create({
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
    }
});

export default React.memo(ProposalListItem);
