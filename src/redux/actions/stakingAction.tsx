import { ValidatorState } from "@/hooks/staking/hooks"
import { DelegateUpdateState } from "../reducers/stakingReducer"
import { LOAD_DELEGATION_LIST, LOAD_VALIDATOR_LIST, UPDATE_DELEGATE_STATE, UPDATE_STAKING_REWARD, UPDATE_VALIDATOR_STATE } from "../types"

export const updateDelegateState = (delegate:DelegateUpdateState) => (
    {
        type: UPDATE_DELEGATE_STATE,
        payload: delegate,
    }
)

export const updateValidatorState = (validator:ValidatorState) => (
    {
        type: UPDATE_VALIDATOR_STATE,
        payload: validator,
    }
)

export const updateStakingRewardState = (reward:number) => (
    {
        type: UPDATE_STAKING_REWARD,
        payload: reward,
    }
)

export const loadDelegationList = (loading:boolean) => (
    {
        type: LOAD_DELEGATION_LIST,
        payload: loading
    }
)

export const loadValidatorList = (loading:boolean) => (
    {
        type: LOAD_VALIDATOR_LIST,
        payload: loading
    }
)