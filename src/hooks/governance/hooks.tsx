import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useGovernmentQuery, useProposalQuery } from "@/apollo/gqls";
import { convertNumber, convertTime } from "@/util/common";

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
    proposalId: number;
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
    minDeposit: number;
    proposalDeposit: Array<any>;
}

export interface IProposalVoteState {
    votingStartTime: string;
    votingEndTime: string;
    quorum: number;
    currentTurnout: number;
    stakingPool: Array<any>;
    totalVotingPower: number;
    proposalTally: Array<any>;
    voters: Array<any>;
}

export const useGovernanceList = () => {
    const {common, storage} = useAppSelector(state => state);
    const [governanceState, setGovernanceList] = useState<IGovernanceState>({
        list: [],
    });

    const { refetch, loading, data } = useGovernmentQuery();

    useEffect(() => {
        if(loading === false){
            if(data){
                const list = data.proposals
                .map((proposal:any) => {
                    return proposal;
                })
                setGovernanceList((prevState) => ({
                    ...prevState,
                    list,
                }));
            }
        }
    }, [loading, data]);

    const handleGovernanceListPolling = async() => {
        return await refetch();
    }

    useEffect(() => {
        if(common.lockStation === false){
            handleGovernanceListPolling();
        }
    }, [storage.network, common.lockStation])
    

    return {
        governanceState,
        handleGovernanceListPolling,
    }
}

export const useProposalData = (id:number) => {
    const [proposalState, setProposalState] = useState<IProposalState | null>(null);

    const {refetch, loading, data } = useProposalQuery({proposalId: id.toString()})

    useEffect(() => {
        if(loading === false) {
            if(data){
                if(data.proposal.length > 0){
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

                        const totalVotingPower = convertNumber(data.proposal[0].staking_pool_snapshot?data.proposal[0].staking_pool_snapshot.bonded_tokens:0);
                        const votes = data.proposalTallyResult[0];
                        
                        if(votes === undefined) return 0;
        
                        const totalVote = convertNumber(votes.yes) + convertNumber(votes.no) + convertNumber(votes.noWithVeto);
                
                        return totalVote / totalVotingPower;
                    }
        
                    const convertDepositPeriod = (period:number, submitTime:string) => {
                        const periodToDay = period / 1000000000;
                        const date = new Date(submitTime);
                        date.setSeconds(date.getSeconds() + periodToDay);
                        
                        return convertTime(date.toString(), true);;
                    }
        
                    const titleState:IProposalTitleState = ({
                        proposalId: data.proposal[0].proposalId,
                        title: data.proposal[0].title,
                        status: data.proposal[0].status,
                    })
        
                    const descState:IProposalDescriptionState = ({
                        status: data.proposal[0].status,
                        proposalType: data.proposal[0].content["@type"],
                        submitTime: data.proposal[0].submitTime,
                        description: data.proposal[0].description,
                        classified: classifiedData(),
                        votingStartTime: data.proposal[0].votingStartTime,
                        votingEndTime: data.proposal[0].votingEndTime,
                        depositPeriod: convertDepositPeriod(data.govParams[0].depositParams.max_deposit_period, data.proposal[0].submitTime,),
                        minDeposit: data.govParams[0].depositParams.min_deposit[0].amount,
                        proposalDeposit: data.proposal[0].proposalDeposits[0].amount,
                    })
        
                    const voteState:IProposalVoteState = ({
                        votingStartTime: data.proposal[0].votingStartTime,
                        votingEndTime: data.proposal[0].votingEndTime,
                        quorum: convertNumber(data.govParams[0].tallyParams.quorum),
                        currentTurnout: calculateCurrentTurnout(),
                        stakingPool: data.stakingPool[0],
                        totalVotingPower: convertNumber(data.proposal[0].staking_pool_snapshot?data.proposal[0].staking_pool_snapshot.bonded_tokens:0),
                        proposalTally: data.proposalTallyResult[0],
                        voters: data.proposalVote,
                    })
                
                    setProposalState({
                        titleState,
                        descState,
                        voteState,
                    })
                }
            }
        }
    }, [loading, data])
    

    const handleProposalPolling = async() => {
        return await refetch();
    }

    return {
        proposalState,
        handleProposalPolling,
    }
}