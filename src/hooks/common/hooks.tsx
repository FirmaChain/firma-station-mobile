import { MAINTENANCE_API, MAINTENANCE_PATH } from '@/../config';
import { useVersion } from '@/apollo/gqls';
import { useAppSelector } from '@/redux/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IMaintenanceState {
    isShow: boolean;
    title: string;
    content: string;
}

export const useChainVersion = () => {
    const [chainVer, setChainVer] = useState('');
    const [sdkVer, setSdkVer] = useState('');

    const { loading, data, refetch } = useVersion();

    useEffect(() => {
        if (loading === false) {
            if (data !== undefined) {
                setChainVer(data.version[0].chainVer);
                setSdkVer(data.version[0].sdkVer);
            } else {
                setChainVer('');
                setSdkVer('');
            }
        }
    }, [loading]);

    return {
        refetch,
        chainVer,
        sdkVer
    };
};

export const useServerMessage = () => {
    const { storage } = useAppSelector((state) => state);
    const [minAppVer, setMinAppVer] = useState<string | null | undefined>(null);
    const [currentAppVer, setCurrentAppVer] = useState<string | null | undefined>(null);
    const [maintenanceState, setMaintenanceState] = useState<IMaintenanceState | null | undefined>(null);

    const getMaintenanceData = useCallback(async () => {
        try {
            const response = await fetch(`${MAINTENANCE_API}/${MAINTENANCE_PATH[storage.network]}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: any = await response.json();

            setMinAppVer(data.minAppVer);
            setCurrentAppVer(data.currentAppVer);
            setMaintenanceState(data.maintenance);
        } catch (e) {
            setMinAppVer(undefined);
            setCurrentAppVer(undefined);
            setMaintenanceState(undefined);
            throw new Error('Failed Request');
        }
    }, []);

    useEffect(() => {
        getMaintenanceData();
    }, []);

    return {
        minAppVer,
        currentAppVer,
        maintenanceState
    };
};

export const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
