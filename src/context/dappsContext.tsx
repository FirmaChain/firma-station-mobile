import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface DappsContextType {
    data: any;
    selectedTabIndex: number;
    setData: (_data: any) => void;
    setSelectedTabIndex: (index: number) => void;
}

export const DappsContext = createContext<DappsContextType | undefined>(undefined);

export const useDappsContext = () => {
    const context = useContext(DappsContext);
    if (!context) {
        throw new Error("useDappsContext must be used within a DappsProvider");
    }
    return context;
};


interface DappsProviderProps {
    children: ReactNode;
}

export const DappsProvider: React.FC<DappsProviderProps> = ({ children }) => {
    const [data, setData] = useState<any>({});
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

    return (
        <DappsContext.Provider value={{ data, setData, selectedTabIndex, setSelectedTabIndex }}>
            {children}
        </DappsContext.Provider>
    );
};
