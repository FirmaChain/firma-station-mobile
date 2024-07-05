import { createAction, createReducer } from '@reduxjs/toolkit';
import {
    APP_STATE,
    MAINTENANCE_STATE,
    CURRENT_APP_VERSION,
    CHAIN_VERSION,
    SDK_VERSION,
    SET_REQUEST_ID,
    CLEAR_REQUEST_ID,
    APP_PAUSED_TIME,
    LOCK_STATION,
    HANDLE_LOADING_PROGRESS,
    HANDLE_SCROLL_TO_TOP,
    HANDLE_NETWORK_CHANGE_ACTIVATE,
    IS_BIOAUTH_IN_PROGRESS,
    IS_NETWORK_CHANGED,
    IS_CONNECTION,
    LOGGEDIN,
    DATA_LOAD_STATUS
} from '../types';

export interface ICommonStateProps {
    appState: string;
    maintenanceState: boolean;
    currentAppVer: string;
    chainVer: string;
    sdkVer: string;
    requestIds: string[];
    appPausedTime: string;
    lockStation: boolean;
    loading: boolean;
    scrollToTop: boolean;
    networkChangeActivate: boolean;
    isBioAuthInProgress: boolean;
    isNetworkChanged: boolean;
    connect: boolean;
    loggedIn: boolean;
    dataLoadStatus: number;
}

const initialState: ICommonStateProps = {
    appState: 'active',
    maintenanceState: true,
    currentAppVer: '',
    chainVer: '',
    sdkVer: '',
    requestIds: [],
    appPausedTime: '',
    lockStation: false,
    loading: false,
    scrollToTop: false,
    networkChangeActivate: false,
    isBioAuthInProgress: false,
    isNetworkChanged: false,
    connect: true,
    loggedIn: false,
    dataLoadStatus: 0
};

export const ACTION_CREATORS = {
    APP_STATE: createAction<string>(APP_STATE),
    MAINTENANCE_STATE: createAction<boolean>(MAINTENANCE_STATE),
    CURRENT_APP_VERSION: createAction<string>(CURRENT_APP_VERSION),
    CHAIN_VERSION: createAction<string>(CHAIN_VERSION),
    SDK_VERSION: createAction<string>(SDK_VERSION),
    SET_REQUEST_ID: createAction<string>(SET_REQUEST_ID),
    CLEAR_REQUEST_ID: createAction<string>(CLEAR_REQUEST_ID),
    APP_PAUSED_TIME: createAction<string>(APP_PAUSED_TIME),
    LOCK_STATION: createAction<boolean>(LOCK_STATION),
    HANDLE_LOADING_PROGRESS: createAction<boolean>(HANDLE_LOADING_PROGRESS),
    HANDLE_SCROLL_TO_TOP: createAction<boolean>(HANDLE_SCROLL_TO_TOP),
    HANDLE_NETWORK_CHANGE_ACTIVATE: createAction<boolean>(HANDLE_NETWORK_CHANGE_ACTIVATE),
    IS_BIOAUTH_IN_PROGRESS: createAction<boolean>(IS_BIOAUTH_IN_PROGRESS),
    IS_NETWORK_CHANGED: createAction<boolean>(IS_NETWORK_CHANGED),
    IS_CONNECTION: createAction<boolean>(IS_CONNECTION),
    LOGGEDIN: createAction<boolean>(LOGGEDIN),
    DATA_LOAD_STATUS: createAction<number>(DATA_LOAD_STATUS)
};

export const ACTIONS = {
    handleAppState: ACTION_CREATORS.APP_STATE,
    handleMaintenanceState: ACTION_CREATORS.MAINTENANCE_STATE,
    handleCurrentAppVer: ACTION_CREATORS.CURRENT_APP_VERSION,
    handleChainVer: ACTION_CREATORS.CHAIN_VERSION,
    handleSDKVer: ACTION_CREATORS.SDK_VERSION,
    setRequestId: ACTION_CREATORS.SET_REQUEST_ID,
    clearRequestId: ACTION_CREATORS.CLEAR_REQUEST_ID,
    handleAppPausedTime: ACTION_CREATORS.APP_PAUSED_TIME,
    handleLockStation: ACTION_CREATORS.LOCK_STATION,
    handleLoadingProgress: ACTION_CREATORS.HANDLE_LOADING_PROGRESS,
    handleScrollToTop: ACTION_CREATORS.HANDLE_SCROLL_TO_TOP,
    handleNetworkChangeActivate: ACTION_CREATORS.HANDLE_NETWORK_CHANGE_ACTIVATE,
    handleBioAuthInProgress: ACTION_CREATORS.IS_BIOAUTH_IN_PROGRESS,
    handleIsNetworkChange: ACTION_CREATORS.IS_NETWORK_CHANGED,
    handleIsConnection: ACTION_CREATORS.IS_CONNECTION,
    handleLoggedIn: ACTION_CREATORS.LOGGEDIN,
    handleDataLoadStatus: ACTION_CREATORS.DATA_LOAD_STATUS
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(ACTION_CREATORS.APP_STATE, (state, { payload }) => {
        state.appState = payload;
    });
    builder.addCase(ACTION_CREATORS.MAINTENANCE_STATE, (state, { payload }) => {
        state.maintenanceState = payload;
    });
    builder.addCase(ACTION_CREATORS.CURRENT_APP_VERSION, (state, { payload }) => {
        state.currentAppVer = payload;
    });
    builder.addCase(ACTION_CREATORS.CHAIN_VERSION, (state, { payload }) => {
        state.chainVer = payload;
    });
    builder.addCase(ACTION_CREATORS.SDK_VERSION, (state, { payload }) => {
        state.sdkVer = payload;
    });
    builder.addCase(ACTION_CREATORS.SET_REQUEST_ID, (state, { payload }) => {
        state.requestIds.push(payload);
    });
    builder.addCase(ACTION_CREATORS.CLEAR_REQUEST_ID, (state, { payload }) => {
        state.requestIds = state.requestIds.filter((v) => v !== payload);
    });
    builder.addCase(ACTION_CREATORS.APP_PAUSED_TIME, (state, { payload }) => {
        state.appPausedTime = payload;
    });
    builder.addCase(ACTION_CREATORS.LOCK_STATION, (state, { payload }) => {
        state.lockStation = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_LOADING_PROGRESS, (state, { payload }) => {
        state.loading = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_SCROLL_TO_TOP, (state, { payload }) => {
        state.scrollToTop = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_NETWORK_CHANGE_ACTIVATE, (state, { payload }) => {
        state.networkChangeActivate = payload;
    });
    builder.addCase(ACTION_CREATORS.IS_BIOAUTH_IN_PROGRESS, (state, { payload }) => {
        state.isBioAuthInProgress = payload;
    });
    builder.addCase(ACTION_CREATORS.IS_NETWORK_CHANGED, (state, { payload }) => {
        state.isNetworkChanged = payload;
    });
    builder.addCase(ACTION_CREATORS.IS_CONNECTION, (state, { payload }) => {
        state.connect = payload;
    });
    builder.addCase(ACTION_CREATORS.LOGGEDIN, (state, { payload }) => {
        state.loggedIn = payload;
    });
    builder.addCase(ACTION_CREATORS.DATA_LOAD_STATUS, (state, { payload }) => {
        state.dataLoadStatus = payload;
    });
});

export default reducer;
