import { MAINTENANCE_API, MAINTENANCE_PATH } from '@/../config';
import { useAppSelector } from '@/redux/hooks';
import { getChainInfo } from '@/util/firma';
import { useCallback, useEffect, useRef, useState } from 'react';

interface IMaintenanceState {
    isShow: boolean;
    title: string;
    content: string;
}

export const useChainVersion = () => {
    const [chainVer, setChainVer] = useState('');
    const [sdkVer, setSdkVer] = useState('');

    const handleChainInfo = useCallback(async () => {
        try {
            const info = await getChainInfo();

            setChainVer(`v${info.appVersion}`);
            setSdkVer(info.cosmosVersion);
        } catch (error) {
            throw error;
        }
    }, []);

    useEffect(() => {
        handleChainInfo();
    }, []);

    return {
        handleChainInfo,
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
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store',
                    Pragma: 'no-store',
                    Expires: '0'
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
        maintenanceState,
        getMaintenanceData
    };
};

export const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const useInterval = (callback: () => void, delay: number | null, startAfterDelayed: boolean = false) => {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        let delayed = startAfterDelayed ? 0 : 1;
        function tick() {
            if (delayed >= 1) {
                if (savedCallback.current) savedCallback.current();
            }
            delayed = delayed + 1;
        }

        if (delay !== null) {
            tick();
            let id = setInterval(tick, delay);
            return () => {
                delayed = 0;
                clearInterval(id);
            };
        }
    }, [delay]);
};
