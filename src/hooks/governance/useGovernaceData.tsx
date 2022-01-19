import { useEffect, useState } from "react";
import { GOVERNANCE_LIST, PROPOSAL_DETAIL } from "../../constants/dummy";
import { convertNumber } from "../../util/common";

const data:any = GOVERNANCE_LIST.data;
const proposal:any = PROPOSAL_DETAIL.data;

export interface GovernanceState {
    list: Array<any>;
}

export interface ProposalState {
    proposalId: number;
    title: string;
    description: string;
    status: string;
    proposalType: string;
    submitTime: string;
    votingStartTime: string;
    votingEndTime: string;
    classified: any;
    quorum: number;
    currentTurnout: number;
    stakingPool: Array<any>;
    proposalTally: Array<any>;
    proposalVote: Array<any>;
    minDeposit: number;
    proposalDeposit: Array<any>;
    depositPeriod: number;
}

export const useGovernanceList = () => {
    const [governanceState, setGovernanceList] = useState<GovernanceState>({
        list: [],
    });

    useEffect(() => {
        const list = data.proposals
        .map((proposal:any) => {
            return proposal;
        })
        setGovernanceList((prevState) => ({
            ...prevState,
            list,
        }));
    }, [])

    return {
        governanceState,
    }
}

export const useProposalData = (id:number) => {
    const [proposalState, setProposalState] = useState<ProposalState | null>(null);

    useEffect(() => {
        const classifiedData = (data:any) => {
            if(data.proposal[0].content.changes) {
                return {
                    changes : data.proposal[0].content.changes
                }
            }
    
            if(data.proposal[0].content.plan) {
                return {
                    height: data.proposal[0].content.plan.height,
                    version: data.proposal[0].content.plan.name,
                    info: data.proposal[0].content.info,
                }
            }
    
            if(data.proposal[0].content.recipient) {
                return {
                    recipient: data.proposal[0].content.recipient,
                    amount: data.proposal[0].content.amount[0].amount,
                }
            }
        }
    
        const calculateCurrentTurnout = (data:any) => {
            const totalVotingPower = convertNumber(data.stakingPool[0].totalVotingPower);
            const votes = data.proposalTallyResult[0];
    
            const totalVote = votes.yes + votes.no + votes.noWithVeto;
    
            return totalVote / totalVotingPower;
        }

        setProposalState({
            proposalId: proposal.proposal[0].proposalId,
            title: proposal.proposal[0].title,
            description: proposal.proposal[0].description,
            status: proposal.proposal[0].status,
            proposalType: proposal.proposal[0].content["@type"],
            submitTime: proposal.proposal[0].submitTime,
            classified: classifiedData(proposal),
            votingStartTime: proposal.proposal[0].votingStartTime,
            votingEndTime: proposal.proposal[0].votingEndTime,
            quorum: convertNumber(proposal.govParams[0].tallyParams.quorum),
            currentTurnout: calculateCurrentTurnout(proposal),
            stakingPool: proposal.stakingPool[0],
            proposalTally: proposal.proposalTallyResult[0],
            proposalVote: proposal.proposalVote,
            minDeposit: proposal.govParams[0].depositParams.min_deposit[0].amount,
            proposalDeposit: proposal.proposal[0].proposalDeposits[0].amount,
            depositPeriod: proposal.govParams[0].depositParams.max_deposit_period
        })
    }, [id])

    return {
        proposalState,
    }
}