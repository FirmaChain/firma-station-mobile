import { Token } from '@firmachain/firma-js';
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { IBCConfig } from '../../config';

interface IBCTokenContextType {
    tokenList: Token[];
    ibcTokenConfig: IBCConfig | null;
    setTokenList: (data: Token[]) => void;
    setIbcTokenConfig: (token: IBCConfig | null) => void;
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
    const [ibcTokenConfig, setIbcTokenConfig] = useState<IBCConfig | null>(null);

    return (
        <IBCTokenContext.Provider value={{ tokenList, ibcTokenConfig, setTokenList, setIbcTokenConfig }}>
            {children}
        </IBCTokenContext.Provider>
    );
};
