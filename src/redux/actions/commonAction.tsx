import { APP_PAUSED_TIME, 
    APP_STATE, 
    HANDLE_CURRENCY, 
    HANDLE_LOADING_PROGRESS, 
    HANDLE_NETWORK, 
    IS_BIOAUTH_IN_PROGRESS, 
    IS_CONNECTION, 
    IS_NETWORK_CHANGED, 
    LOCK_STATION, 
    LOGGEDIN} from "../types"
    
export const handleIsConnection = (connect:boolean) => (
    {
        type: IS_CONNECTION,
        payload: connect,
    }
)

export const handleCurrency = (currency:string) => (
    {
        type: HANDLE_CURRENCY,
        payload: currency,
    }
)

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

export const handleLockStation = (lock:boolean) => (
    {
        type: LOCK_STATION,
        payload: lock,
    }
)

export const handleAppState = (state:string) => (
    {
        type: APP_STATE,
        payload: state,
    }
)

export const handleLoggedIn = (login:boolean) => (
    {
        type: LOGGEDIN,
        payload: login,
    }
)

export const handleAppPausedTime = (time:string) => (
    {
        type: APP_PAUSED_TIME,
        payload: time,
    }
)

export const handleBioAuthInProgress = (progress:boolean) => (
    {
        type: IS_BIOAUTH_IN_PROGRESS,
        payload: progress,
    }
) 