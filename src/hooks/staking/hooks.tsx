import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { StakingActions } from '@/redux/actions';
import { convertNumber, convertPercentage, convertTime, convertToFctNumber, makeDecimalPoint } from '@/util/common';
import {
    getBalanceFromAdr,
    getBankSupply,
    getDelegationListFromValidator,
    getDelegations,
    getMintInflation,
    getRedelegations,
    getSelfDelegateAddressFromValOperAddress,
    getSigningInfo,
    getSigningInfos,
    getSlashingState,
    getStaking,
    getStakingGrant,
    getStakingPoolState,
    getUndelegations,
    getValidatorFromAddress,
    getValidators,
} from '@/util/firma';
import { CHAIN_NETWORK } from '@/../config';
import { DelegationInfo, FirmaUtil, PoolDataType, SlashingParam, ValidatorDataType } from '@firmachain/firma-js';
import { IValidatorProfileInfo } from '@/redux/reducers/storageReducer';
import { BLOCKS_PER_YEAR } from '@/constants/common';

export interface IValidatorState {
    validatorAddress: string;
    validatorAvatar: string;
    validatorMoniker: string;
    status: number;
    jailed: boolean;
    tombstoned: boolean;
    APR: string | number;
    APY: string | number;
}

export interface IValidatorDetailState {
    status: number;
    jailed: boolean;
    tombstoned: boolean;
    description: IValidatorDescription;
    address: IValidatorAddress;
    percentageData: IValidatorData;
}

export interface IStakingStateProps {
    stakingPool: PoolDataType;
    slashing: SlashingParam;
    mintInflation: number;
    totalSupply: number;
}

export interface IStakingsState {
    totalVotingPower: number;
    votingPower: number;
    signedBlocksWindow: number;
    mintCoinPerYear: number;
}

export interface IValidatorDescription {
    avatar: string;
    identity: string;
    moniker: string;
    description: string;
    website: string;
}

export interface IValidatorAddress {
    operatorAddress: string;
    accountAddress: string;
}

export interface IStakingData {
    data: string | number;
    amount?: number;
}

export interface IValidatorData {
    address: IValidatorAddress;
    APR: string | number;
    APY: string | number;

    votingPower: IStakingData;
    commission: IStakingData;
    uptime: IStakingData;

    state: Array<any>;
}

export interface IStakeInfo {
    validatorAddress: string;
    delegatorAddress: string;
    moniker: string;
    avatarURL: string;
    amount: number;
    reward: number;
}

export interface IRedelegationInfo {
    srcAddress: string;
    srcMoniker: string;
    srcAvatarURL: string;
    dstAddress: string;
    dstMoniker: string;
    dstAvatarURL: string;
    balance: number;
    completionTime: string;
}

export interface IUndelegationInfo {
    validatorAddress: string;
    moniker: string;
    avatarURL: string;
    balance: number;
    completionTime: string;
}

export interface IStakingGrantState {
    list: Array<any>;
    count: number;
    expire: string;
    expiration: number;
}

export interface IGrantState {
    authorization: {
        allow_list: {
            address: Array<string>;
        };
    };
    authorization_type: string;
    max_tokens: number | null;
    expiration: string;
}

export interface IStakingState {
    available: number;
    delegated: number;
    undelegate: number;
    stakingReward: number;
}

export const useDelegationData = () => {
    const { wallet, staking, storage } = useAppSelector(state => state);
    const [delegationList, setDelegationList] = useState<Array<IStakeInfo>>([]);
    const [redelegationList, setRedelegationList] = useState<Array<IRedelegationInfo>>([]);
    const [undelegationList, setUndelegationList] = useState<Array<IUndelegationInfo>>([]);
    const [stakingGrantList, setStakingGrantList] = useState<IStakingGrantState>({
        list: [],
        count: 0,
        expire: '',
        expiration: 0,
    });
    const [stakingGrantActivation, setStakingGrantActivation] = useState<boolean | null>(null);
    const [validatorsList, setValidatorsList] = useState<Array<ValidatorDataType>>([]);
    const [validatorsAvatarList, setValidatorsAvatarList] = useState<Array<IValidatorProfileInfo> | []>([]);

    useEffect(() => {
        if (storage.validatorsProfile === undefined) return;
        setValidatorsAvatarList(storage.validatorsProfile.profileInfos);
    }, [storage.validatorsProfile]);

    const handleDelegationPolling = async () => {
        try {
            await handleValidators();
            await handleDelegationState();
        } catch (error) {
            throw error;
        }
    };

    const handleTotalDelegationPolling = async () => {
        try {
            await handleRedelegationState();
            await handleUndelegationState();
            await handleStakingGrantState();
        } catch (error) {
            throw error;
        }
    };

    const handleValidators = async () => {
        try {
            const validators = await getValidators();
            const list = validators.filter((validator: ValidatorDataType) => {
                const jailed = validator.jailed;
                const status = getValidatorStatus(validator.status);
                const tombstoned = false;

                return jailed === false && status === 3 && tombstoned === false;
            });
            setValidatorsList(list);
        } catch (error) {}
    };

    const handleDelegationState = async () => {
        try {
            const result: Array<IStakeInfo> = await getDelegations(wallet.address);

            setDelegationList(
                result.filter(
                    value =>
                        convertNumber(FirmaUtil.getFCTStringFromUFCT(value.amount)) !== 0 ||
                        convertNumber(FirmaUtil.getFCTStringFromUFCT(value.reward)) !== 0
                )
            );
        } catch (error) {
            throw error;
        }
    };

    const handleRedelegationState = async () => {
        try {
            const redelegationResult: Array<IRedelegationInfo> = await getRedelegations(wallet.address);
            setRedelegationList(redelegationResult);
        } catch (error) {
            throw error;
        }
    };

    const handleUndelegationState = async () => {
        try {
            const undelegateionResult: Array<IUndelegationInfo> = await getUndelegations(wallet.address);
            setUndelegationList(undelegateionResult);
        } catch (error) {
            throw error;
        }
    };

    const handleStakingGrantState = useCallback(async () => {
        try {
            const grantStakeResult: Array<any> = await getStakingGrant(wallet.address);
            setStakingGrantList(StakingGrantData(delegationList, grantStakeResult[0]));
        } catch (error) {
            throw error;
        }
    }, [delegationList]);

    const handleStakingGrantActivationState = async () => {
        try {
            const grantStakingResult: Array<any> = await getStakingGrant(wallet.address);
            let grantExist =
                grantStakingResult[0] === undefined ? false : grantStakingResult[0].authorization.allow_list.address.length > 0;
            setStakingGrantActivation(grantExist);
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        setDelegationList(
            delegationList.map((vd: any) =>
                staking.delegate !== null && vd.validatorAddress === staking.delegate.address
                    ? { ...vd, reward: staking.delegate.reward }
                    : vd
            )
        );
    }, [staking.delegate]);

    useEffect(() => {
        handleTotalDelegationPolling();
    }, [delegationList]);

    const delegationState: Array<IStakeInfo> = useMemo(() => {
        if (validatorsList.length > 0) {
            return useValidatorDescription(delegationList, validatorsList, validatorsAvatarList);
        }
        return [];
    }, [delegationList, validatorsList, validatorsAvatarList]);

    const redelegationState: Array<IRedelegationInfo> = useMemo(() => {
        if (validatorsList.length > 0) {
            return useValidatorDescriptionForRedelegation(redelegationList, validatorsList, validatorsAvatarList);
        }
        return [];
    }, [redelegationList, validatorsList, validatorsAvatarList]);

    const undelegationState: Array<IUndelegationInfo> = useMemo(() => {
        if (validatorsList.length > 0) {
            return useValidatorDescription(undelegationList, validatorsList, validatorsAvatarList);
        }
        return [];
    }, [undelegationList, validatorsList, validatorsAvatarList]);

    const stakingGrantState: IStakingGrantState = useMemo(() => {
        if (validatorsList.length > 0 && stakingGrantList.list.length > 0) {
            let list = useValidatorDescription(stakingGrantList.list, validatorsList, validatorsAvatarList);

            return {
                list: list,
                count: stakingGrantList.count,
                expire: stakingGrantList.expire,
                expiration: stakingGrantList.expiration,
            };
        }
        return {
            list: [],
            count: 0,
            expire: '',
            expiration: 0,
        };
    }, [stakingGrantList, validatorsList, validatorsAvatarList]);

    useEffect(() => {
        setDelegationList([]);
        setRedelegationList([]);
        setUndelegationList([]);
        setStakingGrantList({
            list: [],
            count: 0,
            expire: '',
            expiration: 0,
        });
        handleDelegationPolling();
    }, [storage.network]);

    return {
        delegationState,
        redelegationState,
        undelegationState,
        stakingGrantState,
        stakingGrantActivation,
        handleDelegationState,
        handleRedelegationState,
        handleUndelegationState,
        handleStakingGrantState,
        handleStakingGrantActivationState,
        handleTotalDelegationPolling,
    };
};

export const StakingGrantData = (delegationList: Array<any>, stakingGrantList: IGrantState) => {
    const calculateExpiration = (date: string) => {
        const today = new Date().getTime();
        const expire = new Date(date).getTime();

        const diffDate = expire - today;
        const currentDay = 24 * 60 * 60 * 1000;
        const dDay = Math.floor(Math.abs(diffDate / currentDay));

        return dDay;
    };

    let expireDate = new Date().toString();
    let grantList: string[] = [];
    let expiration = 0;
    if (stakingGrantList !== undefined) {
        grantList = stakingGrantList.authorization.allow_list.address;
        expireDate = stakingGrantList.expiration;
        expiration = calculateExpiration(stakingGrantList.expiration);
    }

    let undelegatedList = grantList;
    let restakeListWithDelegation = delegationList.map(dData => {
        undelegatedList = undelegatedList.filter(aData => aData.includes(dData.validatorAddress) === false);
        return {
            validatorAddress: dData.validatorAddress,
            avatarURL: dData.avatarURL,
            moniker: dData.moniker,
            delegated: dData.amount,
            stakingReward: dData.reward,
            isActive: grantList.includes(dData.validatorAddress),
        };
    });

    let restakeListWithoutDelegation = undelegatedList.map(value => {
        return {
            validatorAddress: value,
            avatarURL: '',
            moniker: value,
            delegated: 0,
            stakingReward: 0,
            isActive: true,
        };
    });

    let restakeCount = 0;
    if (restakeListWithDelegation.length > 0) {
        restakeCount = restakeListWithDelegation.filter(value => value.isActive === true).length;
    }

    let list = restakeListWithDelegation.concat(restakeListWithoutDelegation);

    return {
        list: list,
        count: restakeCount,
        expire: expireDate,
        expiration: expiration,
    };
};

export const useStakingData = () => {
    const { wallet, storage } = useAppSelector(state => state);
    const [stakingState, setStakingState] = useState<IStakingState | null>(null);

    const getStakingState = async () => {
        try {
            const result = await getStaking(wallet.address);
            setStakingState(result);
            StakingActions.updateStakingRewardState(result.stakingReward);
        } catch (error) {
            throw error;
        }
    };

    const updateStakingState = useCallback(
        async (stakingReward: number) => {
            try {
                const balance = await getBalanceFromAdr(wallet.address);
                if (stakingState !== null) {
                    stakingState['available'] = convertNumber(balance);
                    stakingState['stakingReward'] = stakingReward;

                    setStakingState({ ...stakingState });
                }
            } catch (error) {
                throw error;
            }
        },
        [stakingState]
    );

    useEffect(() => {
        if (wallet.address === '' || wallet.address === undefined) {
            return setStakingState({
                available: 0,
                delegated: 0,
                undelegate: 0,
                stakingReward: 0,
            });
        }
        getStakingState();
    }, [storage.network]);

    return {
        stakingState,
        getStakingState,
        updateStakingState,
    };
};

export const useValidatorDescription = (
    delegations: Array<any>,
    validators: Array<ValidatorDataType>,
    validatorsAvatarList: Array<IValidatorProfileInfo> | []
) => {
    if (validators !== undefined && validators.length > 0) {
        const result = delegations.map(value => {
            const desc = validators.find(val => val.operator_address === value.validatorAddress);

            const validatorDescription = organizeValidatorDescription(desc, validatorsAvatarList);
            return {
                ...value,
                moniker: validatorDescription.validatorMoniker,
                avatarURL: validatorDescription.validatorAvatar,
            };
        });
        return result;
    } else {
        return delegations;
    }
};

export const useValidatorDescriptionForRedelegation = (
    redelegations: Array<IRedelegationInfo>,
    validators: Array<ValidatorDataType>,
    validatorsAvatarList: Array<IValidatorProfileInfo> | []
) => {
    const result = redelegations.map(value => {
        const src = validators.find(val => val.operator_address === value.srcAddress);
        const dst = validators.find(val => val.operator_address === value.dstAddress);

        const srcDescription = organizeValidatorDescription(src, validatorsAvatarList);
        const dstDescription = organizeValidatorDescription(dst, validatorsAvatarList);
        return {
            ...value,
            srcAvatarURL: srcDescription.validatorAvatar,
            srcMoniker: srcDescription.validatorMoniker,
            dstAvatarURL: dstDescription.validatorAvatar,
            dstMoniker: dstDescription.validatorMoniker,
        };
    });

    return result;
};

export const useValidatorData = () => {
    const { staking, storage } = useAppSelector(state => state);
    const [validators, setValidators] = useState<Array<IValidatorState> | []>([]);
    const [validatorsAvatarList, setValidatorsAvatarList] = useState<Array<IValidatorProfileInfo> | []>([]);

    useEffect(() => {
        if (storage.validatorsProfile === undefined) return;
        setValidatorsAvatarList(storage.validatorsProfile.profileInfos);
    }, [storage.validatorsProfile]);

    const handleValidatorsState = useCallback(async () => {
        try {
            const [validators, commonState, signingInfos] = await Promise.all([getValidators(), getCommonState(), getSigningInfos()]);

            const list = validators
                .filter((validator: ValidatorDataType) => {
                    const jailed = validator.jailed;
                    const status = getValidatorStatus(validator.status);
                    const tombstoned = false;

                    return jailed === false && status === 3 && tombstoned === false;
                })
                .map((validator: ValidatorDataType) => {
                    const consensusPubkey = validator.consensus_pubkey;
                    const pubkey = consensusPubkey.key;
                    const valconsAddr = FirmaUtil.getValConsAddressFromAccAddress(pubkey);
                    const signingInfo = signingInfos.find(info => info.address === valconsAddr);

                    const jailed = validator.jailed;
                    const status = getValidatorStatus(validator.status);
                    const tombstoned = signingInfo === undefined ? false : signingInfo.tombstoned;

                    const validatorAddress = validator.operator_address;
                    const validatorMoniker = validator.description.moniker;
                    const avatarURL = getValidatorAvatarURL(validatorsAvatarList, validatorAddress);
                    const validatorAvatar = avatarURL;
                    const stakingPool = commonState.stakingPool;
                    const slashing = commonState.slashing;

                    const votingPower = convertToFctNumber(validator.tokens);
                    const totalVotingPower = convertToFctNumber(stakingPool.bonded_tokens);

                    //? Note: Changed the calculation method to rounding so the displayed value stays consistent with Explorer.
                    // const votingPowerPercent = makeDecimalPoint(convertNumber((votingPower / totalVotingPower).toFixed(5)) * 100, 5);
                    const votingPowerPercent = convertNumber((votingPower / totalVotingPower) * 100).toFixed(2);

                    const commission = convertNumber(validator.commission.commission_rates.rate);
                    const stakingState: IStakingsState = getStakingState(commonState, votingPower, storage.network);
                    const annualPercentageState = getAPRAPY(stakingState, commission);
                    const APR = annualPercentageState.APR;
                    const APY = annualPercentageState.APY;

                    const signedBlockWindow = convertNumber(slashing.signed_blocks_window);
                    let condition = '-';
                    const missedBlockCounter = signingInfo === undefined ? 0 : convertNumber(signingInfo.missed_blocks_counter);
                    const conditionOrigin = (1 - missedBlockCounter / signedBlockWindow) * 100;
                    condition = makeDecimalPoint(conditionOrigin, 2);

                    return {
                        validatorAddress,
                        validatorAvatar,
                        validatorMoniker,
                        votingPower,
                        votingPowerPercent,
                        condition,
                        commission,
                        status,
                        jailed,
                        tombstoned,
                        APR,
                        APY,
                    };
                });

            setValidators(list);
        } catch (error) {
            console.log(error);
        }
    }, [validatorsAvatarList]);

    useEffect(() => {
        handleValidatorsState();
    }, [validatorsAvatarList]);

    useEffect(() => {
        setValidators(
            validators.map((vd: any) =>
                staking.validator !== null && vd.validatorAddress === staking.validator.address.operatorAddress
                    ? {
                          ...vd,
                          status: staking.validator.status,
                          jailed: staking.validator.jailed,
                          tombstoned: staking.validator.tombstoned,
                          APR: staking.validator.percentageData.APR,
                          APY: staking.validator.percentageData.APY,
                      }
                    : vd
            )
        );
    }, [staking.validator]);

    const handleValidatorsPolling = async () => {
        await handleValidatorsState();
    };

    useEffect(() => {
        setValidators([]);
    }, [storage.network]);

    return {
        validators,
        handleValidatorsPolling,
    };
};

export const useValidatorDataFromAddress = (validatorAddress: string) => {
    const { storage } = useAppSelector(state => state);

    const [validatorState, setValidatorState] = useState<IValidatorDetailState>();

    const handleValidatorState = useCallback(async () => {
        try {
            const [commonState, validator, delegation, selfDelegateAddress] = await Promise.all([
                getCommonState(),
                getValidatorFromAddress(validatorAddress),
                getDelegationListFromValidator(validatorAddress),
                getSelfDelegateAddressFromValOperAddress(validatorAddress),
            ]);

            const consensusPubkey = validator.consensus_pubkey;
            const pubkey = consensusPubkey.key;
            const valconsAddr = FirmaUtil.getValConsAddressFromAccAddress(pubkey);
            const signingInfo = await getSigningInfo(valconsAddr);

            const stakingPool = commonState.stakingPool;
            const slashing = commonState.slashing;

            const operatorAddress = validator.operator_address;
            const delegations = getSelfDelegationState(delegation, selfDelegateAddress);
            const validatorsAvatarList = storage.validatorsProfile.profileInfos;
            const avatarURL = getValidatorAvatarURL(validatorsAvatarList, operatorAddress);

            const votingPower = convertToFctNumber(validator.tokens);
            const totalVotingPower = convertToFctNumber(stakingPool.bonded_tokens);
            const votingPowerPercent = makeDecimalPoint(convertNumber((votingPower / totalVotingPower).toFixed(5)) * 100, 2);
            const signedBlockWindow = convertNumber(slashing.signed_blocks_window);
            const commission = convertNumber(validator.commission.commission_rates.rate);

            const status = getValidatorStatus(validator.status);
            const jailed = validator.jailed;
            const tombstoned = signingInfo === undefined ? false : signingInfo.tombstoned;

            const stakingState: IStakingsState = getStakingState(commonState, votingPower, storage.network);
            const annualPercentageState = getAPRAPY(stakingState, commission);

            let condition = '-';
            const missedBlockCounter = signingInfo === undefined ? 0 : convertNumber(signingInfo.missed_blocks_counter);
            const conditionOrigin = (1 - missedBlockCounter / signedBlockWindow) * 100;
            condition = makeDecimalPoint(conditionOrigin, 2);

            const description: IValidatorDescription = {
                avatar: avatarURL,
                identity: validator.description.identity,
                moniker: validator.description.moniker,
                description: validator.description.details,
                website: validator.description.website,
            };

            const address: IValidatorAddress = {
                operatorAddress: operatorAddress,
                accountAddress: selfDelegateAddress,
            };

            const percentageData: IValidatorData = {
                address: address,
                APR: annualPercentageState.APR,
                APY: annualPercentageState.APY,

                votingPower: {
                    data: votingPowerPercent,
                    amount: votingPower,
                },
                commission: {
                    data: commission,
                },
                uptime: {
                    data: condition,
                },
                state: [
                    {
                        row: [
                            {
                                title: 'Voting Power',
                                data: votingPowerPercent,
                                amount: votingPower,
                            },
                            {
                                title: 'Self-Delegation',
                                data: delegations.selfPercent,
                                amount: delegations.self,
                            },
                        ],
                    },
                    {
                        row: [
                            {
                                title: 'Commission',
                                data: makeDecimalPoint(commission * 100),
                            },
                            {
                                title: 'Uptime',
                                data: condition,
                            },
                        ],
                    },
                ],
            };

            setValidatorState({
                status,
                jailed,
                tombstoned,
                description,
                address,
                percentageData,
            });
        } catch (error) {
            console.log(error);
        }
    }, [validatorAddress, storage.validatorsProfile]);

    const handleValidatorPolling = async () => {
        try {
            await handleValidatorState();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        validatorState,
        handleValidatorPolling,
    };
};

const getCommonState = async () => {
    try {
        const [stakingPool, slashing, mintInflation, totalSupply] = await Promise.all([
            getStakingPoolState(),
            getSlashingState(),
            getMintInflation(),
            getBankSupply(),
        ]);

        return {
            stakingPool,
            slashing,
            mintInflation,
            totalSupply,
        };
    } catch (error) {
        throw error;
    }
};

export const useRestakeInfoData = () => {
    const { storage } = useAppSelector(state => state);
    const [restakeInfo, setRestakeInfo]: any = useState(null);
    const [info, setInfo]: any = useState(null);

    const handleRestakeInfo = async () => {
        try {
            const result = await fetch(CHAIN_NETWORK[storage.network].RESTAKE_API);
            const json = await result.json();
            setInfo(json);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleRestakeInfo();
    }, []);

    const nextYear = useMemo(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);

        return convertTime(date.getTime(), false);
    }, []);

    useEffect(() => {
        if (info) {
            return setRestakeInfo({
                frequency: info.frequency,
                round: info.round,
                minimum_Rewards: convertToFctNumber(info.minimumRewards),
                nextRoundDateTime: info.nextRoundDateTime,
                expiry_Date: nextYear,
            });
        }
        setRestakeInfo({
            frequency: '4 hours',
            round: 0,
            minimum_Rewards: 10,
            nextRoundDateTime: '',
            expiry_Date: nextYear,
        });
    }, [info]);

    return { restakeInfo, handleRestakeInfo };
};

const getValidatorStatus = (status: string) => {
    if (status === 'BOND_STATUS_UNSPECIFIED') return 0;
    if (status === 'BOND_STATUS_UNBONDED') return 1;
    if (status === 'BOND_STATUS_UNBONDING') return 2;
    if (status === 'BOND_STATUS_BONDED') return 3;
    return 3;
};

const getStakingState = (commonState: IStakingStateProps, tokens: number, network: string) => {
    const stakingPool = commonState.stakingPool;
    const slashing = commonState.slashing;
    const mintInflation = commonState.mintInflation;
    const totalSupply = commonState.totalSupply;

    const votingPower = tokens;
    const totalVotingPower = convertToFctNumber(stakingPool.bonded_tokens);
    const signedBlockWindow = convertNumber(slashing.signed_blocks_window);
    const mintCoinPerYear = getMintCoinPerYear(network, mintInflation, totalSupply);

    return {
        totalVotingPower: totalVotingPower,
        votingPower: votingPower,
        signedBlocksWindow: signedBlockWindow,
        mintCoinPerYear: mintCoinPerYear,
    };
};

const getMintCoinPerYear = (network: string, mintInflation: number, totalSupply: number) => {
    const _totalSupply = convertToFctNumber(totalSupply);
    const _BLOCKS_PER_YEAR = BLOCKS_PER_YEAR();

    const averageBlockTime = CHAIN_NETWORK[network].AVERAGE_BLOCK_TIME;
    const mintCoinPerDay = (86400 / averageBlockTime) * ((mintInflation * _totalSupply) / _BLOCKS_PER_YEAR);
    const mintCoinPerYear = mintCoinPerDay * 365;

    return mintCoinPerYear;
};

const getAPRAPY = (stakingState: IStakingsState, commission: number) => {
    const rewardPerYear =
        stakingState.mintCoinPerYear * (stakingState.votingPower / stakingState.totalVotingPower) * 0.97 * (1 - commission);

    const APR = rewardPerYear > 0 ? rewardPerYear / stakingState.votingPower : 0;
    const APRPerDay = APR / 365;
    const APY = convertNumber(makeDecimalPoint((1 + APRPerDay) ** 365 - 1, 2));

    return {
        APR: convertPercentage(APR),
        APY: convertPercentage(APY),
    };
};

const getSelfDelegationState = (delegation: DelegationInfo[], selfDelegateAddress: string) => {
    let self = 0;
    let selfPercent = '0';
    let delegationList = [];

    const totalDelegations = delegation.reduce((prev: number, current: any) => {
        return prev + convertNumber(current.balance.amount);
    }, 0);
    const [selfDelegation] = delegation.filter((y: any) => {
        return y.delegation.delegator_address === selfDelegateAddress;
    });

    if (selfDelegation) self = convertNumber(selfDelegation.balance.amount);

    selfPercent = makeDecimalPoint(convertNumber((self / (totalDelegations || 1)) * 100), 2);
    delegationList = delegation.map((value: any) => {
        return { address: value.delegation.delegator_address, amount: convertNumber(value.balance.amount) };
    });

    return {
        self: convertToFctNumber(self),
        selfPercent,
        delegationList,
    };
};

const organizeValidatorDescription = (
    validator: ValidatorDataType | undefined,
    validatorsAvatarList: Array<IValidatorProfileInfo> | []
) => {
    let validatorMoniker = validator === undefined ? '' : validator.operator_address;
    let validatorAvatar = '';
    let validatorDetail = '';
    let validatorWebsite = '';

    if (validator !== undefined) {
        validatorMoniker = validator.description.moniker;
        validatorAvatar = getValidatorAvatarURL(validatorsAvatarList, validator.operator_address);
        validatorDetail = validator.description.details;
        validatorWebsite = validator.description.website;
    }

    return {
        validatorMoniker,
        validatorAvatar,
        validatorDetail,
        validatorWebsite,
    };
};

export const getValidatorAvatarURL = (validatorsAvatarList: Array<IValidatorProfileInfo> | [], operatorAddress: string) => {
    let avatarURL = '';
    if (validatorsAvatarList.length > 0) {
        const avatarState = validatorsAvatarList.find((val: IValidatorProfileInfo) => val.operatorAddress === operatorAddress);
        if (avatarState !== undefined) {
            avatarURL = avatarState.url;
        }
    }

    return avatarURL;
};
