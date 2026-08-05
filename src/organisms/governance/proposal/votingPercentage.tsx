import React, { useCallback, useMemo } from 'react';
import {
    AbstainColor,
    BgColor,
    BorderColor,
    DarkGrayColor,
    Lato,
    NoColor,
    NoWithVetoColor,
    TextCatTitleColor,
    TextColor,
    WhiteColor,
    YesColor
} from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { convertAmount, convertNumber, makeDecimalPoint } from '@/util/common';
import { ScreenWidth } from '@/util/getScreenSize';
import { FirmaUtil } from '@firmachain/firma-js';
import { StyleSheet, Text, View } from 'react-native';

import { IProposalTallyState } from '@/hooks/governance/hooks';
import { UpArrow, VoteCircle } from '@/components/icon/icon';

interface IProps {
    // FIXME: Governance vote data is supplied by chain modules with multiple schemas.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

const VotingPercentage = ({ data }: IProps) => {
    const { address: walletAddress } = useAppSelector((state) => state.wallet);

    const tally = useMemo(() => {
        const tallyResult: IProposalTallyState = data.proposalTally;
        if (tallyResult !== undefined)
            return [
                { title: 'YES', vote: convertNumber(tallyResult.yes), option: 'VOTE_OPTION_YES' },
                { title: 'NO', vote: convertNumber(tallyResult.no), option: 'VOTE_OPTION_NO' },
                {
                    title: 'NoWithVeto',
                    vote: convertNumber(tallyResult.no_with_veto),
                    option: 'VOTE_OPTION_NO_WITH_VETO'
                },
                {
                    title: 'Abstain',
                    vote: convertNumber(tallyResult.abstain),
                    option: 'VOTE_OPTION_ABSTAIN'
                }
            ];

        return [
            { title: 'YES', vote: 0, option: 'VOTE_OPTION_YES' },
            { title: 'NO', vote: 0, option: 'VOTE_OPTION_NO' },
            { title: 'NoWithVeto', vote: 0, option: 'VOTE_OPTION_NO_WITH_VETO' },
            { title: 'Abstain', vote: 0, option: 'VOTE_OPTION_ABSTAIN' }
        ];
    }, [data]);

    const myVote = useMemo(() => {
        const result = tally.map((value) => {
            const vote = data.voters
                // FIXME: Governance voter records are supplied by an external API without a stable schema.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((voter: any) => voter.option === value.option)
                // FIXME: Governance voter records are supplied by an external API without a stable schema.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .find((voter: any) => voter.voterAddress === walletAddress);
            if (vote !== undefined) {
                return true;
            } else {
                return false;
            }
        });
        return result;
    }, [tally]);

    const totalVote = () => {
        let total: number = 0;
        tally.filter((type) => type.title !== 'Abstain').map((item) => (total += convertNumber(item.vote)));

        return total;
    };

    const votingColor = (vote: string) => {
        switch (vote) {
            case 'YES':
                return YesColor;
            case 'NO':
                return NoColor;
            case 'NoWithVeto':
                return NoWithVetoColor;
            case 'Abstain':
                return AbstainColor;
        }
    };

    //! Refactor: remove decimal point, graph ratio was not correct
    const calculateRatio = (value: number, max: number | string) => {
        const voteValue = convertNumber(FirmaUtil.getFCTStringFromUFCT(value));
        const totalValue = convertNumber(FirmaUtil.getFCTStringFromUFCT(convertNumber(max)));

        if (voteValue <= 0 || totalValue <= 0 || totalValue === undefined) return 0;

        return voteValue / totalValue;
    };

    const RenderTally = useCallback(() => {
        return (
            <View style={styles.background}>
                {tally.map((item, index) => {
                    if (item.title !== 'Abstain') {
                        const ratio = calculateRatio(item.vote, data.totalVotingPower);

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.percentage,
                                    {
                                        backgroundColor: votingColor(item.title),
                                        display: ratio > 0 ? 'flex' : 'none',
                                        flex: ratio,
                                        marginLeft: -10,
                                        paddingLeft: 10,
                                        zIndex: 5 - index
                                    }
                                ]}
                            />
                        );
                    }
                })}
            </View>
        );
    }, [tally]);

    const quorumPosition: `${number}%` = `${convertNumber(data.quorum)}%`;

    return (
        <View style={styles.wrapper}>
            <RenderTally />
            <View style={styles.quorumWrapper}>
                <View style={[styles.quorumLine, { left: quorumPosition }]} />
                <View style={[styles.quorum, { left: quorumPosition, marginLeft: -9 }]}>
                    <UpArrow size={20} color={WhiteColor} />
                </View>
            </View>
            <View style={styles.box}>
                {tally.map((item, index) => {
                    const odd = (index + 1) % 2;
                    return (
                        <View
                            key={index}
                            style={[
                                styles.voteBox,
                                {
                                    marginRight: ScreenWidth() > 153 * 4 ? 11 : odd === 1 ? 11 : 0,
                                    marginBottom: 20
                                }
                            ]}
                        >
                            <View style={[styles.boxH, { paddingBottom: 8 }]}>
                                <View style={[styles.voteDot, { backgroundColor: votingColor(item.title) }]} />
                                <Text style={[styles.vote, { color: votingColor(item.title) }]}>{item.title}</Text>
                            </View>
                            <View style={styles.dataBox}>
                                {item.title !== 'Abstain' && (
                                    <Text style={styles.percent}>
                                        {makeDecimalPoint(calculateRatio(item.vote, totalVote()) * 100) + ' %'}
                                    </Text>
                                )}
                                <Text style={[styles.amount, { textAlign: 'right' }]}>{convertAmount({ value: item.vote })}</Text>
                            </View>
                            <View style={[styles.stampWrapper, { display: myVote[index] ? 'flex' : 'none' }]}>
                                <VoteCircle size={32} color={BgColor} />
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingTop: 25
    },
    background: {
        flex: 100,
        height: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: BorderColor,
        borderRadius: 8,
        position: 'relative',
        overflow: 'hidden'
    },
    percentage: {
        height: 12,
        borderRadius: 8
    },
    quorumWrapper: {
        flex: 100,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 47
    },
    quorum: {
        position: 'absolute',
        alignItems: 'flex-end'
    },
    quorumLine: {
        position: 'absolute',
        top: -18,
        height: 25,
        width: 0,
        // backgroundColor: WhiteColor,
        borderColor: WhiteColor,
        borderWidth: 1,
        borderStyle: 'dashed'
    },
    box: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxH: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    voteBox: {
        flex: 1,
        minWidth: 122,
        maxWidth: 142,
        paddingVertical: 27,
        borderRadius: 8,
        backgroundColor: BgColor,
        alignItems: 'center'
    },
    vote: {
        width: 'auto',
        fontFamily: Lato,
        fontWeight: '600',
        fontSize: 16
    },
    voteDot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        marginRight: 4,
        overflow: 'hidden'
    },
    dataBox: {
        height: 43,
        justifyContent: 'center',
        alignItems: 'center'
    },
    percent: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: 'bold',
        color: TextColor,
        paddingBottom: 6
    },
    amount: {
        fontFamily: Lato,
        fontSize: 12,
        color: TextCatTitleColor
    },
    stampWrapper: {
        position: 'absolute',
        marginTop: -14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DarkGrayColor,
        borderRadius: 20
    }
});

export default VotingPercentage;
