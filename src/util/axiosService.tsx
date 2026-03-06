// axios.ts
import { CommonActions } from '@/redux/actions';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { getRandomKey } from './keystore';

// Extend axios types globally (module augmentation)
declare module 'axios' {
    interface AxiosRequestConfig {
        requestId?: string;
        disableProgress?: boolean;
    }

    interface InternalAxiosRequestConfig {
        requestId?: string;
        disableProgress?: boolean;
    }
}

// You can keep using AxiosInstance as is
export const _axios: AxiosInstance = axios.create({
    timeout: 30000 // 30 second default timeout
    // adapter: undefined, // Not needed; axios 1.x selects default adapter itself
});

// request interceptor
_axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // do not touch when progress disabled
        if (!config.disableProgress) {
            config.requestId = getRandomKey();
            CommonActions.setRequestId(config.requestId);
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// response interceptor
_axios.interceptors.response.use(
    (response: AxiosResponse) => {
        // config is InternalAxiosRequestConfig at runtime
        const config = response.config as InternalAxiosRequestConfig;

        if (config.requestId) {
            CommonActions.clearRequestId(config.requestId);
        }

        return response;
    },
    (error: AxiosError) => {
        // error.config can be undefined
        const config = error.config as InternalAxiosRequestConfig | undefined;

        if (config?.requestId) {
            CommonActions.clearRequestId(config.requestId);
        }

        return Promise.reject(error);
    }
);

export default _axios;
