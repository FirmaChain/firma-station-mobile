export interface IFirmaChainConfig {
    readonly chainID: string;
    readonly rpcAddress: string;
    readonly restApiAddress: string;
    readonly ipfsNodeAddress: string;
    readonly ipfsNodePort: number;
    readonly ipfsWebApiAddress: string;
    readonly hdPath: string;
    readonly prefix: string;
    readonly denom: string;
    readonly defaultFee: number;
    readonly defaultGas: number;
    readonly isShowLog: boolean;
}

export interface IChainNetworkState {
    readonly MAINTENANCE_URL: string;
    readonly FIRMACHAIN_CONFIG: IFirmaChainConfig;
    readonly AVERAGE_BLOCK_TIME: number;
    readonly EXPLORER: string;
    readonly GRAPHQL: string;
    readonly RELAY_HOST: string;
    readonly RESTAKE_API: string;
    readonly RESTAKE_REWARD_API: string;
    readonly RESTAKE_ADDRESS: string;
    readonly RESTAKE_URL: string;
    readonly BLOCKS_PER_YEAR: number;
    readonly DEFAULT_MINT_INFLATION: number;
    readonly PROPOSAL_JSON: string;
    readonly WALLET_JSON: string;
}

export interface IChainNetworkConfig {
    readonly [network: string]: IChainNetworkState;
    readonly MainNet: IChainNetworkState;
    readonly TestNet: IChainNetworkState;
    readonly DevNet: IChainNetworkState;
}

export interface IMaintenancePath {
    readonly [network: string]: string;
    readonly MainNet: string;
    readonly TestNet: string;
    readonly DevNet: string;
}

export interface IGuideUri {
    readonly [key: string]: string;
    readonly newWallet: string;
    readonly selectWallet: string;
    readonly recoverWallet: string;
    readonly setting: string;
    readonly changeWalletName: string;
    readonly changePassword: string;
    readonly exportmn: string;
    readonly exportpk: string;
    readonly wallet: string;
    readonly send: string;
    readonly history: string;
    readonly staking: string;
    readonly delegate: string;
    readonly redelegate: string;
    readonly undelegate: string;
    readonly restake: string;
    readonly governance: string;
    readonly useBioAuth: string;
    readonly deleteWallet: string;
    readonly withdraw: string;
    readonly withdrawAll: string;
    readonly dapps: string;
}

export interface IBCConfig {
    readonly [key: string]: IBCConfigState;
}

export interface IBCConfigState {
    readonly enable: boolean;
    readonly displayName: string;
    readonly denom: string;
    readonly decimal: number;
    readonly icon: string;
    readonly link: string;
    readonly chainName: string;
}

export interface IBCChainState {
    readonly channel: string;
    readonly name: string;
}

export interface IBCSendChainConfig {
    readonly [key: string]: IBCChainState[];
}
