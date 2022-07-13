import { Action, HOME_QR_SCANNER_MODAL, WALLET_CONNECT_LOGIN_MODAL, WALLET_RESULT_MODAL } from "../types";

export interface IState {
    homeQrScannerOpen: boolean;
    walletConnectLogin: boolean;
    walletResult: boolean;
}

const initialState = {
    homeQrScannerOpen: false,
    walletConnectLogin: false,
    walletResult: false,
};

const reducer = (state = initialState, action:Action) => {
    switch (action.type) {
        case HOME_QR_SCANNER_MODAL : 
        return{
            ...state, 
            homeQrScannerOpen: action.payload,
        }
        case WALLET_CONNECT_LOGIN_MODAL : 
        return{
            ...state, 
            walletConnectLogin: action.payload,
        }
        case WALLET_RESULT_MODAL : 
        return{
            ...state, 
            walletResult: action.payload,
        }
        default :
        return state
    }
}

export default reducer;