import { DelegateUpdateState } from "../reducers/stakingReducer"
import { UPDATE_DELEGATE_STATE, UPDATE_STAKING_REWARD, UPDATE_VALIDATOR_STATE } from "../types"

export const updateDelegateState = (delegate:DelegateUpdateState) => (
    {
        type: UPDATE_DELEGATE_STATE,
        payload: delegate,
    }
)

export const updateValidatorState = (validator:Array<any>) => (
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

