import { HANDLE_LOADING_PROGRESS } from "../types"

export const handleLoadingProgress = (loading:boolean) => (
    {
        type: HANDLE_LOADING_PROGRESS,
        payload: loading,
    }
)