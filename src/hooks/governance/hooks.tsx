import { useGovernmentQuery, useProposalQuery } from "@/apollo/gqls";
import { useState } from "react";
import { convertNumber } from "../../util/common";

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

    useGovernmentQuery({
        onCompleted: (data) =>{
            const list = data.proposals
            .map((proposal:any) => {
                return proposal;
            })
            setGovernanceList((prevState) => ({
                ...prevState,
                list,
            }));
        }
    })
    
    return {
        governanceState,
    }
}

export const useProposalData = (id:number) => {
    const [proposalState, setProposalState] = useState<ProposalState | null>(null);

    useProposalQuery({
        proposalId: id.toString(),
        onCompleted: (data) => {
            const classifiedData = () => {
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
        
            const calculateCurrentTurnout = () => {
                const totalVotingPower = convertNumber(data.stakingPool[0].totalVotingPower);
                const votes = data.proposalTallyResult[0];
                
                if(votes === undefined) return 0;

                const totalVote = votes.yes + votes.no + votes.noWithVeto;
        
                return totalVote / totalVotingPower;
            }
        
            setProposalState({
                proposalId: data.proposal[0].proposalId,
                title: data.proposal[0].title,
                description: data.proposal[0].description,
                status: data.proposal[0].status,
                proposalType: data.proposal[0].content["@type"],
                submitTime: data.proposal[0].submitTime,
                classified: classifiedData(),
                votingStartTime: data.proposal[0].votingStartTime,
                votingEndTime: data.proposal[0].votingEndTime,
                quorum: convertNumber(data.govParams[0].tallyParams.quorum),
                currentTurnout: calculateCurrentTurnout(),
                stakingPool: data.stakingPool[0],
                proposalTally: data.proposalTallyResult[0],
                proposalVote: data.proposalVote,
                minDeposit: data.govParams[0].depositParams.min_deposit[0].amount,
                proposalDeposit: data.proposal[0].proposalDeposits[0].amount,
                depositPeriod: data.govParams[0].depositParams.max_deposit_period
            })
        }
    })

    return {
        proposalState,
    }
}