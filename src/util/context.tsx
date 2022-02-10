import { CONTEXT_ACTIONS_TYPE } from "@/constants/common";
import { createContext, useState } from "react";

interface ContextInterface {
    isLoading: boolean;
    wallet: any;
    dispatchEvent?: Function;
}

const defaultState = {
    isLoading: false,
    wallet: {
        name: '',
        address: '',
    },
}

export const AppContext = createContext<Partial<ContextInterface>>(defaultState);

export const DispatchContext = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [wallet, setWallet]:Array<any> = useState();

    const dispatchEvent = (action:string, payload:any) => {
        switch (action) {
            case CONTEXT_ACTIONS_TYPE["LOADING"]:
                setIsLoading(payload);
                return;
            case CONTEXT_ACTIONS_TYPE["WALLET"]:
                setWallet(payload);
                return;
            default:
                return;
        }
    }

    return {
        isLoading,
        wallet,
        dispatchEvent
    }
}