import { createAction, createReducer } from '@reduxjs/toolkit';
import {
    HANDLE_RESET_MODAL,
    HANDLE_MODAL_DATA,
    HANDLE_DAPP_DATA,
    VALIDATION_MODAL,
    QR_SCANNER_MODAL,
    DAPP_CONNECT_MODAL,
    DAPP_SIGN_MODAL,
    DAPP_DIRECT_SIGN_MODAL,
    DAPP_SERVICE_REG_MODAL,
    FAVORITE_MODAL,
    FAVORITE_CREATE_MODAL,
    HANDLE_FAVORITE_DATA
} from '../types';

export interface IModalStateProps {
    modalData: any;
    dappData: any;
    favoriteData: any;
    validationModal: boolean;
    favoriteModal: boolean;
    favoriteCreateModal: boolean;
    qrScannerModal: boolean;
    dappConnectModal: boolean;
    dappSignModal: boolean;
    dappDirectSignModal: boolean;
    dappServiceRegModal: boolean;
}

const initialState: IModalStateProps = {
    modalData: null,
    dappData: null,
    favoriteData: null,
    validationModal: false,
    favoriteModal: false,
    favoriteCreateModal: false,
    qrScannerModal: false,
    dappConnectModal: false,
    dappSignModal: false,
    dappDirectSignModal: false,
    dappServiceRegModal: false
};

export const ACTION_CREATORS = {
    HANDLE_RESET_MODAL: createAction<any>(HANDLE_RESET_MODAL),
    HANDLE_MODAL_DATA: createAction<any>(HANDLE_MODAL_DATA),
    HANDLE_DAPP_DATA: createAction<any>(HANDLE_DAPP_DATA),
    HANDLE_FAVORITE_DATA: createAction<any>(HANDLE_FAVORITE_DATA),
    VALIDATION_MODAL: createAction<boolean>(VALIDATION_MODAL),
    FAVORITE_MODAL: createAction<boolean>(FAVORITE_MODAL),
    FAVORITE_CREATE_MODAL: createAction<boolean>(FAVORITE_CREATE_MODAL),
    QR_SCANNER_MODAL: createAction<boolean>(QR_SCANNER_MODAL),
    DAPP_CONNECT_MODAL: createAction<boolean>(DAPP_CONNECT_MODAL),
    DAPP_SIGN_MODAL: createAction<boolean>(DAPP_SIGN_MODAL),
    DAPP_DIRECT_SIGN_MODAL: createAction<boolean>(DAPP_DIRECT_SIGN_MODAL),
    DAPP_SERVICE_REG_MODAL: createAction<boolean>(DAPP_SERVICE_REG_MODAL)
};

export const ACTIONS = {
    handleResetModal: ACTION_CREATORS.HANDLE_RESET_MODAL,
    handleModalData: ACTION_CREATORS.HANDLE_MODAL_DATA,
    handleDAppData: ACTION_CREATORS.HANDLE_DAPP_DATA,
    handleFavoriteData: ACTION_CREATORS.HANDLE_FAVORITE_DATA,
    handleValidationModal: ACTION_CREATORS.VALIDATION_MODAL,
    handleFavoriteModal: ACTION_CREATORS.FAVORITE_MODAL,
    handleFavoriteCreateModal: ACTION_CREATORS.FAVORITE_CREATE_MODAL,
    handleQRScannerModal: ACTION_CREATORS.QR_SCANNER_MODAL,
    handleDAppConnectModal: ACTION_CREATORS.DAPP_CONNECT_MODAL,
    handleDAppSignModal: ACTION_CREATORS.DAPP_SIGN_MODAL,
    handleDAppDirectSignModal: ACTION_CREATORS.DAPP_DIRECT_SIGN_MODAL,
    handleDAppServiceRegistModal: ACTION_CREATORS.DAPP_SERVICE_REG_MODAL
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(ACTION_CREATORS.HANDLE_RESET_MODAL, (state, { payload }) => {
        (state.modalData = null), (state.dappData = null);
    });
    builder.addCase(ACTION_CREATORS.HANDLE_MODAL_DATA, (state, { payload }) => {
        state.modalData = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_DAPP_DATA, (state, { payload }) => {
        state.dappData = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_FAVORITE_DATA, (state, { payload }) => {
        state.favoriteData = payload;
    });
    builder.addCase(ACTION_CREATORS.VALIDATION_MODAL, (state, { payload }) => {
        state.validationModal = payload;
    });
    builder.addCase(ACTION_CREATORS.FAVORITE_MODAL, (state, { payload }) => {
        state.favoriteModal = payload;
    });
    builder.addCase(ACTION_CREATORS.FAVORITE_CREATE_MODAL, (state, { payload }) => {
        state.favoriteCreateModal = payload;
    });
    builder.addCase(ACTION_CREATORS.QR_SCANNER_MODAL, (state, { payload }) => {
        state.qrScannerModal = payload;
    });
    builder.addCase(ACTION_CREATORS.DAPP_CONNECT_MODAL, (state, { payload }) => {
        state.dappConnectModal = payload;
    });
    builder.addCase(ACTION_CREATORS.DAPP_SIGN_MODAL, (state, { payload }) => {
        state.dappSignModal = payload;
    });
    builder.addCase(ACTION_CREATORS.DAPP_DIRECT_SIGN_MODAL, (state, { payload }) => {
        state.dappDirectSignModal = payload;
    });
    builder.addCase(ACTION_CREATORS.DAPP_SERVICE_REG_MODAL, (state, { payload }) => {
        state.dappServiceRegModal = payload;
    });
});

export default reducer;
