import { APP_STATE,
    APP_PAUSED_TIME,
    LOCK_STATION,
    HANDLE_LOADING_PROGRESS,
    HANDLE_SCROLL_TO_TOP,
    HANDLE_NETWORK_CHANGE_ACTIVATE,
    IS_BIOAUTH_IN_PROGRESS,
    IS_NETWORK_CHANGED,
    IS_CONNECTION,
    LOGGEDIN, 
    CHAIN_VERSION,
    SDK_VERSION,
    CURRENT_APP_VERSION,
    DATA_LOAD_STATUS,} from "../types";


export const handleCurrentAppVer = (version:string) => (
    {
        type: CURRENT_APP_VERSION,
        payload: version,
    }
)

export const handleChainVer = (version:string) => (
    {
        type: CHAIN_VERSION,
        payload: version,
    }
)

export const handleSDKVer = (version:string) => (
    {
        type: SDK_VERSION,
        payload: version,
    }
)

export const handleAppState = (state:string) => (
    {
        type: APP_STATE,
        payload: state,
    }
)

export const handleAppPausedTime = (time:string) => (
    {
        type: APP_PAUSED_TIME,
        payload: time,
    }
)

export const handleLockStation = (lock:boolean) => (
    {
        type: LOCK_STATION,
        payload: lock,
    }
)

export const handleLoadingProgress = (loading:boolean) => (
    {
        type: HANDLE_LOADING_PROGRESS,
        payload: loading,
    }
)

export const handleScrollToTop = (scroll:boolean) => (
    {
        type: HANDLE_SCROLL_TO_TOP,
        payload: scroll,
    }
)

export const handleNetworkChangeActivate = (active:boolean) => (
    {
        type: HANDLE_NETWORK_CHANGE_ACTIVATE,
        payload: active,
    }
)

export const handleBioAuthInProgress = (progress:boolean) => (
    {
        type: IS_BIOAUTH_IN_PROGRESS,
        payload: progress,
    }
)

export const handleIsNetworkChange = (change:boolean) => (
    {
        type: IS_NETWORK_CHANGED,
        payload: change,
    }
)

export const handleIsConnection = (connect:boolean) => (
    {
        type: IS_CONNECTION,
        payload: connect,
    }
)

export const handleLoggedIn = (login:boolean) => (
    {
        type: LOGGEDIN,
        payload: login,
    }
)

export const handleDataLoadStatus = (status: number) => (
    {
        type: DATA_LOAD_STATUS,
        payload: status,
    }
)