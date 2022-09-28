import { IKeyValue } from '@/constants/common';
import { IContentVolume } from '../reducers/storageReducer';
import { HANDLE_CURRENCY, HANDLE_NETWORK, HANDLE_CONTENT_VOLUME, HANDLE_HISTORY_VOLUME, HANDLE_DAPP_SERVICES_VOLUME } from '../types';

export const handleCurrency = (currency: string) => ({
    type: HANDLE_CURRENCY,
    payload: currency
});

export const handleNetwork = (network: string) => ({
    type: HANDLE_NETWORK,
    payload: network
});

export const handleContentVolume = (volumes: IContentVolume) => ({
    type: HANDLE_CONTENT_VOLUME,
    payload: { ...volumes }
});

export const handleHistoryVolume = (volumes: IKeyValue) => ({
    type: HANDLE_HISTORY_VOLUME,
    payload: { ...volumes }
});

export const handleDappServicesVolume = (volumes: IKeyValue) => ({
    type: HANDLE_DAPP_SERVICES_VOLUME,
    payload: { ...volumes }
});
