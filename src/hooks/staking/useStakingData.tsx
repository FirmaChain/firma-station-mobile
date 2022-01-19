import { useEffect, useState } from "react";
import { VALIDATOR_LIST } from "../../constants/dummy";
import { convertNumber, convertToFctNumber, isValid } from "../../util/common";
export const MINT_COIN_PER_BLOCK = 12.8629;

const data = VALIDATOR_LIST.data;

export interface ValidatorsState {
    totalVotingPower: number;
    validators: Array<any>;
}

export const useStakingData = () => {
    const [validatorsState, setValidatorsState] = useState<ValidatorsState>({
        totalVotingPower: 0,
        validators: [],
    });

    useEffect(() => {
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
    
        const mintCoinPerDay = (86400 / averageBlockTime) * MINT_COIN_PER_BLOCK;
        const mintCoinPerYear = mintCoinPerDay * 365;
    
        const validatorsList = data.validator
        .filter((validator: any) => {
            return validator.validatorStatuses[0].jailed === false;
        })
        .map((validator: any) => {
            const validatorAddress = validator.validatorInfo.operatorAddress;
    
            let validatorMoniker = "";
            let validatorAvatar = "";
            let validatorDetail = "";
            let validatorWebsite = "";
    
            if (isValid(validator.validator_descriptions[0])) {
                validatorMoniker = validator.validator_descriptions[0].moniker;
                validatorAvatar = validator.validator_descriptions[0].avatar_url;
                validatorDetail = validator.validator_descriptions[0].details;
                validatorWebsite = validator.validator_descriptions[0].website;
            }
    
            const selfDelegateAddress = validator.validatorInfo.selfDelegateAddress;
            const votingPower = validator.validatorVotingPowers[0].votingPower;
            const votingPowerPercent = convertNumber((votingPower / totalVotingPower) * 100).toFixed(2);

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
            const condition = (1 - missedBlockCounter / signed_blocks_window) * 100;
            const status = validator.validatorStatuses[0].status;
            const jailed = validator.validatorStatuses[0].jailed;
    
            const rewardPerYear = mintCoinPerYear * (votingPower / totalVotingPower) * 0.98 * (1 - validator.validatorCommissions[0].commission);
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
        });
    
        const validators = validatorsList.sort((a: any, b: any) => b.votingPower - a.votingPower);
        // const validators = validatorsList;
    
        setValidatorsState((prevState) => ({
            ...prevState,
            totalVotingPower,
            validators,
        }));
    }, [])

    return {
        validatorsState,
    };
}
