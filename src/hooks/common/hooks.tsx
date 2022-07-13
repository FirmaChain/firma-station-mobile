import { useMaintenance, useVersion } from "@/apollo/gqls";
import { useEffect, useState } from "react";

interface IMaintenanceState {
    isShow: boolean;
    title: string;
    content: string;
}

export const useChainVersion = () => {
    const [chainVer, setChainVer] = useState("");
    const [sdkVer, setSdkVer] = useState("");

    const {loading , data} = useVersion();

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
    const [minAppVer, setMinAppVer] = useState<string|undefined>();
    const [currentAppVer, setCurrentAppVer] = useState<string|undefined>();
    const [maintenanceState, setMaintenanceState] = useState<IMaintenanceState|undefined>();

    const {loading , data } = useMaintenance();

    const initState = () =>{
        setMinAppVer("");
        setCurrentAppVer("");
        setMaintenanceState({
            isShow: false,
            title: "",
            content: "",
        });
    }

    useEffect(() => {
        if(loading === false){
            if(data){
                if(data.maintenance.length === 0){
                    initState();
                } else {
                    setMinAppVer(data.maintenance[0].minAppVer);
                    setCurrentAppVer(data.maintenance[0].currentAppVer);
                    setMaintenanceState(data.maintenance[0].maintenance);
                }
            } else {
                initState();
            }
        }
    }, [loading])
    
    return {
        minAppVer,
        currentAppVer,
        maintenanceState,
    }
}