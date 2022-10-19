import {
    Action,
    HANDLE_RESET_MODAL,
    HANDLE_MODAL_DATA,
    HANDLE_DAPP_DATA,
    VALIDATION_MODAL,
    QR_SCANNER_MODAL,
    DAPP_CONNECT_MODAL,
    DAPP_SIGN_MODAL,
    DAPP_DIRECT_SIGN_MODAL,
    DAPP_SERVICE_REG_MODAL
} from '../types';

export interface IState {
    modalData: any;
    dappData: any;
    validationModal: boolean;
    qrScannerModal: boolean;
    dappConnectModal: boolean;
    dappSignModal: boolean;
    dappDirectSignModal: boolean;
    dappServiceRegModal: boolean;
}

const initialState = {
    modalData: null,
    dappData: null,
    validationModal: false,
    qrScannerModal: false,
    dappConnectModal: false,
    dappSignModal: false,
    dappDirectSignModal: false,
    dappServiceRegModal: false
};

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case HANDLE_RESET_MODAL:
            return {
                ...initialState
            };
        case HANDLE_MODAL_DATA:
            return {
                ...state,
                modalData: action.payload
            };
        case HANDLE_DAPP_DATA:
            return {
                ...state,
                dappData: action.payload
            };
        case VALIDATION_MODAL:
            return {
                ...state,
                validationModal: action.payload
            };
        case QR_SCANNER_MODAL:
            return {
                ...state,
                qrScannerModal: action.payload
            };
        case DAPP_CONNECT_MODAL:
            return {
                ...state,
                dappConnectModal: action.payload
            };
        case DAPP_SIGN_MODAL:
            return {
                ...state,
                dappSignModal: action.payload
            };
        case DAPP_DIRECT_SIGN_MODAL:
            return {
                ...state,
                dappDirectSignModal: action.payload
            };
        case DAPP_SERVICE_REG_MODAL:
            return {
                ...state,
                dappServiceRegModal: action.payload
            };
        default:
            return state;
    }
};

export default reducer;
