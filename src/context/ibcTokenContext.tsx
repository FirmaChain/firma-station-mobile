import { Token } from '@firmachain/firma-js';
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

export interface IBCTokenState {
    enable: boolean;
    displayName: string;
    denom: string;
    decimal: number;
    icon: string;
    link: string;
    amount: string;
    chainName: string;
}

interface IBCTokenContextType {
    tokenList: Token[];
    ibcToken: IBCTokenState | null;
    setTokenList: (data: Token[]) => void;
    setIbcToken: (token: IBCTokenState | null) => void;
}

export const IBCTokenContext = createContext<IBCTokenContextType | undefined>(undefined);

export const useIBCTokenContext = () => {
    const context = useContext(IBCTokenContext);
    if (!context) {
        throw new Error("useIBCTokenContext must be used within a IBCTokenProvider");
    }
    return context;
};


interface IBCTokenProviderProps {
    children: ReactNode;
}

export const IBCTokenProvider: React.FC<IBCTokenProviderProps> = ({ children }) => {
    const [tokenList, setTokenList] = useState<Token[]>([]);
    const [ibcToken, setIbcToken] = useState<IBCTokenState | null>(null);

    return (
        <IBCTokenContext.Provider value={{ tokenList, ibcToken, setTokenList, setIbcToken }}>
            {children}
        </IBCTokenContext.Provider>
    );
};
