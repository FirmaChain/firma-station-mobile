import { getRandomKey } from '@/util/keystore';
import { bindActionCreators, type ActionCreatorsMapObject, type Dispatch } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import { ACTIONS as commonActions } from './reducers/commonReducer';
import { ACTIONS as modalActions } from './reducers/modalReducer';
import { ACTIONS as stakingActions } from './reducers/stakingReducer';
import { ACTIONS as storageActions } from './reducers/storageReducer';
import { ACTIONS as walletActions } from './reducers/walletReducer';
import { store } from './store';

const { dispatch } = store;
const boundCommonActions = bindActionCreators(commonActions, dispatch);

const beginLoadingProgress = () => {
    const requestId = getRandomKey();
    boundCommonActions.setRequestId(requestId);
    return requestId;
};

const endLoadingProgress = (requestId?: string | null) => {
    if (requestId) {
        boundCommonActions.clearRequestId(requestId);
    }
};

declare module 'redux' {
    // FIXME: Redux's ambient overload contract requires the library's any-based action map type.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
        actionCreators: M,
        dispatch: Dispatch
    ): {
        // FIXME: Redux thunk overloads use any-based generic positions in the upstream contract.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
            ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
            : M[N];
    };
}

export const CommonActions = {
    ...boundCommonActions,
    beginLoadingProgress,
    endLoadingProgress
};
export const ModalActions = bindActionCreators(modalActions, dispatch);
export const StakingActions = bindActionCreators(stakingActions, dispatch);
export const StorageActions = bindActionCreators(storageActions, dispatch);
export const WalletActions = bindActionCreators(walletActions, dispatch);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
