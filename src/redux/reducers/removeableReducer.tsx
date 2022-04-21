import { Action, HANDLE_NETWORK_CHANGE_ACTIVATE } from "../types";

export interface WalletReduceState {
    networkChangeActivate: boolean;
}

const initialState = {
    networkChangeActivate: false,
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case HANDLE_NETWORK_CHANGE_ACTIVATE : 
        return{
            ...state, 
            networkChangeActivate: action.payload,
        }
        default :
        return state
    }
}

export default reducer;