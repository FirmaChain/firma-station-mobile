import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { StakingActions } from "@/redux/actions";
import { useDelegationsQuery, useValidatorFromAddressQuery, useValidatorFromAddressQueryForTestNet, useValidatorsDescriptionQuery, useValidatorsDescriptionQueryForTestNet, useValidatorsQuery, useValidatorsQueryForTestNet } from "@/apollo/gqls";
import { convertNumber, convertPercentage, convertToFctNumber, makeDecimalPoint } from "@/util/common";
import { getBalanceFromAdr, getDelegations, getRedelegations, getStaking, getUndelegations } from "@/util/firma";
import { BLOCKS_PER_YEAR } from "@/../config";
import { FirmaUtil } from "@firmachain/firma-js";

export interface ValidatorState {
    status: number;
    jailed: boolean;
    tombstoned: boolean;
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

export interface StakingData {
    data: string;
    amount?: number;
}

export interface ValidatorData {
    address: ValidatorAddress,
    APR: string;
    APY: string;

    // chain upgrade response
    votingPower?: StakingData;
    commission?: StakingData;
    uptime?: StakingData;
    
    state?: Array<any>;
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
    const {wallet, staking, common, storage} = useAppSelector(state => state);
    const [delegationList, setDelegationList] = useState<Array<StakeInfo>>([]);
    const [redelegationList, setRedelegationList] = useState<Array<RedelegationInfo>>([]);
    const [undelegationList, setUndelegationList] = useState<Array<UndelegationInfo>>([]);
    const [validatorsDescList, setValidatorsDescList] = useState<Array<any>>([]);

    const {refetch, loading, data} = storage.network === "TestNet"?useValidatorsDescriptionQueryForTestNet():useValidatorsDescriptionQuery();

    useEffect(() => {
        if(loading === false) {
            if(data){
                setValidatorsDescList(data.validator);
            }
        }
    }, [loading, data])

    const handleTotalDelegationPolling = async() => {
        try {
            await refetch();
            await handleDelegationState();
            if(redelegationList.length > 0){
                await handleRedelegationState();
            }
            if(undelegationList.length > 0){
                await handleUndelegationState();
            }
        } catch (error) {
            throw error;
        }
    }

    const handleDelegationState = async() => {
        try {
            const result:Array<StakeInfo> = await getDelegations(wallet.address);
            setDelegationList(
                result.filter(value => 
                    convertNumber(FirmaUtil.getFCTStringFromUFCT(value.amount)) !== 0 || 
                    convertNumber(FirmaUtil.getFCTStringFromUFCT(value.reward)) !== 0));
        } catch (error) {
            throw error;
        }
    }

    const handleRedelegationState = async() => {
        try {
            const redelegationResult:Array<RedelegationInfo> = await getRedelegations(wallet.address);
            setRedelegationList(redelegationResult);
        } catch (error) {
           throw error; 
        }
    }

    const handleUndelegationState = async() => {
        try {
            const undelegateionResult:Array<UndelegationInfo> = await getUndelegations(wallet.address);
            setUndelegationList(undelegateionResult);
        } catch (error) {
           throw error; 
        }
    }

    useEffect(() => {
        if(staking.delegate){
            setDelegationList(delegationList.map((vd:any) => vd.validatorAddress === staking.delegate.address?
                {...vd, reward: staking.delegate.reward} : vd));
        }
    }, [staking.delegate])

    const delegationState:Array<StakeInfo> = useMemo(() => {
        if(validatorsDescList.length > 0){
            return useValidatorDescription(delegationList, validatorsDescList);
        }
        return [];
    }, [delegationList, validatorsDescList]);

    const redelegationState:Array<RedelegationInfo> = useMemo(() => {
        if(validatorsDescList.length > 0){
            return useValidatorDescriptionForRedelegation(redelegationList, validatorsDescList);
        }
        return [];
    }, [redelegationList, validatorsDescList]);

    const undelegationState:Array<UndelegationInfo> = useMemo(() => {
        if(validatorsDescList.length > 0){
            return useValidatorDescription(undelegationList, validatorsDescList);
        }
        return [];
    }, [undelegationList, validatorsDescList]);

    const refetchValidatorDescList = async() => {
        return await refetch();
    }

    useEffect(() => {
        if(common.lockStation === false){
            setDelegationList([]);
            setRedelegationList([]);
            setUndelegationList([]);
            setValidatorsDescList([]);
            handleTotalDelegationPolling();
        }
    }, [storage.network, common.lockStation])

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
    const {wallet, common, storage} = useAppSelector(state => state);
    const [stakingState, setStakingState] = useState<StakingState>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    const getStakingState = async() => {
        try {
            const result = await getStaking(wallet.address);
            if(result) {
                setStakingState(result);
                StakingActions.updateStakingRewardState(result.stakingReward);
            }
        } catch (error) {
            throw error;
        }
    }

    const updateStakingState = async(stakingReward: number) => {
        try {
            const balance = await getBalanceFromAdr(wallet.address);
            setStakingState((prevState) => ({
                ...prevState,
                available: convertNumber(balance),
                stakingReward,
            }))
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        if(common.lockStation === false){
            if(wallet.address === '' || wallet.address === undefined) {
                return setStakingState({
                    available: 0,
                    delegated: 0,
                    undelegate: 0,
                    stakingReward: 0,
                })
            };
            getStakingState();
        }
    }, [storage.network, common.lockStation]);

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
    const {staking, common, storage} = useAppSelector(state => state);
    const [validators, setValidators]:Array<any> = useState([]);
    const [totalVotingPower, setTotalVotingPower] = useState(0);
    const [polling, setPolling] = useState(false);

    const { refetch, loading, data } = storage.network === "TestNet"? useValidatorsQueryForTestNet():useValidatorsQuery();

    useEffect(() => {
        if(polling){
            if(loading === false) {
                if(data){
                    const stakingData = organizeStakingData(data);
                    const validatorsList = data.validator
                    .filter((validator: any) => {
                        const jailed = validator.validatorStatuses.length > 0?validator.validatorStatuses[0].jailed:true;
                        const status = validator.validatorStatuses.length > 0?validator.validatorStatuses[0].status:0;
                        const tombstoned = validator.validatorSigningInfos.length > 0? validator.validatorSigningInfos[0].tombstoned:false;
                        return (jailed === false &&
                            status === 3 &&
                            tombstoned === false);
                    })
                    .map((validator: any) => {
                        return organizeValidatorData(validator, stakingData, storage.network)
                    })

                    const validators = validatorsList.length > 0?validatorsList.sort((a: any, b: any) => b.votingPower - a.votingPower):validatorsList;
                    const totalVotingPower = stakingData.totalVotingPower;
                    
                    setTotalVotingPower(totalVotingPower);
                    setValidators(validators);
                    setPolling(false);
                }
            }
        }
    }, [loading, data]);

    useEffect(() => {
        if(staking.validator){
            setValidators(validators.map((vd:any) => vd.validatorAddress === staking.validator.validatorAddress?
                {...staking.validator} : vd
            ));
        }
    }, [staking.validator]);
    
    const handleValidatorsPolling = async() => {
        setPolling(true);
        return await refetch();
    }

    useEffect(() => {
        if(common.lockStation === false){
            setValidators([]);
        }
    }, [storage.network, common.lockStation])

    return {
        validators,
        totalVotingPower,
        handleValidatorsPolling,
    };
}

export const useValidatorDataFromAddress = (address:string) => {
    const {storage} = useAppSelector(state => state);

    const [validatorState, setValidatorState] = useState<ValidatorState>();

    const {refetch, loading, data} = storage.network === "TestNet"?useValidatorFromAddressQueryForTestNet({
        address: address.toString(),
    }):useValidatorFromAddressQuery({
        address: address.toString(),
    });

    useEffect(() => {
        if(loading === false){
            if(data){
                const stakingData = organizeStakingData(data);
                const validator = data.validator
                .map((data: any) => {
                    return organizeValidatorData(data, stakingData, storage.network)
                });
    
                const status = validator[0].status;
                const jailed = validator[0].jailed;
                const tombstoned = validator[0].tombstoned;
    
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
                    address: address,
                    APR: convertPercentage(validator[0].APR),
                    APY: convertPercentage(validator[0].APY),
                    
                    // chain upgrade response
                    votingPower: {
                        data: validator[0].votingPowerPercent,
                        amount: validator[0].votingPower,
                    },
                    commission: {
                        data:validator[0].commission,
                    },
                    uptime: {
                        data: validator[0].condition,
                    },
                
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
                    status,
                    jailed,
                    tombstoned,
                    description,
                    address,
                    percentageData
                });
            }
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

export const useSelfDelegationData = (operatorAddress: string, accountAddress: string) => {
    const [selfDelegation, setSelfDelegation] = useState<StakingData>({
        data: "0",
        amount: 0,
    });

    const {loading, data} = useDelegationsQuery({
        address: operatorAddress.toString(),
    });

    useEffect(() => {
        if(loading === false){
            if(data){
                const delegations = data.delegations.delegations;
                
                const totalDelegations = delegations.reduce((prev: number, current: any) => {
                    return prev + convertNumber(current.coins[0].amount);
                }, 0);
                
                const [selfDelegation] = delegations.filter((y: any) => {
                    return y.delegator_address === accountAddress;
                });
    
                let self = 0;
                if (selfDelegation) self = convertNumber(selfDelegation.coins[0].amount);
            
                const selfPercent = makeDecimalPoint(convertNumber((self / (totalDelegations || 1)) * 100), 2);
                setSelfDelegation({
                    data: selfPercent,
                    amount: convertToFctNumber(self),
                });
            }
        }
    }, [loading, data])

    return {
        selfDelegation
    }
}

const organizeValidatorDescription = (validator: any) => {
    let validatorMoniker = validator.validatorInfo === undefined? null:validator.validatorInfo.operatorAddress;
    let validatorAvatar = null;
    let validatorDetail = null;
    let validatorWebsite = null;

    if (validator !== undefined && validator.validator_descriptions.length > 0) {
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
    const slashingParamsExist = data.slashingParams.length > 0;
    const slashingParams = slashingParamsExist?data.slashingParams[0].params:{
        signed_blocks_window: 0,
    };
    const stakingPoolExist = data.stakingPool.length > 0;
    const totalVotingPower = convertToFctNumber(stakingPoolExist?data.stakingPool[0].bondedTokens:0);
    const { signed_blocks_window } = slashingParams;

    const inflationExist = data.inflation.length > 0;
    const inflation = convertNumber(inflationExist?data.inflation[0].value:0);
    const supplyExist = data.supply.length > 0;
    const totalSupply = convertToFctNumber(supplyExist?data.supply[0].coins.filter((v: any) => v.denom === "ufct")[0].amount:0);

    const mintCoinPerDay = (86400 / averageBlockTime) * ((inflation * totalSupply) / BLOCKS_PER_YEAR);
    const mintCoinPerYear = mintCoinPerDay * 365;

    return {
        totalVotingPower,
        signed_blocks_window,
        mintCoinPerYear
    }
}

const organizeValidatorData = (validator:any, stakingData:any, network:string) => {
    const validatorAddress = validator.validatorInfo.operatorAddress;

    const validatorDescription = organizeValidatorDescription(validator);
    let validatorMoniker = validatorDescription.validatorMoniker;
    let validatorAvatar = validatorDescription.validatorAvatar;
    let validatorDetail = validatorDescription.validatorDetail;
    let validatorWebsite = validatorDescription.validatorWebsite;

    const selfDelegateAddress = validator.validatorInfo.selfDelegateAddress;
    const votingPowerExist = validator.validatorVotingPowers.length > 0;
    const votingPower = votingPowerExist? validator.validatorVotingPowers[0].votingPower : 0;
    const votingPowerPercent = makeDecimalPoint(convertNumber((votingPower / stakingData.totalVotingPower) * 100), 2);

    // chain upgrade response
    let self = 0;
    let selfPercent = "0";
    let delegations = [];

    if(network === "MainNet"){
        const totalDelegations = validator.delegations.reduce((prev: number, current: any) => {
            return prev + convertNumber(current.amount.amount);
        }, 0);
        const [selfDelegation] = validator.delegations.filter((y: any) => {
            return y.delegatorAddress === validator.validatorInfo.selfDelegateAddress;
        });
    
        if (selfDelegation) self = convertNumber(selfDelegation.amount.amount);
    
        selfPercent = makeDecimalPoint(convertNumber((self / (totalDelegations || 1)) * 100), 2);
        delegations = validator.delegations.map((value: any) => {
            return { address: value.delegatorAddress, amount: convertNumber(value.amount.amount) };
        });
    }
    //

    const missedBlockCounterExist = validator.validatorSigningInfos.length > 0;
    const missedBlockCounter = missedBlockCounterExist? validator.validatorSigningInfos[0].missedBlocksCounter : 0;
    const tombstoned = missedBlockCounterExist? validator.validatorSigningInfos[0].tombstoned : false;
    const commissionExist = validator.validatorCommissions.length > 0;
    const commissionOrigin = commissionExist?validator.validatorCommissions[0].commission:0;
    const commission = makeDecimalPoint(commissionOrigin * 100);
    const conditionOrigin = ((1 - missedBlockCounter / stakingData.signed_blocks_window) * 100)
    const condition = makeDecimalPoint(conditionOrigin, 2);

    const jailed = validator.validatorStatuses.length > 0?validator.validatorStatuses[0].jailed:true;
    const status = validator.validatorStatuses.length > 0?validator.validatorStatuses[0].status:0;

    const rewardPerYear = stakingData.mintCoinPerYear * (votingPower / stakingData.totalVotingPower) * 0.97 * (1 - (commissionOrigin));
    
    const APR = rewardPerYear > 0?rewardPerYear / votingPower : 0;
    const APRPerDay = APR / 365;
    const APY = convertNumber(makeDecimalPoint(((1 + APRPerDay) ** 365 - 1), 2));

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

        // chain upgrade response
        self,
        selfPercent,
        delegations,

        condition,
        status,
        jailed,
        tombstoned,
        APR,
        APY,
    };
}