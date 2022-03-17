import { Action, HANDLE_LOADING_PROGRESS, HANDLE_NETWORK, IS_CONNECTION, IS_NETWORK_CHANGED } from "../types";

export interface CommonReduceState {
    connect: boolean;
    loading: boolean;
    network: string;
    isNetworkChanged: boolean;
}

const initialState = {
    connect: true,
    loading: false,
    network: "MainNet",
    isNetworkChanged: false,
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
        default :
        return state
    }
}

export default reducer;