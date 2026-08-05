import { IKeyValue } from '@/constants/common';

export const VERSION = '';
export const MAINTENANCE_API = '';
export const VALIDATORS_PROFILE_API = '';
export const CONTACT = '';

export const MAINTENANCE_PATH: IKeyValue = {
    MainNet: '',
    TestNet: '',
    DevNet: ''
};

interface ISampleChainNetworkState {
    FIRMACHAIN_CONFIG: string;
    AVERAGE_BLOCK_TIME: number;
    EXPLORER: string;
    GRAPHQL: string;
    RELAY_HOST: string;
    RESTAKE_API: string;
    RESTAKE_REWARD_API: string;
    RESTAKE_ADDRESS: string;
    RESTAKE_URL: string;
    CHAIN_SYMBOL: string;
    CHAIN_NAME_FOR_COINGECKO: string;
    BLOCKS_PER_YEAR: number;
    DEFAULT_MINT_INFLATION: number;
    PROPOSAL_JSON: string;
    WALLET_JSON: string;
}

export const CHAIN_NETWORK: IKeyValue<ISampleChainNetworkState> = {
    MainNet: {
        FIRMACHAIN_CONFIG: '',
        AVERAGE_BLOCK_TIME: 0,
        EXPLORER: '',
        GRAPHQL: '',
        RELAY_HOST: '',
        RESTAKE_API: '',
        RESTAKE_REWARD_API: '',
        RESTAKE_ADDRESS: '',
        RESTAKE_URL: '',
        CHAIN_SYMBOL: '',
        CHAIN_NAME_FOR_COINGECKO: '',
        BLOCKS_PER_YEAR: 0,
        DEFAULT_MINT_INFLATION: 0,
        PROPOSAL_JSON: '',
        WALLET_JSON: ''
    },
    TestNet: {
        FIRMACHAIN_CONFIG: '',
        AVERAGE_BLOCK_TIME: 0,
        EXPLORER: '',
        GRAPHQL: '',
        RELAY_HOST: '',
        RESTAKE_API: '',
        RESTAKE_REWARD_API: '',
        RESTAKE_ADDRESS: '',
        RESTAKE_URL: '',
        CHAIN_SYMBOL: '',
        CHAIN_NAME_FOR_COINGECKO: '',
        BLOCKS_PER_YEAR: 0,
        DEFAULT_MINT_INFLATION: 0,
        PROPOSAL_JSON: '',
        WALLET_JSON: ''
    },
    DevNet: {
        FIRMACHAIN_CONFIG: '',
        AVERAGE_BLOCK_TIME: 0,
        EXPLORER: '',
        GRAPHQL: '',
        RELAY_HOST: '',
        RESTAKE_API: '',
        RESTAKE_REWARD_API: '',
        RESTAKE_ADDRESS: '',
        RESTAKE_URL: '',
        CHAIN_SYMBOL: '',
        CHAIN_NAME_FOR_COINGECKO: '',
        BLOCKS_PER_YEAR: 0,
        DEFAULT_MINT_INFLATION: 0,
        PROPOSAL_JSON: '',
        WALLET_JSON: ''
    }
};

export const COINGECKO = '';

export const WALLET_LIST = '';
export const USE_BIO_AUTH = '';
export const USE_APP_LOCK = '';
export const CONNECT_SESSION = '';
export const CONNECT_ID_LIST = '';
export const DAPPS_SERVICE_IDENTITY = '';

export const GUIDE_URI: IKeyValue = {
    newWallet: '',
    selectWallet: '',
    recoverWallet: '',

    setting: '',
    changeWalletName: '',
    changePassword: '',
    exportmn: '',
    exportpk: '',

    wallet: '',
    send: '',
    history: '',

    staking: '',
    delegate: '',
    redelegate: '',
    undelegate: '',
    restake: '',

    governance: '',

    useBioAuth: '',
    deleteWallet: '',
    withdraw: '',
    withdrawAll: '',

    dapps: ''
};

export const NOTARY_URI = '';

export const RELEASE_STORE_PASSWORD = '';
export const RELEASE_KEY_PASSWORD = '';
