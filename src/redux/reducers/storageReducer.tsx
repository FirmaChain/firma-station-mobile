import { IKeyValue } from '@/constants/common';
import { createAction, createReducer } from '@reduxjs/toolkit';

import {
    HANDLE_CONTENT_VOLUME,
    HANDLE_CURRENCY,
    HANDLE_CW20_CONTRACTS,
    HANDLE_CW721_CONTRACTS,
    HANDLE_DAPP_SERVICES_VOLUME,
    HANDLE_FAVORITE,
    HANDLE_HISTORY_VOLUME,
    HANDLE_LAST_SELECTED_WALLET_INDEX,
    HANDLE_NETWORK,
    HANDLE_NOTIFICATION_ENABLED,
    HANDLE_NOTIFICATION_PERMISSION_PROMPTED,
    HANDLE_RECOVER_TYPE,
    HANDLE_VALIDATORS_PROFILE_INFO,
    ICWContractsState,
    IFavoriteState
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

interface IKeyValueForCWContract {
    [key: string]: ICWContractsState[];
}

export interface IStorageStateProps {
    currency: string;
    network: string;
    notificationEnabled: boolean;
    notificationPermissionPrompted: boolean;
    contentVolume: IContentVolume;
    historyVolume: IKeyValue<number>;
    dappServicesVolume: IKeyValue<number>;
    recoverType: IKeyValue<string>;
    validatorsProfile: IValidatorsProfileState;
    lastSelectedWalletIndex: number;
    favorite: IFavoriteState[];
    cw20Contracts: IKeyValueForCWContract;
    cw721Contracts: IKeyValueForCWContract;
}

const initialState: IStorageStateProps = {
    currency: 'USD',
    network: 'MainNet',
    notificationEnabled: false,
    notificationPermissionPrompted: false,
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
    favorite: [],
    cw20Contracts: {},
    cw721Contracts: {}
};

export const ACTION_CREATORS = {
    HANDLE_CURRENCY: createAction<string>(HANDLE_CURRENCY),
    HANDLE_NETWORK: createAction<string>(HANDLE_NETWORK),
    HANDLE_CONTENT_VOLUME: createAction<IContentVolume>(HANDLE_CONTENT_VOLUME),
    HANDLE_HISTORY_VOLUME: createAction<IKeyValue<number>>(HANDLE_HISTORY_VOLUME),
    HANDLE_DAPP_SERVICES_VOLUME: createAction<IKeyValue<number>>(HANDLE_DAPP_SERVICES_VOLUME),
    HANDLE_RECOVER_TYPE: createAction<IKeyValue<string>>(HANDLE_RECOVER_TYPE),
    HANDLE_VALIDATORS_PROFILE_INFO: createAction<IValidatorsProfileState>(HANDLE_VALIDATORS_PROFILE_INFO),
    HANDLE_LAST_SELECTED_WALLET_INDEX: createAction<number>(HANDLE_LAST_SELECTED_WALLET_INDEX),
    HANDLE_FAVORITE: createAction<IFavoriteState[]>(HANDLE_FAVORITE),
    HANDLE_NOTIFICATION_ENABLED: createAction<boolean>(HANDLE_NOTIFICATION_ENABLED),
    HANDLE_NOTIFICATION_PERMISSION_PROMPTED: createAction<boolean>(HANDLE_NOTIFICATION_PERMISSION_PROMPTED),
    HANDLE_CW20_CONTRACTS: createAction<IKeyValueForCWContract>(HANDLE_CW20_CONTRACTS),
    HANDLE_CW721_CONTRACTS: createAction<IKeyValueForCWContract>(HANDLE_CW721_CONTRACTS)
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
    handleFavorite: ACTION_CREATORS.HANDLE_FAVORITE,
    handleNotificationEnabled: ACTION_CREATORS.HANDLE_NOTIFICATION_ENABLED,
    handleNotificationPermissionPrompted: ACTION_CREATORS.HANDLE_NOTIFICATION_PERMISSION_PROMPTED,
    handleCW20Contracts: ACTION_CREATORS.HANDLE_CW20_CONTRACTS,
    handleCW721Contracts: ACTION_CREATORS.HANDLE_CW721_CONTRACTS
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
    builder.addCase(ACTION_CREATORS.HANDLE_NOTIFICATION_ENABLED, (state, { payload }) => {
        state.notificationEnabled = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_NOTIFICATION_PERMISSION_PROMPTED, (state, { payload }) => {
        state.notificationPermissionPrompted = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_FAVORITE, (state, { payload }) => {
        state.favorite = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_CW20_CONTRACTS, (state, { payload }) => {
        state.cw20Contracts = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_CW721_CONTRACTS, (state, { payload }) => {
        state.cw721Contracts = payload;
    });
});

export default reducer;
