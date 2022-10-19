import { IKeyValue } from '@/constants/common';
import {
    Action,
    HANDLE_CURRENCY,
    HANDLE_NETWORK,
    HANDLE_CONTENT_VOLUME,
    HANDLE_HISTORY_VOLUME,
    HANDLE_DAPP_SERVICES_VOLUME
} from '../types';

export interface IContentVolume {
    proposals: number | null;
    dapps: number | null;
}

export interface IState {
    currency: string;
    network: string;
    contentVolume: IContentVolume;
    historyVolume: IKeyValue;
    dappServicesVolume: IKeyValue;
}

const initialState = {
    currency: 'USD',
    network: 'MainNet',
    contentVolume: {
        proposals: null,
        dapps: null
    },
    historyVolume: {},
    dappServicesVolume: {}
};

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case HANDLE_CURRENCY:
            return {
                ...state,
                currency: action.payload
            };
        case HANDLE_NETWORK:
            return {
                ...state,
                network: action.payload
            };
        case HANDLE_CONTENT_VOLUME:
            return {
                ...state,
                contentVolume: action.payload
            };
        case HANDLE_HISTORY_VOLUME:
            return {
                ...state,
                historyVolume: action.payload
            };
        case HANDLE_DAPP_SERVICES_VOLUME:
            return {
                ...state,
                dappServicesVolume: action.payload
            };
        default:
            return state;
    }
};

export default reducer;
