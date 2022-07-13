import { IValidatorState } from "@/hooks/staking/hooks";
import { Action, UPDATE_DELEGATE_STATE, UPDATE_STAKING_REWARD, UPDATE_VALIDATOR_STATE } from "../types";

export interface IDelegateUpdateState {
    address: string;
    reward: number;
}

export interface IState {
    delegate: IDelegateUpdateState;
    validator: IValidatorState;
    stakingReward: number;
}

const initialState = {
    delegate: null,
    validator: null,
    stakingReward: 0,
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
        default :
        return state
    }
}

export default reducer;