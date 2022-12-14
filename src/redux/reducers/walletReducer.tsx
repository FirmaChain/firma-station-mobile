import { createAction, createReducer } from '@reduxjs/toolkit';
import { HANDLE_DST_ADDRESS, HANDLE_WALLET_ADDRESS, HANDLE_WALLET_NAME } from '../types';

export interface IWalletStateProps {
    name: string;
    address: string;
    dstAddress: string;
}

const initialState: IWalletStateProps = {
    name: '',
    address: '',
    dstAddress: ''
};

export const ACTION_CREATORS = {
    HANDLE_DST_ADDRESS: createAction<string>(HANDLE_DST_ADDRESS),
    HANDLE_WALLET_ADDRESS: createAction<string>(HANDLE_WALLET_ADDRESS),
    HANDLE_WALLET_NAME: createAction<string>(HANDLE_WALLET_NAME)
};

export const ACTIONS = {
    handleDstAddress: ACTION_CREATORS.HANDLE_DST_ADDRESS,
    handleWalletAddress: ACTION_CREATORS.HANDLE_WALLET_ADDRESS,
    handleWalletName: ACTION_CREATORS.HANDLE_WALLET_NAME
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(ACTION_CREATORS.HANDLE_DST_ADDRESS, (state, { payload }) => {
        state.dstAddress = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_WALLET_ADDRESS, (state, { payload }) => {
        state.address = payload;
    });
    builder.addCase(ACTION_CREATORS.HANDLE_WALLET_NAME, (state, { payload }) => {
        state.name = payload;
    });
});

export default reducer;
