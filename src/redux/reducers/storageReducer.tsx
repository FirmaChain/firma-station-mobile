import { Action, 
        HANDLE_CURRENCY, 
        HANDLE_NETWORK } from "../types";

export interface IState {
    currency: string;
    network: string;
}

const initialState = {
    currency: "USD",
    network: "MainNet",
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case HANDLE_CURRENCY : 
        return{
            ...state, 
            currency: action.payload,
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