import { useCallback, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { ERROR_FETCHING_PROPOSAL_DATA, PROPOSAL_MESSAGE_TYPE } from '@/constants/common';
import { getProposalData } from '@/gql/query';
import { StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { convertNumber, convertTime } from '@/util/common';
import { getProposalByProposalId, getProposalParams, getProposals, getProposalTally } from '@/util/firma';
import { useNavigation } from '@react-navigation/native';
import { orderBy } from 'es-toolkit';
import Toast from 'react-native-toast-message';

import type { RefreshLifecycle } from '@/hooks/common/useRefreshPolling';

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
    isTextProposal: boolean;
    // FIXME: Governance messages are supplied by chain modules with multiple payload schemas.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: Array<any>;
    // FIXME: Classified governance content depends on the external message schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // FIXME: Voter records are supplied by an external governance API without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    voters: Array<any>;
}

interface IProposalJSONProps {
    ignoreProposalAddressList: string[];
    ignoreProposalIdList: number[];
    timestamp: string;
}

export const useGovernanceList = () => {
    const { network, contentVolume } = useAppSelector((state) => state.storage);
    const [governanceState, setGovernanceList] = useState<IGovernanceState>({
        list: []
    });

    const getProposalJsonData = useCallback(async () => {
        try {
            const response = await fetch(`${CHAIN_NETWORK[network].PROPOSAL_JSON}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                    Pragma: 'no-store',
                    Expires: '0'
                }
            });
            const data: IProposalJSONProps = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [network]);

    const handleProposalList = useCallback(async (lifecycle?: RefreshLifecycle) => {
        const proposalsJSON = (await getProposalJsonData()).ignoreProposalIdList;
        if (lifecycle?.isValid() === false) return;
        const proposals = await getProposals();
        if (lifecycle?.isValid() === false) return;

        if (proposals.length > 0) {
            const list = proposals
                .filter((proposal) => proposalsJSON.includes(Number(proposal.id)) === false)
                .map((proposal) => {
                    // FIXME: The SDK proposal model exposes version-dependent fields outside its public type.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const _proposal = proposal as any;
                    const { id, messages, status, title, summary } = proposal;

                    // FIXME: Governance message variants are defined by external chain modules.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const firstMsg = messages[0] as any;
                    const firmsMsgContent = firstMsg?.content || null;
                    // If Messages is empty, can be considered as Text Proposal
                    const isEmptyMsg = Array.isArray(messages) ? messages.length === 0 : Boolean(messages);

                    const proposalId = id.toString();
                    const proposalType = isEmptyMsg
                        ? PROPOSAL_MESSAGE_TYPE['/cosmos.gov.v1beta1.TextProposal']
                        : PROPOSAL_MESSAGE_TYPE[(firmsMsgContent ? firmsMsgContent['@type'] : firstMsg['@type'] || '').replace('Msg', '')];

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
                        votingEndTime
                    };
                });

            StorageActions.handleContentVolume({
                ...contentVolume,
                proposals: list.length
            });

            const sortList = list.sort((a, b) => Number(b.proposalId) - Number(a.proposalId));
            if (lifecycle?.isValid() === false) return;
            setGovernanceList((prevState) => ({
                ...prevState,
                list: sortList
            }));
        }
    }, [getProposalJsonData, contentVolume]);

    const handleGovernanceListPolling = async (lifecycle?: RefreshLifecycle) => {
        await handleProposalList(lifecycle);
    };

    return {
        governanceState,
        handleGovernanceListPolling
    };
};

export const useProposalData = () => {
    const navigation = useNavigation();
    const { network } = useAppSelector((state) => state.storage);

    const [proposalState, setProposalState] = useState<IProposalState | null>(null);

    const handleProposal = useCallback(
        async (id: number, lifecycle?: RefreshLifecycle) => {
            try {
                const _id = String(id);
                const [proposal, param, proposalTally] = await Promise.all([
                    getProposalByProposalId(_id),
                    getProposalParams(),
                    getProposalTally(_id)
                ]);
                if (lifecycle?.isValid() === false) return;

                let bondedTokens = null;
                // FIXME: Vote history is supplied by an external GraphQL API without a stable schema.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let votingList: Array<any> = [];
                try {
                    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
                    if (lifecycle?.isValid() === false) return;
                    const proposalData = await getProposalData({ proposalId: _id, network });
                    if (lifecycle?.isValid() === false) return;
                    if (proposalData.proposal[0] !== undefined) {
                        if (proposalData.proposal[0].staking_pool_snapshot) {
                            const _bondedTokens = proposalData.proposal[0].staking_pool_snapshot.bonded_tokens;
                            bondedTokens = _bondedTokens;
                        }

                        if (proposalData.proposalVote !== undefined) {
                            const _votingList = proposalData.proposalVote;

                            const ordered = orderBy(_votingList, ['height'], ['asc']);
                            const latestVotesByVoter = ordered.reduce<Record<string, (typeof ordered)[number]>>((acc, vote) => {
                                acc[vote.voterAddress] = vote;
                                return acc;
                            }, {});

                            votingList = Object.values(latestVotesByVoter);
                        }
                    }
                } catch (error) {
                    if (lifecycle?.isValid() === false) return;
                    console.error(error);
                }
                if (lifecycle?.isValid() === false) return;

                // FIXME: The SDK proposal model exposes version-dependent fields outside its public type.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const _proposal = proposal as any;
                // FIXME: Governance message variants are defined by external chain modules.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const firstMsg = proposal.messages[0] as any;
                const firmsMsgContent = firstMsg?.content ?? firstMsg ?? {};
                const isEmptyMsg = Array.isArray(proposal.messages) ? proposal.messages.length === 0 : Boolean(proposal.messages);

                const proposalId = proposal.id.toString();
                const title = proposal.title;
                const status = proposal.status.toString();
                // If Messages is empty, can be considered as Text Proposal
                const proposalType = isEmptyMsg
                    ? PROPOSAL_MESSAGE_TYPE['/cosmos.gov.v1beta1.TextProposal']
                    : PROPOSAL_MESSAGE_TYPE[firmsMsgContent['@type']?.replace('Msg', '')];
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
                const normalizedBondedTokens = bondedTokens === undefined || bondedTokens === null ? null : Number(bondedTokens);
                const currentTurnout = calculateCurrentTurnout(normalizedBondedTokens, tallyResult);

                const titleState: IProposalTitleState = {
                    proposalId,
                    title,
                    status
                };

                const descState: IProposalDescriptionState = {
                    status,
                    proposalType: proposalType,
                    submitTime: submitTime,
                    description: description,
                    isTextProposal: proposalType?.includes(PROPOSAL_MESSAGE_TYPE['/cosmos.gov.v1beta1.TextProposal']),
                    messages: Array.isArray(proposal.messages) ? proposal.messages : [],
                    classified: classified,
                    votingStartTime: votingStartTime,
                    votingEndTime: votingEndTime,
                    depositPeriod: depositPeriod,
                    minDeposit: minDeposit,
                    proposalDeposit: proposalDeposit
                };

                const voteState: IProposalVoteState = {
                    votingStartTime: votingStartTime,
                    votingEndTime: votingEndTime,
                    quorum: convertNumber(quorum),
                    currentTurnout: currentTurnout,
                    totalVotingPower: normalizedBondedTokens,
                    proposalTally: tallyResult,
                    voters: votingList
                };

                if (lifecycle?.isValid() === false) return;
                setProposalState({
                    titleState,
                    descState,
                    voteState
                });
            } catch (e) {
                if (lifecycle?.isValid() === false) throw e;
                console.error(e);
                // Fix: if failed to fetch proposal data, show error toast and return to previous screen (governance)
                Toast.show({
                    type: 'error',
                    text1: ERROR_FETCHING_PROPOSAL_DATA
                });
                navigation.goBack();
                throw e;
            }
        },
        [network]
    );

    const convertDepositPeriod = (period: string, submitTime: string) => {
        const periodToDay = convertNumber(period.split('s')[0]);
        const date = new Date(submitTime);
        date.setSeconds(date.getSeconds() + periodToDay);

        return convertTime(date, true);
    };

    // FIXME: Classified governance content depends on external message schemas.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const classifiedData = (content: any) => {
        if (content.changes !== undefined) {
            return {
                changes: content.changes
            };
        }

        if (content.plan !== undefined) {
            return {
                height: content.plan.height,
                version: content.plan.name,
                info: content.info
            };
        }

        if (content.recipient !== undefined) {
            return {
                recipient: content.recipient,
                amount: content.amount[0].amount
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

    const handleProposalPolling = async (id: number, lifecycle?: RefreshLifecycle) => {
        await handleProposal(id, lifecycle);
    };

    return {
        proposalState,
        handleProposalPolling
    };
};
