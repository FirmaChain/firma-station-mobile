import { CHAIN_NETWORK } from '@/../config';
import * as validator from './validator.api';

let API_ADDRESS = CHAIN_NETWORK['MainNet'].FIRMACHAIN_CONFIG.restApiAddress;

export const setApiAddress = (network: string) => {
    API_ADDRESS = CHAIN_NETWORK[network].FIRMACHAIN_CONFIG.restApiAddress;
};

export const getApiAddress = () => {
    return API_ADDRESS;
};

export const validatorAPI = validator;
