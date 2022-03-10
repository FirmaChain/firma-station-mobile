import { useValidatorFromAddressQuery, useValidatorsDescriptionQuery, useValidatorsQuery } from "@/apollo/gqls";
import { getBalanceFromAdr, getDelegations, getRedelegations, getStaking, getUndelegations } from "@/util/firma";
import { useEffect, useMemo, useState } from "react";
import { convertNumber, convertPercentage, convertToFctNumber, makeDecimalPoint } from "@/util/common";
import { BLOCKS_PER_YEAR } from "@/constants/common";
import { useAppSelector } from "@/redux/hooks";
import { StakingActions } from "@/redux/actions";

export interface ValidatorState {
    description: ValidatorDescription;
    address: ValidatorAddress;
    percentageData: ValidatorData;
}

export interface ValidatorDescription {
    avatar: string;
    moniker: string;
    description: string;
    website: string;
}

export interface ValidatorAddress {
    operatorAddress: string;
    accountAddress: string;
}

export interface ValidatorData {
    APR: string;
    APY: string;
    state: Array<any>;
}

export interface StakeInfo {
    validatorAddress: string;
    delegatorAddress: string;
    moniker: string;
    avatarURL: string;
    amount: number;
    reward: number;
}

export interface RedelegationInfo {
    srcAddress: string;
    srcMoniker: string;
    srcAvatarURL: string;
    dstAddress: string;
    dstMoniker: string;
    dstAvatarURL: string;
    balance: number;
    completionTime: string;
}

export interface UndelegationInfo {
    validatorAddress: string;
    moniker: string;
    avatarURL: string;
    balance: number;
    completionTime: string;
}

export interface StakingState {
    available: number;
    delegated: number;
    undelegate: number;
    stakingReward: number;
}

export const useDelegationData = () => {
    const {wallet, staking} = useAppSelector(state => state);
    const [delegationList, setDelegationList] = useState<Array<StakeInfo>>([]);
    const [redelegationList, setRedelegationList] = useState<Array<RedelegationInfo>>([]);
    const [undelegationList, setUndelegationList] = useState<Array<UndelegationInfo>>([]);
    const [validatorsDescList, setValidatorsDescList] = useState<Array<any>>([]);

    const {refetch, loading, data} = useValidatorsDescriptionQuery();

    useEffect(() => {
        if(loading === false) {
            setValidatorsDescList(data.validator);
        }
    }, [loading, data])

    const handleTotalDelegationPolling = async() => {
        await refetch();
        await handleDelegationState();
        await handleRedelegationState();
        await handleUndelegationState();
    }

    const handleDelegationState = async() => {
        const result:Array<StakeInfo> = await getDelegations(wallet.address);
        setDelegationList(result);
    }

    const handleRedelegationState = async() => {
        const redelegationResult:Array<RedelegationInfo> = await getRedelegations(wallet.address);
        setRedelegationList(redelegationResult);
    }

    const handleUndelegationState = async() => {
        const undelegateionResult:Array<UndelegationInfo> = await getUndelegations(wallet.address);
        setUndelegationList(undelegateionResult);
    }

    useEffect(() => {
        if(staking.delegate){
            setDelegationList(delegationList.map((vd:any) => vd.validatorAddress === staking.delegate.address?
                {...vd, reward: staking.delegate.reward} : vd));
        }
    }, [staking.delegate])

    const delegationState:Array<StakeInfo> = useMemo(() => {
        return useValidatorDescription(delegationList, validatorsDescList);
    }, [delegationList, validatorsDescList]);

    const redelegationState:Array<RedelegationInfo> = useMemo(() => {
        return useValidatorDescriptionForRedelegation(redelegationList, validatorsDescList);
    }, [redelegationList, validatorsDescList]);

    const undelegationState:Array<UndelegationInfo> = useMemo(() => {
        return useValidatorDescription(undelegationList, validatorsDescList);
    }, [undelegationList, validatorsDescList]);

    const refetchValidatorDescList = async() => {
        return await refetch();
    }

    return {
        delegationState,
        redelegationState,
        undelegationState,
        handleDelegationState,
        handleRedelegationState,
        handleUndelegationState,
        handleTotalDelegationPolling,
        refetchValidatorDescList,
    }

}

export const useStakingData = () => {
    const {wallet} = useAppSelector(state => state);
    const [stakingState, setStakingState] = useState<StakingState>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    const getStakingState = async() => {
        await getStaking(wallet.address).then((res:StakingState) => {
            if(res) {
                setStakingState(res);
                StakingActions.updateStakingRewardState(res.stakingReward);
            }
        })
    }

    const updateStakingState = async(stakingReward: number) => {
        const balance = await getBalanceFromAdr(wallet.address);
        setStakingState((prevState) => ({
            ...prevState,
            available: convertNumber(balance),
            stakingReward,
        }))
    }

    useEffect(() => {
        if(wallet.address === '' || wallet.address === undefined) return;
        getStakingState();
    }, []);

    return { 
        stakingState,
        getStakingState,
        updateStakingState,
    }
}

export const useValidatorDescription = (delegations:Array<any>, validators:Array<any>) => {
    const result = delegations.map((value) => {
        const desc = validators.find(val => val.validatorInfo.operatorAddress === value.validatorAddress);
        
        const validatorDescription = organizeValidatorDescription(desc);
        return {
            ...value,
            moniker: validatorDescription.validatorMoniker,
            avatarURL: validatorDescription.validatorAvatar,
        }
    })
    
    return result;
}

export const useValidatorDescriptionForRedelegation = (redelegations:Array<RedelegationInfo>, validators:Array<any>) => {
    const result = redelegations.map((value) => {
        const src = validators.find(val => val.validatorInfo.operatorAddress === value.srcAddress);
        const dst = validators.find(val => val.validatorInfo.operatorAddress === value.dstAddress);

        const srcDescription = organizeValidatorDescription(src);
        const dstDescription = organizeValidatorDescription(dst);
        return {
            ...value,
            srcAvatarURL: srcDescription.validatorAvatar,
            srcMoniker: srcDescription.validatorMoniker,
            dstAvatarURL: dstDescription.validatorAvatar,
            dstMoniker: dstDescription.validatorMoniker,
        }
    })

    return result;
}

export const useValidatorData = () => {
    const stakingState = useAppSelector(state => state.staking);
    const [validators, setValidators]:Array<any> = useState([]);
    const [totalVotingPower, setTotalVotingPower] = useState(0);

    const { refetch, loading, data } = useValidatorsQuery();

    useEffect(() => {
        if(loading === false) {
            const stakingData = organizeStakingData(data);
            const validatorsList = data.validator
            .filter((validator: any) => {
                return validator.validatorStatuses[0].jailed === false;
            })
            .map((validator: any) => {
                return organizeValidatorData(validator, stakingData)
            });

            const validators = validatorsList.sort((a: any, b: any) => b.votingPower - a.votingPower);
            const totalVotingPower = stakingData.totalVotingPower;

            setTotalVotingPower(totalVotingPower);
            setValidators(validators);
        }
    }, [loading, data]);

    useEffect(() => {
        if(stakingState.validator){
            setValidators(validators.map((vd:any) => vd.validatorAddress === stakingState.validator.validatorAddress?
                {...stakingState.validator} : vd
            ));
        }
    }, [stakingState.validator]);
    
    const handleValidatorsPolling = async() => {
        return await refetch();
    }

    return {
        validators,
        totalVotingPower,
        handleValidatorsPolling,
    };
}

export const useValidatorDataFromAddress = (address:string) => {
    const [validatorState, setValidatorState] = useState<ValidatorState>();

    const {refetch, loading, data} = useValidatorFromAddressQuery({
        address: address.toString(),
    });

    useEffect(() => {
        if(loading === false){
            const stakingData = organizeStakingData(data);
            const validator = data.validator
            .filter((data: any) => {
                return data.validatorStatuses[0].jailed === false;
            })
            .map((data: any) => {
                return organizeValidatorData(data, stakingData)
            });

            const description:ValidatorDescription = {
                avatar: validator[0].validatorAvatar,
                moniker: validator[0].validatorMoniker,
                description: validator[0].validatorDetail,
                website: validator[0].validatorWebsite,
            }

            const address:ValidatorAddress = {
                operatorAddress: validator[0].validatorAddress,
                accountAddress: validator[0].selfDelegateAddress,
            }

            const percentageData:ValidatorData = {
                APR: convertPercentage(validator[0].APR),
                APY: convertPercentage(validator[0].APY),
                state: [
                    {row: [{
                        title: "Voting Power",
                        data: validator[0].votingPowerPercent,
                        amount: validator[0].votingPower,
                    },{
                        title: "Self-Delegation",
                        data: validator[0].selfPercent,
                        amount: convertToFctNumber(validator[0].self),
                    }]},
                    {row: [{
                        title: "Commission",
                        data: validator[0].commission,
                    },{
                        title: "Uptime",
                        data: validator[0].condition,
                    }]}
                ]
            }

            setValidatorState({
                description,
                address,
                percentageData
            });
        }
    }, [loading, data])
    
    const handleValidatorPolling = async() => {
        return await refetch();
    }

    return {
        validatorState,
        handleValidatorPolling,
    };
}

const organizeValidatorDescription = (validator: any) => {
    let validatorMoniker = "";
    let validatorAvatar = "";
    let validatorDetail = "";
    let validatorWebsite = "";

    if (validator !== undefined) {
        validatorMoniker = validator.validator_descriptions[0].moniker;
        validatorAvatar = validator.validator_descriptions[0].avatar_url;
        validatorDetail = validator.validator_descriptions[0].details;
        validatorWebsite = validator.validator_descriptions[0].website;
    }

    return {
        validatorMoniker,
        validatorAvatar,
        validatorDetail,
        validatorWebsite,
    }
}

const organizeStakingData = (data:any) => {
    const averageBlockTimePerDay = data.average_block_time_per_day.length > 0 ? data.average_block_time_per_day[0].average_time : 0;
    const averageBlockTimePerHour = data.average_block_time_per_hour.length > 0 ? data.average_block_time_per_hour[0].average_time : 0;
    const averageBlockTimePerMinute = data.average_block_time_per_minute.length > 0 ? data.average_block_time_per_minute[0].average_time : 0;

    let averageBlockTime = 0;
    if (averageBlockTimePerDay !== 0) {
        averageBlockTime = averageBlockTimePerDay;
    } else if (averageBlockTimePerHour !== 0) {
        averageBlockTime = averageBlockTimePerHour;
    } else if (averageBlockTimePerMinute !== 0) {
        averageBlockTime = averageBlockTimePerMinute;
    }

    // BLOCK_PER_MINT_COIN
    const slashingParams = data.slashingParams[0].params;
    const totalVotingPower = convertToFctNumber(data.stakingPool[0].bondedTokens);
    const { signed_blocks_window } = slashingParams;

    const inflation = convertNumber(data.inflation[0].value);
    const totalSupply = convertToFctNumber(data.supply[0].coins.filter((v: any) => v.denom === "ufct")[0].amount);

    const mintCoinPerDay = (86400 / averageBlockTime) * ((inflation * totalSupply) / BLOCKS_PER_YEAR);
    const mintCoinPerYear = mintCoinPerDay * 365;

    return {
        totalVotingPower,
        signed_blocks_window,
        mintCoinPerYear
    }
}

const organizeValidatorData = (validator:any, stakingData:any) => {
    const validatorAddress = validator.validatorInfo.operatorAddress;

    const validatorDescription = organizeValidatorDescription(validator);
    let validatorMoniker = validatorDescription.validatorMoniker;
    let validatorAvatar = validatorDescription.validatorAvatar;
    let validatorDetail = validatorDescription.validatorDetail;
    let validatorWebsite = validatorDescription.validatorWebsite;

    const selfDelegateAddress = validator.validatorInfo.selfDelegateAddress;
    const votingPower = validator.validatorVotingPowers[0].votingPower;
    const votingPowerPercent = convertNumber((votingPower / stakingData.totalVotingPower) * 100).toFixed(2);

    const totalDelegations = validator.delegations.reduce((prev: number, current: any) => {
        return prev + convertNumber(current.amount.amount);
    }, 0);
    const [selfDelegation] = validator.delegations.filter((y: any) => {
        return y.delegatorAddress === validator.validatorInfo.selfDelegateAddress;
    });

    let self = 0;
    if (selfDelegation) self = convertNumber(selfDelegation.amount.amount);

    const selfPercent = convertNumber((self / (totalDelegations || 1)) * 100).toFixed(2);
    const delegations = validator.delegations.map((value: any) => {
        return { address: value.delegatorAddress, amount: convertNumber(value.amount.amount) };
    });
    const missedBlockCounter = validator.validatorSigningInfos[0].missedBlocksCounter;
    const commission = makeDecimalPoint(validator.validatorCommissions[0].commission * 100);
    const conditionOrigin = ((1 - missedBlockCounter / stakingData.signed_blocks_window) * 100)
    const condition = makeDecimalPoint(conditionOrigin, 2);

    const status = validator.validatorStatuses[0].status;
    const jailed = validator.validatorStatuses[0].jailed;

    const rewardPerYear = stakingData.mintCoinPerYear * (votingPower / stakingData.totalVotingPower) * 0.98 * (1 - validator.validatorCommissions[0].commission);
    const APR = rewardPerYear / votingPower;
    const APRPerDay = APR / 365;
    const APY = convertNumber(((1 + APRPerDay) ** 365 - 1).toFixed(2));

    return {
        validatorAddress,
        validatorMoniker,
        validatorAvatar,
        validatorDetail,
        validatorWebsite,
        selfDelegateAddress,
        votingPower,
        votingPowerPercent,
        commission,
        self,
        selfPercent,
        delegations,
        condition,
        status,
        jailed,
        APR,
        APY,
    };
}