import { HANDLE_LOADING_PROGRESS, HANDLE_NETWORK, IS_NETWORK_CHANGED } from "../types"

export const handleLoadingProgress = (loading:boolean) => (
    {
        type: HANDLE_LOADING_PROGRESS,
        payload: loading,
    }
)

export const handleNetwork = (network:string) => (
    {
        type: HANDLE_NETWORK,
        payload: network,
    }
)

export const handleIsNetworkChange = (change:boolean) => (
    {
        type: IS_NETWORK_CHANGED,
        payload: change,
    }
)
