import { Action, HANDLE_LOADING_PROGRESS } from "../types";

export interface CommonReduceState {
    loading: boolean;
}

const initialState = {
    loading: false,
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case HANDLE_LOADING_PROGRESS : 
        return{
            ...state, 
            loading: action.payload,
        }
        default :
        return state
    }
}

export default reducer;