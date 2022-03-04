import { Action, HANDLE_WALLET_ADDRESS, HANDLE_WALLET_NAME } from "../types";

export interface WalletReduceState {
    name: string;
    address: string;
}

const initialState = {
    name: "",
    address: "",
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case HANDLE_WALLET_NAME : 
        return{
            ...state, 
            name: action.payload,
        }
        case HANDLE_WALLET_ADDRESS : 
        return{
            ...state, 
            address: action.payload,
        }
        default :
        return state
    }
}

export default reducer;