import { Cw20MarketingInfo } from '@firmachain/firma-js';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ICWContractState {
    address: string;
    name: string;
    symbol: string;
    label: string;
}

export interface ICW20ContractState extends ICWContractState {
    decimal: number;
    marketing: Cw20MarketingInfo;
    totalSupply: string;
    imgURI: string;
    available: number;
}

export interface ICW721ContractState extends ICWContractState {
    totalSupply: number;
    totalNFTIds: string[];
    images: string[];
}

interface CWContextType {
    cw20Data: ICW20ContractState[];
    cw721Data: ICW721ContractState[];
    handleUpdateCW20WholeData: (value: ICW20ContractState[]) => void;
    handleUpdateCW721WholeData: (value: ICW721ContractState[]) => void;
}

export const CWContext = createContext<CWContextType | undefined>(undefined);

export const useCWContext = () => {
    const context = useContext(CWContext);
    if (!context) {
        throw new Error("useCWContext must be used within a CWProvider");
    }
    return context;
};

interface CWProviderProps {
    children: ReactNode;
}

export const CWProvider: React.FC<CWProviderProps> = ({ children }) => {
    const [cw20Data, setCw20Data] = useState<ICW20ContractState[]>([])
    const [cw721Data, setCw721Data] = useState<ICW721ContractState[]>([])

    const handleUpdateCW20WholeData = (value: ICW20ContractState[]) => {
        setCw20Data(value);
    }

    const handleUpdateCW721WholeData = (value: ICW721ContractState[]) => {
        setCw721Data(value);
    }


    return (
        <CWContext.Provider value={{ cw20Data, cw721Data, handleUpdateCW20WholeData, handleUpdateCW721WholeData }}>
            {children}
        </CWContext.Provider>
    );
};
