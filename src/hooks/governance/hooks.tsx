import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { getProposalData } from '@/apollo/gqls';
import { convertNumber, convertTime } from '@/util/common';
import { StorageActions } from '@/redux/actions';
import { getProposalByProposalId, getProposalParams, getProposals, getProposalTally } from '@/util/firma';
import { ERROR_FETCHING_PROPOSAL_DATA, PROPOSAL_MESSAGE_TYPE } from '@/constants/common';
import { rootState } from '@/redux/reducers';
import { CHAIN_NETWORK } from '@/../config';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import _ from 'lodash';

export interface IGovernanceState {
    list: Array<IProposalItemState>;
}

export interface IProposalItemState {
    title: string;
    proposalId: string;
    status: string;
    description: string;
    proposalType: string;
    depositEndTime: string;
    votingStartTime: string;
    votingEndTime: string;
}

export interface IProposalState {
    titleState: IProposalTitleState;
    descState: IProposalDescriptionState;
    voteState: IProposalVoteState;
}

export interface IProposalTitleState {
    proposalId: string;
    title: string;
    status: string;
}

export interface IProposalDescriptionState {
    status: string;
    proposalType: string;
    submitTime: string;
    description: string;
    classified: any;
    votingStartTime: string;
    votingEndTime: string;
    depositPeriod: string;
    minDeposit: string;
    proposalDeposit: string;
}

export interface IProposalTallyState {
    yes: string;
    abstain: string;
    no: string;
    no_with_veto: string;
}

export interface IProposalVoteState {
    votingStartTime: string;
    votingEndTime: string;
    quorum: number;
    currentTurnout: number | null;
    totalVotingPower: number | null;
    proposalTally: IProposalTallyState;
    voters: Array<any>;
}

interface IProposalJSONProps {
    ignoreProposalAddressList: string[];
    ignoreProposalIdList: number[];
    timestamp: string;
}

export const useGovernanceList = () => {
    const { storage } = useAppSelector((state: rootState) => state);
    const [governanceState, setGovernanceList] = useState<IGovernanceState>({
        list: [],
    });

    const getProposalJsonData = useCallback(async () => {
        try {
            const response = await fetch(`${CHAIN_NETWORK[storage.network].PROPOSAL_JSON}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                    Pragma: 'no-store',
                    Expires: '0',
                },
            });
            const data: IProposalJSONProps = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, []);

    const handleProposalList = useCallback(async () => {
        try {
            const proposalsJSON = (await getProposalJsonData()).ignoreProposalIdList;
            const proposals = await getProposals();

            if (proposals.length > 0) {
                const list = proposals
                    .filter(proposal => proposalsJSON.includes(Number(proposal.id)) === false)
                    .map(proposal => {
                        const _proposal = proposal as any;
                        const { id, messages, status, title, summary } = proposal;

                        const firstMsg = messages[0] as any;
                        const firmsMsgContent = firstMsg?.content || null;

                        const proposalId = id.toString();
                        const proposalType =
                            PROPOSAL_MESSAGE_TYPE[
                            (firmsMsgContent ? firmsMsgContent['@type'] : firstMsg['@type'] || '').replace('Msg', '')
                            ];

                        const depositEndTime = _proposal.deposit_end_time;
                        const votingStartTime = _proposal.voting_start_time;
                        const votingEndTime = _proposal.voting_end_time;

                        return {
                            proposalId,
                            proposalType,
                            status: status.toString(),
                            title,
                            description: summary,
                            depositEndTime,
                            votingStartTime,
                            votingEndTime,
                        };
                    });

                StorageActions.handleContentVolume({
                    ...storage.contentVolume,
                    proposals: list.length,
                });

                const sortList = list.sort((a, b) => Number(b.proposalId) - Number(a.proposalId));
                setGovernanceList(prevState => ({
                    ...prevState,
                    list: sortList,
                }));
            }
        } catch (error) {
            throw error;
        }
    }, []);

    const handleGovernanceListPolling = async () => {
        await handleProposalList();
    };

    useEffect(() => {
        handleGovernanceListPolling();
    }, [storage.network]);

    return {
        governanceState,
        handleGovernanceListPolling,
    };
};

export const useProposalData = () => {
    const navigation = useNavigation();

    const [proposalState, setProposalState] = useState<IProposalState | null>(null);

    const handleProposal = useCallback(async (id: number) => {
        try {
            const _id = String(id);
            const [proposal, param, proposalTally] = await Promise.all([
                getProposalByProposalId(_id),
                getProposalParams(),
                getProposalTally(_id),
            ]);

            let bondedTokens: number | null = null;
            let votingList: Array<any> = [];
            try {
                const proposalData = await getProposalData({ proposalId: _id });
                if (proposalData.data.proposal[0] !== undefined) {
                    if (proposalData.data.proposal[0].staking_pool_snapshot) {
                        const _bondedTokens = proposalData.data.proposal[0].staking_pool_snapshot.bonded_tokens;
                        bondedTokens = _bondedTokens;
                    }

                    if (proposalData.data.proposalVote !== undefined) {
                        const _votingList = proposalData.data.proposalVote;

                        const latestVotesByVoter = _
                            .chain(_votingList)
                            .groupBy('voter_address')
                            .values()
                            .map((votes) => votes[votes.length - 1])
                            .value();

                        votingList = latestVotesByVoter;
                    }
                }
            } catch (error) {
                console.log(error);
            }

            const _proposal = proposal as any;
            const firstMsg = proposal.messages[0] as any;
            const firmsMsgContent = firstMsg?.content || null;

            const proposalId = proposal.id.toString();
            const title = proposal.title;
            const status = proposal.status.toString();
            const proposalType =
                PROPOSAL_MESSAGE_TYPE[(firmsMsgContent ? firmsMsgContent['@type'] : firstMsg['@type'] || '').replace('Msg', '')];
            const submitTime = _proposal.submit_time;
            const description = proposal.summary;
            const classified = classifiedData(proposal.messages);
            const votingStartTime = _proposal.voting_start_time;
            const votingEndTime = _proposal.voting_end_time;
            const quorum = param.quorum;
            const maxDepositPeriod = param.max_deposit_period;
            const depositPeriod = convertDepositPeriod(maxDepositPeriod, submitTime);
            const minDeposit = param.min_deposit[0].amount;
            const proposalDeposit = _proposal.total_deposit[0].amount;
            const tallyResult = proposalTally;
            const currentTurnout = calculateCurrentTurnout(bondedTokens, tallyResult);

            const titleState: IProposalTitleState = {
                proposalId,
                title,
                status,
            };

            const descState: IProposalDescriptionState = {
                status,
                proposalType: proposalType,
                submitTime: submitTime,
                description: description,
                classified: classified,
                votingStartTime: votingStartTime,
                votingEndTime: votingEndTime,
                depositPeriod: depositPeriod,
                minDeposit: minDeposit,
                proposalDeposit: proposalDeposit,
            };

            const voteState: IProposalVoteState = {
                votingStartTime: votingStartTime,
                votingEndTime: votingEndTime,
                quorum: convertNumber(quorum),
                currentTurnout: currentTurnout,
                totalVotingPower: bondedTokens,
                proposalTally: tallyResult,
                voters: votingList,
            };

            setProposalState({
                titleState,
                descState,
                voteState,
            });
        } catch (e) {
            // Fix: if failed to fetch proposal data, show error toast and return to previous screen (governance)
            Toast.show({
                type: 'error',
                text1: ERROR_FETCHING_PROPOSAL_DATA,
            });
            navigation.goBack();
        }
    }, []);

    const convertDepositPeriod = (period: string, submitTime: string) => {
        const periodToDay = convertNumber(period.split('s')[0]);
        const date = new Date(submitTime);
        date.setSeconds(date.getSeconds() + periodToDay);

        return convertTime(date.toString(), true);
    };

    const classifiedData = (content: any) => {
        if (content.changes !== undefined) {
            return {
                changes: content.changes,
            };
        }

        if (content.plan !== undefined) {
            return {
                height: content.plan.height,
                version: content.plan.name,
                info: content.info,
            };
        }

        if (content.recipient !== undefined) {
            return {
                recipient: content.recipient,
                amount: content.amount[0].amount,
            };
        }
    };

    const calculateCurrentTurnout = (bondedTokens: number | null, tallyResult: IProposalTallyState) => {
        if (bondedTokens === null) return null;
        const totalVotingPower = convertNumber(bondedTokens);
        const votes = tallyResult;

        if (votes === undefined) return 0;
        const totalVote = convertNumber(votes.yes) + convertNumber(votes.no) + convertNumber(votes.no_with_veto);

        return totalVote / totalVotingPower;
    };

    const handleProposalPolling = async (id: number) => {
        try {
            await handleProposal(id);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        proposalState,
        handleProposalPolling,
    };
};
