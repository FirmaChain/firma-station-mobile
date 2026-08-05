import React, { createContext, ReactNode, useContext, useState } from 'react';
import type { ProjectList } from '@/util/connectClient';

export type DappsContextData = ProjectList['projectList'][number] | Record<string, never>;

interface DappsContextType {
    data: DappsContextData;
    selectedTabIndex: number;
    setData: (_data: DappsContextData) => void;
    setSelectedTabIndex: (index: number) => void;
}

export const DappsContext = createContext<DappsContextType | undefined>(undefined);

export const useDappsContext = () => {
    const context = useContext(DappsContext);
    if (!context) {
        throw new Error('useDappsContext must be used within a DappsProvider');
    }
    return context;
};

interface DappsProviderProps {
    children: ReactNode;
}

export const DappsProvider: React.FC<DappsProviderProps> = ({ children }) => {
    const [data, setData] = useState<DappsContextData>({});
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

    return <DappsContext.Provider value={{ data, setData, selectedTabIndex, setSelectedTabIndex }}>{children}</DappsContext.Provider>;
};
