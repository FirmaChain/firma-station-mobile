import { IKeyValue } from '@/constants/common';
import { createAction, createReducer } from '@reduxjs/toolkit';
import {
    HANDLE_CURRENCY,
    HANDLE_NETWORK,
    HANDLE_CONTENT_VOLUME,
    HANDLE_HISTORY_VOLUME,
    HANDLE_DAPP_SERVICES_VOLUME,
    HANDLE_RECOVER_TYPE,
    HANDLE_VALIDATORS_PROFILE_INFO,
    HANDLE_LAST_SELECTED_WALLET_INDEX,
    IFavoriteState,
    HANDLE_FAVORITE
} from '../types';

export interface IContentVolume {
    proposals: number | null;
    dapps: number | null;
}

export interface IValidatorProfileInfo {
    operatorAddress: string;
    url: string;
}

export interface IValidatorsProfileState {
    profileInfos: Array<IValidatorProfileInfo> | [];
    lastUpdatedTime: number;
}

export interface IStorageStateProps {
    currency: string;
    network: string;
    contentVolume: IContentVolume;
    historyVolume: IKeyValue;
    dappServicesVolume: IKeyValue;
    recoverType: IKeyValue;
    validatorsProfile: IValidatorsProfileState;
    lastSelectedWalletIndex: number;
    favorite: IFavoriteState[];
}

const initialState: IStorageStateProps = {
    currency: 'USD',
    network: 'MainNet',
    contentVolume: {
        proposals: null,
        dapps: null
    },
    historyVolume: {},
    dappServicesVolume: {},
    recoverType: {},
    validatorsProfile: {
        profileInfos: [],
        lastUpdatedTime: 0
    },
    lastSelectedWalletIndex: -1,
    favorite: []
};

export const ACTION_CREATORS = {
    HANDLE_CURRENCY: createAction<string>(HANDLE_CURRENCY),
    HANDLE_NETWORK: createAction<string>(HANDLE_NETWORK),
    HANDLE_CONTENT_VOLUME: createAction<IContentVolume>(HANDLE_CONTENT_VOLUME),
    HANDLE_HISTORY_VOLUME: createAction<IKeyValue>(HANDLE_HISTORY_VOLUME),
    HANDLE_DAPP_SERVICES_VOLUME: createAction<IKeyValue>(HANDLE_DAPP_SERVICES_VOLUME),
    HANDLE_RECOVER_TYPE: createAction<IKeyValue>(HANDLE_RECOVER_TYPE),
    HANDLE_VALIDATORS_PROFILE_INFO: createAction<IValidatorsProfileState>(HANDLE_VALIDATORS_PROFILE_INFO),
    HANDLE_LAST_SELECTED_WALLET_INDEX: createAction<number>(HANDLE_LAST_SELECTED_WALLET_INDEX),
    HANDLE_FAVORITE: createAction<IFavoriteState[]>(HANDLE_FAVORITE)
};

export const ACTIONS = {
    handleCurrency: ACTION_CREATORS.HANDLE_CURRENCY,
    handleNetwork: ACTION_CREATORS.HANDLE_NETWORK,
    handleContentVolume: ACTION_CREATORS.HANDLE_CONTENT_VOLUME,
    handleHistoryVolume: ACTION_CREATORS.HANDLE_HISTORY_VOLUME,
    handleDappServicesVolume: ACTION_CREATORS.HANDLE_DAPP_SERVICES_VOLUME,
    handleRecoverType: ACTION_CREATORS.HANDLE_RECOVER_TYPE,
    handleValidatorsProfile: ACTION_CREATORS.HANDLE_VALIDATORS_PROFILE_INFO,
    handleLastSelectedWalletIndex: ACTION_CREATORS.HANDLE_LAST_SELECTED_WALLET_INDEX,
    handleFavorite: ACTION_CREATORS.HANDLE_FAVORITE
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(ACTION_CREATORS.HANDLE_CURRENCY, (state, { payload }) => {
        state.currency = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_NETWORK, (state, { payload }) => {
        state.network = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_CONTENT_VOLUME, (state, { payload }) => {
        state.contentVolume = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_HISTORY_VOLUME, (state, { payload }) => {
        state.historyVolume = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_DAPP_SERVICES_VOLUME, (state, { payload }) => {
        state.dappServicesVolume = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_RECOVER_TYPE, (state, { payload }) => {
        state.recoverType = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_VALIDATORS_PROFILE_INFO, (state, { payload }) => {
        state.validatorsProfile = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_LAST_SELECTED_WALLET_INDEX, (state, { payload }) => {
        state.lastSelectedWalletIndex = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_FAVORITE, (state, { payload }) => {
        state.favorite = payload;
    });
});

export default reducer;
