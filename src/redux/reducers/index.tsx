import { combineReducers } from '@reduxjs/toolkit';
import commonReducer, { ICommonStateProps } from './commonReducer';
import modalReducer, { IModalStateProps } from './modalReducer';
import stakingReducer, { IStakingStateProps } from './stakingReducer';
import storageReducer, { IStorageStateProps } from './storageReducer';
import walletReducer, { IWalletStateProps } from './walletReducer';

export interface rootState {
    common: ICommonStateProps;
    modal: IModalStateProps;
    staking: IStakingStateProps;
    storage: IStorageStateProps;
    wallet: IWalletStateProps;
}

const reducer = combineReducers({
    common: commonReducer,
    modal: modalReducer,
    staking: stakingReducer,
    storage: storageReducer,
    wallet: walletReducer,
});

export type RootReducerState = ReturnType<typeof reducer>;
export type CommonReducerState = ReturnType<typeof commonReducer>;
export type ModalReducerState = ReturnType<typeof modalReducer>;
export type StakingReducerState = ReturnType<typeof stakingReducer>;
export type StorageReducerState = ReturnType<typeof storageReducer>;
export type WalletReducerState = ReturnType<typeof walletReducer>;

export default reducer;
