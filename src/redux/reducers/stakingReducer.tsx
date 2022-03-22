import { ValidatorState } from "@/hooks/staking/hooks";
import { Action, LOAD_DELEGATION_LIST, LOAD_VALIDATOR_LIST, UPDATE_DELEGATE_STATE, UPDATE_STAKING_REWARD, UPDATE_VALIDATOR_STATE } from "../types";

export interface DelegateUpdateState {
    address: string;
    reward: number;
}

export interface StakingReduceState {
    delegate: DelegateUpdateState;
    validator: ValidatorState;
    stakingReward: number;
    loadDelegationList: boolean;
    loadValidatorList: boolean;
}

const initialState = {
    delegate: null,
    validator: null,
    stakingReward: 0,
    loadDelegationList: false,
    loadValidatorList: false,
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case UPDATE_DELEGATE_STATE : 
        return{
            ...state, 
            delegate: action.payload,
        }
        case UPDATE_VALIDATOR_STATE : 
        return{
            ...state, 
            validator: action.payload,
        }
        case UPDATE_STAKING_REWARD : 
        return{
            ...state, 
            stakingReward: action.payload,
        }
        case LOAD_DELEGATION_LIST : 
        return{
            ...state, 
            loadDelegationList: action.payload,
        }
        case LOAD_VALIDATOR_LIST : 
        return{
            ...state, 
            loadValidatorList: action.payload,
        }
        default :
        return state
    }
}

export default reducer;