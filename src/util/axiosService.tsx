import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { CommonActions } from '@/redux/actions';
import { getRandomKey } from './keystore';

interface IAxiosRequestConfig extends AxiosRequestConfig {
    requestId?: string;
    disableProgress?: boolean;
}

interface IAxiosInstance extends AxiosInstance {
    request<T = any, R = AxiosResponse<T, any>, D = any>(config: AxiosRequestConfig): Promise<R>;
    get<T = any, R = AxiosResponse<T, any>, D = any>(url: string, config?: IAxiosRequestConfig | undefined): Promise<R>;
    post<T = any, R = AxiosResponse<T, any>, D = any>(
        url: string,
        data?: D | undefined,
        config?: IAxiosRequestConfig | undefined
    ): Promise<R>;
    delete<T = any, R = AxiosResponse<T, any>, D = any>(url: string, config?: IAxiosRequestConfig | undefined): Promise<R>;
    put<T = any, R = AxiosResponse<T, any>, D = any>(
        url: string,
        data?: D | undefined,
        config?: IAxiosRequestConfig | undefined
    ): Promise<R>;
}

export const _axios: IAxiosInstance = axios.create();

_axios.interceptors.request.use(
    (config: IAxiosRequestConfig) => {
        if (!config.disableProgress) {
            config.requestId = getRandomKey();
            CommonActions.setRequestId(config.requestId);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

_axios.interceptors.response.use(
    (response) => {
        const config: IAxiosRequestConfig = response.config;
        config.requestId && CommonActions.clearRequestId(config.requestId);
        return response;
    },
    (error) => {
        const config: IAxiosRequestConfig = error.config;
        config.requestId && CommonActions.clearRequestId(config.requestId);
        return Promise.reject(error);
    }
);

export default _axios;
