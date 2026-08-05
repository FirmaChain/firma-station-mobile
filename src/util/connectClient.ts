import { CommonActions } from '@/redux/actions';
import { FirmaUtil } from '@firmachain/firma-js';
import { FirmaWalletService } from '@firmachain/firma-js/dist/sdk/FirmaWalletService';

import { ApiError, createApiClient, type ApiOptions } from './kyService';
import { getDAppConnectSession, setDAppConnectSession } from './wallet';

export interface UserSession {
    userkey: string;
}

export interface ProjectList {
    projectList: {
        name: string;
        description: string;
        url: string;
        icon: string;
        identity: string;
        cw721ContractAddress: string;
        cw20ContractAddress: string;
        serviceList: ServiceMetaData[];
    }[];
}

interface ResponseProjectData {
    projectList: {
        name: string;
        description: string;
        url: string;
        icon: string;
        identity: string;
        cw721ContractAddress: string;
        cw20ContractAddress: string;
        serviceList: ServiceMetaData[];
    }[];
}

interface ResponseQRData {
    qrType: number;
    signParams: SignParams;
    projectMetaData: ProjectMetaData;
}

interface ResponseDappQRData {
    project: {
        projectId: string;
        name: string;
        icon: string;
    };
    service: {
        serviceId: string;
        name: string;
        icon: string;
    };
}

interface ResponseAuthData {
    userkey: string;
}

export interface SignParams {
    message: string;
    signer: string;
    argument: {
        messageType?: string;
        name?: string;
        corpName?: string;
        fctPrice?: number;
        token?: {
            denom: string;
            amount: string | number;
            symbol: string;
        };
        [key: string]: unknown;
    };
    type: number;
    info: string;
}

export interface ProjectMetaData {
    projectId: string;
    name: string;
    description: string;
    url: string;
    icon: string;
}

export interface ServiceMetaData {
    serviceId: string;
    name: string;
    url: string;
    icon: string;
    isExternalBrowser: boolean;
}

export interface ServiceData {
    service: {
        serviceId: string;
        name: string;
        url: string;
        icon: string;
        isExternalBrowser: boolean;
    };
}

interface ResponseServiceData {
    service: {
        serviceId: string;
        name: string;
        url: string;
        icon: string;
        isExternalBrowser: boolean;
    };
}

export interface QRData {
    qrType: number;
    apiCode: string;
    requestKey: string;
    signParams: SignParams;
    projectMetaData: ProjectMetaData;
}

export interface DappQRData {
    project: {
        projectId: string;
        name: string;
        icon: string;
    };
    service: {
        serviceId: string;
        name: string;
        icon: string;
    };
}

interface ApproveParam {
    rawData: string;
    address: string;
    chainId: string;
}

interface RelayResponse<T> {
    code: number;
    result: T;
    message: string;
}

type CommonTxClient = ReturnType<typeof FirmaUtil.getCommonTxClient>;
type BroadcastTxRaw = Parameters<CommonTxClient['broadcast']>[0];

class ConnectClient {
    constructor(
        public relayHost: string,
        private requestService = new RequestService(relayHost)
    ) {}

    public async getProjects(): Promise<ProjectList> {
        try {
            const response: ResponseProjectData = await this.requestService.requestGet<ResponseProjectData>(
                '/v1/projects',
                {},
                { context: { disableProgress: true } }
            );

            return {
                projectList: response.projectList
            };
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public async getUserDappService(identity: string, serviceId: string): Promise<ServiceData> {
        try {
            const response: ResponseServiceData = await this.requestService.requestGet<ResponseServiceData>(
                `/v1/projects/dapps/${identity}/services/${serviceId}`
            );

            return {
                service: response.service
            };
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public async connectNewUser(): Promise<UserSession> {
        try {
            const response: ResponseAuthData = await this.requestService.requestPost<ResponseAuthData>('/v1/wallets/auth');

            return {
                userkey: response.userkey
            };
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public async getUserSession(walletKey: string): Promise<UserSession> {
        try {
            const result = await getDAppConnectSession(walletKey);

            const isSessionExist = result !== null;

            if (isSessionExist) return JSON.parse(result);

            const newKey = await this.connectNewUser();
            setDAppConnectSession(walletKey, JSON.stringify(newKey));

            return newKey;
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public async connectFromSession(session: UserSession): Promise<UserSession> {
        try {
            const response: ResponseAuthData = await this.requestService.requestPost<ResponseAuthData>('/v1/wallets/auth', {
                userkey: session.userkey
            });

            return {
                userkey: response.userkey
            };
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public isDappQR(qrcode: string) {
        return qrcode.includes('dapp://');
    }

    public async requestQRData(session: UserSession, QRCode: string, loadingRequestId?: string): Promise<QRData> {
        try {
            if (QRCode.split('://').length < 2) throw new Error('Invalid QR Format');

            const apiCode = QRCode.split('://')[0];
            const requestKey = QRCode.split('://')[1];

            if (apiCode === 'sign') {
                const response: ResponseQRData = await this.requestService.requestGet<ResponseQRData>(
                    `/v1/wallets/${apiCode}/${requestKey}`,
                    { userkey: session.userkey }
                );

                const qrType = response.qrType;
                const signParams = response.signParams;
                const projectMetaData = response.projectMetaData;

                return {
                    qrType,
                    apiCode,
                    requestKey,
                    signParams,
                    projectMetaData
                };
            } else {
                throw new Error('Invalid API Code');
            }
        } catch (e) {
            CommonActions.endLoadingProgress(loadingRequestId);
            throw ApiError.from(e);
        }
    }

    public async requestDappQRData(session: UserSession, QRCode: string): Promise<DappQRData> {
        try {
            if (QRCode.split('://').length < 2) throw new Error('Invalid QR Format');

            const apiCode = QRCode.split('://')[0];
            const requestKey = QRCode.split('://')[1];
            if (apiCode === 'dapp') {
                const response: ResponseDappQRData = await this.requestService.requestGet<ResponseDappQRData>(
                    `/v1/wallets/${apiCode}/${requestKey}`,
                    { userkey: session.userkey }
                );

                const project = response.project;
                const service = response.service;

                return {
                    project,
                    service
                };
            } else {
                throw new Error('Invalid API Code');
            }
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public async verifyConnectedWallet(address: string, QRData: QRData) {
        if (QRData.signParams.signer === '') return true;
        return address === QRData.signParams.signer;
    }

    public isDirectSign(QRData: QRData): boolean {
        return QRData.signParams.type === 1;
    }

    public async getArbitarySignRawData(wallet: FirmaWalletService, QRData: QRData): Promise<string> {
        try {
            const signatureResult = await FirmaUtil.experimentalAdr36Sign(wallet, QRData.signParams.message);
            const jsonString = JSON.stringify(signatureResult);

            return jsonString;
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public async getDirectSignRawData(wallet: FirmaWalletService, QRData: QRData) {
        try {
            const signDoc = FirmaUtil.parseSignDocValues(QRData.signParams.message);

            const address = await wallet.getAddress();

            const commonTxClient = FirmaUtil.getCommonTxClient(wallet);
            const extTxRaw = await commonTxClient.signDirectForSignDoc(address, signDoc);

            const valid = await FirmaUtil.verifyDirectSignature(address, extTxRaw.signature, signDoc);

            if (valid) {
                return extTxRaw;
            } else {
                throw new Error('Invalid Raw');
            }
        } catch (error) {
            throw ApiError.from(error);
        }
    }

    public async verifySign(session: UserSession, QRData: QRData, signature: string): Promise<boolean> {
        try {
            const response = await this.requestService.requestPut<{ isValid: boolean }>(
                `/v1/wallets/sign/${QRData.requestKey}`,
                { signature },
                {
                    userkey: session.userkey
                }
            );

            return response.isValid;
        } catch (e) {
            throw ApiError.from(e);
        }
    }

    public async broadcast(wallet: FirmaWalletService, txRaw: BroadcastTxRaw): Promise<string> {
        try {
            const commonTxClient = FirmaUtil.getCommonTxClient(wallet);
            const result = await commonTxClient.broadcast(txRaw);

            //? Prevent BigInt issue
            return JSON.stringify(result, (_, value) => {
                if (typeof value === 'bigint') return String(value);
                else return value;
            });
        } catch (e) {
            throw ApiError.from(e);
        }
    }

    public async approve(session: UserSession, QRData: QRData, approveParam: ApproveParam): Promise<Record<string, never>> {
        try {
            if (QRData.apiCode === 'sign') {
                await this.requestService.requestPut<unknown>(`/v1/wallets/${QRData.apiCode}/${QRData.requestKey}/approve`, approveParam, {
                    userkey: session.userkey
                });
                return {};
            } else {
                throw new Error('Invalid API Code');
            }
        } catch (e) {
            throw ApiError.from(e);
        }
    }

    public async reject(session: UserSession, QRData: QRData): Promise<Record<string, never>> {
        try {
            if (QRData.apiCode === 'sign') {
                await this.requestService.requestPut<unknown>(
                    `/v1/wallets/${QRData.apiCode}/${QRData.requestKey}/reject`,
                    {},
                    {
                        userkey: session.userkey
                    }
                );
                return {};
            } else {
                throw new Error('Invalid API Code');
            }
        } catch (e) {
            throw ApiError.from(e);
        }
    }
}

class RequestService {
    private readonly client;

    constructor(relay: string) {
        this.client = createApiClient(relay);
    }

    async requestPost<T = unknown>(uri: string, body: object = {}, headers: Record<string, string> = {}): Promise<T> {
        return this.unwrap(this.client.postJson<RelayResponse<T>>(uri, { headers, json: body }));
    }

    async requestPut<T = unknown>(uri: string, body: object = {}, headers: Record<string, string> = {}): Promise<T> {
        return this.unwrap(this.client.putJson<RelayResponse<T>>(uri, { headers, json: body }));
    }

    async requestGet<T = unknown>(uri: string, headers: Record<string, string> = {}, options?: ApiOptions): Promise<T> {
        return this.unwrap(this.client.getJson<RelayResponse<T>>(uri, { ...options, headers }));
    }

    private async unwrap<T>(request: Promise<RelayResponse<T>>): Promise<T> {
        const response = await request;

        if (response.code !== 0) throw ApiError.fromServer(response.message);

        return response.result;
    }
}

export default ConnectClient;
