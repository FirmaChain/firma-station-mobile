import { bindActionCreators } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { store } from './store';
import { ACTIONS as commonActions } from './reducers/commonReducer';
import { ACTIONS as modalActions } from './reducers/modalReducer';
import { ACTIONS as stakingActions } from './reducers/stakingReducer';
import { ACTIONS as storageActions } from './reducers/storageReducer';
import { ACTIONS as walletActions } from './reducers/walletReducer';

const { dispatch } = store;

declare module 'redux' {
    export function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
        actionCreators: M,
        dispatch: Dispatch
    ): {
        [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
            ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
            : M[N];
    };
}

export const CommonActions = bindActionCreators(commonActions, dispatch);
export const ModalActions = bindActionCreators(modalActions, dispatch);
export const StakingActions = bindActionCreators(stakingActions, dispatch);
export const StorageActions = bindActionCreators(storageActions, dispatch);
export const WalletActions = bindActionCreators(walletActions, dispatch);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
