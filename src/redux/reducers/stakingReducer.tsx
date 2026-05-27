import { createAction, createReducer } from '@reduxjs/toolkit';

import type { IValidatorDetailState, IValidatorState } from '@/hooks/staking/hooks';

import { UPDATE_DELEGATE_STATE, UPDATE_STAKING_REWARD, UPDATE_VALIDATOR_STATE, UPDATE_VALIDATORS_STATE } from '../types';

export interface IDelegateUpdateState {
    address: string;
    reward: number;
}

export interface IStakingStateProps {
    delegate: IDelegateUpdateState | null;
    validator: IValidatorDetailState | null;
    validators: IValidatorState[];
    stakingReward: number;
}

const initialState: IStakingStateProps = {
    delegate: null,
    validator: null,
    validators: [],
    stakingReward: 0
};

export const ACTION_CREATORS = {
    UPDATE_DELEGATE_STATE: createAction<IDelegateUpdateState | null>(UPDATE_DELEGATE_STATE),
    UPDATE_STAKING_REWARD: createAction<IValidatorDetailState | null>(UPDATE_STAKING_REWARD),
    UPDATE_VALIDATOR_STATE: createAction<number>(UPDATE_VALIDATOR_STATE),
    UPDATE_VALIDATORS_STATE: createAction<IValidatorState[]>(UPDATE_VALIDATORS_STATE)
};

export const ACTIONS = {
    updateDelegateState: ACTION_CREATORS.UPDATE_DELEGATE_STATE,
    updateValidatorState: ACTION_CREATORS.UPDATE_STAKING_REWARD,
    updateStakingRewardState: ACTION_CREATORS.UPDATE_VALIDATOR_STATE,
    updateValidatorsState: ACTION_CREATORS.UPDATE_VALIDATORS_STATE
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(ACTION_CREATORS.UPDATE_DELEGATE_STATE, (state, { payload }) => {
        state.delegate = payload;
    });
    builder.addCase(ACTION_CREATORS.UPDATE_STAKING_REWARD, (state, { payload }) => {
        state.validator = payload;
    });
    builder.addCase(ACTION_CREATORS.UPDATE_VALIDATOR_STATE, (state, { payload }) => {
        state.stakingReward = payload;
    });
    builder.addCase(ACTION_CREATORS.UPDATE_VALIDATORS_STATE, (state, { payload }) => {
        state.validators = payload;
    });
});

export default reducer;
