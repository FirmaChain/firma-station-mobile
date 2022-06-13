import { useMaintenance, useVersion } from "@/apollo/gqls";
import { useEffect, useState } from "react";

interface MaintenanceState {
    isShow: boolean;
    title: string;
    content: string;
}

export const useChainVersion = () => {
    const [chainVer, setChainVer] = useState("");
    const [sdkVer, setSdkVer] = useState("");

    const {loading , data } = useVersion();

    useEffect(() => {
        if(loading === false){
            if(data){
                setChainVer(data.version[0].chainVer);
                setSdkVer(data.version[0].sdkVer);
            }
        }
    }, [loading])
    
    return {
        chainVer,
        sdkVer
    }
}

export const useServerMessage = () => {
    const [minAppVer, setMinAppVer] = useState('');
    const [currentAppVer, setCurrentAppVer] = useState('');
    const [maintenanceState, setMaintenanceState] = useState<MaintenanceState>();

    const {loading , data } = useMaintenance();

    useEffect(() => {
        if(loading === false){
            if(data){
                setMinAppVer(data.maintenance[0].minAppVer);
                setCurrentAppVer(data.maintenance[0].currentAppVer);
                setMaintenanceState(data.maintenance[0].maintenance);
            }
        }
    }, [loading])
    
    return {
        minAppVer,
        currentAppVer,
        maintenanceState,
    }
}