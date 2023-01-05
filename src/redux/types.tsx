export type Action = {
    type: string;
    payload?: any;
};
// common
export const APP_STATE = 'APP_STATE';
export const MAINTENANCE_STATE = 'MAINTENANCE_STATE';
export const CURRENT_APP_VERSION = 'CURRENT_APP_VERSION';
export const CHAIN_VERSION = 'CHAIN_VERSION';
export const SDK_VERSION = 'SDK_VERSION';
export const SET_REQUEST_ID = 'SET_REQUEST_ID';
export const CLEAR_REQUEST_ID = 'CLEAR_REQUEST_ID';
export const APP_PAUSED_TIME = 'APP_PAUSED_TIME';
export const LOCK_STATION = 'LOCK_STATION';
export const HANDLE_LOADING_PROGRESS = 'HANDLE_LOADING_PROGRESS';
export const HANDLE_SCROLL_TO_TOP = 'HANDLE_SCROLL_TO_TOP';
export const HANDLE_NETWORK_CHANGE_ACTIVATE = 'HANDLE_NETWORK_CHANGE_ACTIVATE';
export const IS_BIOAUTH_IN_PROGRESS = 'IS_BIOAUTH_IN_PROGRESS';
export const IS_NETWORK_CHANGED = 'IS_NETWORK_CHANGED';
export const IS_CONNECTION = 'IS_CONNECTION';
export const LOGGEDIN = 'LOGGEDIN';
export const DATA_LOAD_STATUS = 'DATA_LOAD_STATUS';

// modal
export const HANDLE_RESET_MODAL = 'RESET_MODAL';
export const HANDLE_MODAL_DATA = 'MODAL_DATA';
export const HANDLE_DAPP_DATA = 'HANDLE_DAPP_DATA';
export const VALIDATION_MODAL = 'VALIDATION_MODAL';
export const QR_SCANNER_MODAL = 'QR_SCANNER_MODAL';
export const DAPP_CONNECT_MODAL = 'DAPP_CONNECT_MODAL';
export const DAPP_SIGN_MODAL = 'DAPP_SIGN_MODAL';
export const DAPP_DIRECT_SIGN_MODAL = 'DAPP_DIRECT_SIGN_MODAL';
export const DAPP_SERVICE_REG_MODAL = 'DAPP_SERVICE_REG_MODAL';

// staking
export const UPDATE_DELEGATE_STATE = 'UPDATE_DELEGATE_STATE';
export const UPDATE_VALIDATOR_STATE = 'UPDATE_VALIDATOR_STATE';
export const UPDATE_STAKING_REWARD = 'UPDATE_STAKING_REWARD';

// wallet
export const HANDLE_DST_ADDRESS = 'HANDLE_DST_ADDRESS';
export const HANDLE_WALLET_ADDRESS = 'HANDLE_WALLET_ADDRESS';
export const HANDLE_WALLET_NAME = 'HANDLE_WALLET_NAME';

// storage
export const HANDLE_CURRENCY = 'HANDLE_CURRENCY';
export const HANDLE_NETWORK = 'HANDLE_NETWORK';
export const HANDLE_CONTENT_VOLUME = 'HANDLE_CONTENT_VOLUME';
export const HANDLE_HISTORY_VOLUME = 'HANDLE_HISTORY_VOLUME';
export const HANDLE_DAPP_SERVICES_VOLUME = 'HANDLE_DAPP_SERVICES_VOLUME';
export const HANDLE_RECOVER_TYPE = 'HANDLE_RECOVER_TYPE';
export const HANDLE_VALIDATORS_PROFILE_INFO = 'HANDLE_VALIDATORS_PROFILE_INFO';
export const HANDLE_LAST_SELECTED_WALLET_INDEX = 'HANDLE_LAST_SELECTED_WALLET_INDEX';
