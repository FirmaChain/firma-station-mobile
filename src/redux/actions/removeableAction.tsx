import { HANDLE_NETWORK_CHANGE_ACTIVATE } from "../types";

export const handleNetworkChangeActivate = (active:boolean) => (
    {
        type: HANDLE_NETWORK_CHANGE_ACTIVATE,
        payload: active,
    }
)