import { Action, HANDLE_LOADING_PROGRESS, HANDLE_NETWORK } from "../types";

export interface CommonReduceState {
    loading: boolean;
    network: string;
}

const initialState = {
    loading: false,
    network: "MainNet",
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
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
        default :
        return state
    }
}

export default reducer;