import { Action, 
        APP_STATE, 
        APP_PAUSED_TIME,
        HANDLE_LOADING_PROGRESS, 
        HANDLE_NETWORK, 
        IS_CONNECTION, 
        IS_NETWORK_CHANGED, 
        LOCK_STATION,
        IS_BIOAUTH_IN_PROGRESS,  } from "../types";

export interface CommonReduceState {
    connect: boolean;
    loading: boolean;
    network: string;
    isNetworkChanged: boolean;
    locakStationActivation: boolean;
    lockStation: boolean;
    appState: string;
    appPausedTime: string;
    isBioAuthInProgress: boolean;
}

const initialState = {
    connect: true,
    loading: false,
    network: "MainNet",
    isNetworkChanged: false,
    locakStationActivation: false,
    lockStation: false,
    appState: "active",
    appPausedTime: "",
    isBioAuthInProgress: false,
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case IS_CONNECTION: 
            return {
                ...state, 
                connect: action.payload,
            }
        case HANDLE_LOADING_PROGRESS: 
            return {
                ...state, 
                loading: action.payload,
            }
        case HANDLE_NETWORK:
            return {
                ...state,
                network: action.payload,
            }
        case IS_NETWORK_CHANGED:
            return {
                ...state,
                isNetworkChanged: action.payload,
            }
        case LOCK_STATION:
            return {
                ...state,
                lockStation: action.payload,
            }
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
        case IS_BIOAUTH_IN_PROGRESS:
            return {
                ...state,
                isBioAuthInProgress: action.payload,
            }
        default :
        return state
    }
}

export default reducer;