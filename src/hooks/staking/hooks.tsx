import { useValidatorFromAddressQuery, useValidatorsDescriptionQuery, useValidatorsQuery } from "@/apollo/gqls";
import { getDelegations, getStaking } from "@/util/firma";
import { useEffect, useState } from "react";
import { convertNumber, convertToFctNumber } from "@/util/common";
import { BLOCKS_PER_YEAR } from "@/constants/common";

export interface ValidatorsState {
    totalVotingPower: number;
    validators: Array<any>;
}

export interface StakeInfo {
    validatorAddress: string;
    delegatorAddress: string;
    moniker: string;
    avatarURL: string;
    amount: number;
    reward: number;
}

export interface StakingState {
    available: number;
    delegated: number;
    undelegate: number;
    stakingReward: number;
}

export const useDelegationData = (address:string) => {
    const [delegationState, setDelegationState] = useState<Array<StakeInfo>>([]);
    const [delegationList, setDelegationList] = useState<Array<StakeInfo>>();
    const [validatorsDescList, setValidatorsDescList] = useState<Array<any>>();
    const [delegationPolling, setDelegationPolling] = useState(false);

    const {startPolling } = useValidatorsDescriptionQuery({
        onCompleted:(data) => {
            setValidatorsDescList(data.validator);
        }
    });

    const handleDelegationPolling = (polling:boolean) => {
        if(polling){
            handleDelegationState();
            setDelegationPolling(true);
        } else {
            setDelegationPolling(false);
        }
    }

    const handleDelegationState = () => {
        startPolling(0);
        getDelegations(address).then((res:Array<StakeInfo>) => {
            if(res) {
                setDelegationList(res);
            }
        })

        setDelegation();
    }

    const setDelegation = () => {
        if(delegationList !== undefined && validatorsDescList !== undefined){
            setDelegationState(useValidatorDescription(delegationList, validatorsDescList));
        }
    }


    useEffect(() => {
        let timer = setInterval(() => {
            if(delegationPolling){
                handleDelegationState();
            }
        }, 30000);
        return () => {
            clearInterval(timer);
        }
    })

    useEffect(() => {
        setDelegation();
    }, [delegationList, validatorsDescList])

    return {
        delegationState,
        handleDelegationState,
        handleDelegationPolling,
    }

}

export const useStakingData = (address:string) => {
    const [stakingState, setStakingState] = useState<StakingState>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });
    const [getStakingComplete, setStakingComplete] = useState(false);

    const getStakingState = () => {
        getStaking(address).then((res:StakingState) => {
            if(res) {
                setStakingState(res);
                setStakingComplete(true);
            }
        })
    }

    const updateStakingState = (available: number, stakingReward: number) => {
        setStakingState((prevState) => ({
            ...prevState,
            available,
            stakingReward,
        }))
    }

    useEffect(() => {
        if(address === '' || address === undefined) return;
        getStakingState();
    }, []);

    return { 
        stakingState,
        getStakingComplete,
        getStakingState,
        updateStakingState,
    }
}

export const useValidatorDescription = (delegations:Array<StakeInfo>, validators:Array<any>) => {
    const result = delegations.map((value) => {
        const desc = validators.find(val => val.validatorInfo.operatorAddress === value.validatorAddress);
        
        const validatorDescription = organizeValidatorDescription(desc);
        return {
            validatorAddress: value.validatorAddress,
            delegatorAddress: value.delegatorAddress,
            amount: value.amount,
            reward: value.reward,
            moniker: validatorDescription.validatorMoniker,
            avatarURL: validatorDescription.validatorAvatar,
        }
    })
    
    return result;
}

export const useValidatorData = () => {
    const [validatorsState, setValidatorsState] = useState<ValidatorsState>({
        totalVotingPower: 0,
        validators: [],
    });

    const {startPolling } = useValidatorsQuery({
        onCompleted:(data) => {
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

            setValidatorsState((prevState) => ({
                ...prevState,
                totalVotingPower,
                validators,
            }));
        }
    });

    const handleValidatorsPolling = () => {
        return startPolling(0);
    }

    return {
        validatorsState,
        handleValidatorsPolling,
    };
}

export const useValidatorDataFromAddress = (address:string) => {
    const [validatorState, setValidatorState]:Array<any> = useState();

    const {startPolling } = useValidatorFromAddressQuery({
        address: address.toString(),
        onCompleted:(data) => {
            const stakingData = organizeStakingData(data);
            const validator = data.validator
            .filter((data: any) => {
                return data.validatorStatuses[0].jailed === false;
            })
            .map((data: any) => {
                return organizeValidatorData(data, stakingData)
            });
            setValidatorState(validator[0]);
        }
    });

    const handleValidatorPolling = () => {
        return startPolling(0);
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
    const commission = convertNumber(validator.validatorCommissions[0].commission * 100);
    const condition = (1 - missedBlockCounter / stakingData.signed_blocks_window) * 100;
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