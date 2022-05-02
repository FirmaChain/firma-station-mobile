import { Action, 
    APP_STATE,
    APP_PAUSED_TIME,
    LOCK_STATION,
    HANDLE_LOADING_PROGRESS,
    HANDLE_SCROLL_TO_TOP,
    HANDLE_NETWORK_CHANGE_ACTIVATE,
    IS_BIOAUTH_IN_PROGRESS,
    IS_NETWORK_CHANGED,
    IS_CONNECTION,
    LOGGEDIN, } from "../types";

export interface WalletReduceState {
    appState: string;
    appPausedTime: string;
    lockStation: boolean;
    loading: boolean;
    scrollToTop: boolean;
    networkChangeActivate: boolean;
    isBioAuthInProgress: boolean;
    isNetworkChanged: boolean;
    connect: boolean;
    loggedIn: boolean;
}

const initialState = {
    appState: "active",
    appPausedTime: "",
    lockStation: false,
    loading: false,
    scrollToTop: false,
    networkChangeActivate: false,
    isBioAuthInProgress: false,
    isNetworkChanged: false,
    connect: true,
    loggedIn: false,
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case APP_STATE:
            return {
                ...state,
                appState: action.payload,
            }
        case APP_PAUSED_TIME:
            return {
                ...state,
                appPausedTime: action.payload,
            }
        case LOCK_STATION:
            return {
                ...state,
                lockStation: action.payload,
            }
        case HANDLE_LOADING_PROGRESS: 
            return {
                ...state, 
                loading: action.payload,
            }
        case HANDLE_SCROLL_TO_TOP : 
            return{
                ...state, 
                scrollToTop: action.payload,
            }
        case HANDLE_NETWORK_CHANGE_ACTIVATE : 
            return{
                ...state, 
                networkChangeActivate: action.payload,
            }
        case IS_BIOAUTH_IN_PROGRESS:
            return {
                ...state,
                isBioAuthInProgress: action.payload,
            }
        case IS_NETWORK_CHANGED:
            return {
                ...state,
                isNetworkChanged: action.payload,
            }
        case IS_CONNECTION: 
            return {
                ...state, 
                connect: action.payload,
            }
        case LOGGEDIN:
            return {
                ...state,
                loggedIn: action.payload,
            }
        default :
        return state
    }
}

export default reducer;