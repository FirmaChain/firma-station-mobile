import { Action, HANDLE_DST_ADDRESS, HANDLE_WALLET_ADDRESS, HANDLE_WALLET_NAME } from "../types";

export interface State {
    name: string;
    address: string;
    dstAddress: string;
}

const initialState = {
    name: "",
    address: "",
    dstAddress: "",
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
        case HANDLE_DST_ADDRESS : 
        return{
            ...state, 
            dstAddress: action.payload,
        }
        default :
        return state
    }
}

export default reducer;