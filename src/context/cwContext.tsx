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
    network: string;
}

export interface ICW721ContractState extends ICWContractState {
    totalSupply: number;
    totalNFTIds: string[];
    images: null | string[];
    network: string;
}

interface CWContextType {
    cw20Data: ICW20ContractState[];
    cw721Data: ICW721ContractState[];
    cw721Thumbnail: Record<string, string[]>;
    handleUpdateCW20WholeData: (value: ICW20ContractState[]) => void;
    handleUpdateCW721WholeData: (value: ICW721ContractState[]) => void;
    handleCw721Thumbnail: (contractAddress: string, images: string[]) => void;
}

export const CWContext = createContext<CWContextType | undefined>(undefined);

export const useCWContext = () => {
    const context = useContext(CWContext);
    if (!context) {
        throw new Error('useCWContext must be used within a CWProvider');
    }
    return context;
};

interface CWProviderProps {
    children: ReactNode;
}

export const CWProvider: React.FC<CWProviderProps> = ({ children }) => {
    const [cw20Data, setCw20Data] = useState<ICW20ContractState[]>([]);
    const [cw721Data, setCw721Data] = useState<ICW721ContractState[]>([]);
    const [cw721Thumbnail, setCw721Thumbnail] = useState<Record<string, string[]>>({});

    const handleUpdateCW20WholeData = (value: ICW20ContractState[]) => {
        setCw20Data(() => value);
    };

    const handleUpdateCW721WholeData = (value: ICW721ContractState[]) => {
        setCw721Data(value);
    };

    const handleCw721Thumbnail = (contractAddress: string, images: string[]) => {
        setCw721Thumbnail((prev) => ({ ...prev, [contractAddress]: images }));
    };

    return (
        <CWContext.Provider
            value={{
                cw20Data,
                cw721Data,
                cw721Thumbnail,
                handleUpdateCW20WholeData,
                handleUpdateCW721WholeData,
                handleCw721Thumbnail
            }}
        >
            {children}
        </CWContext.Provider>
    );
};
