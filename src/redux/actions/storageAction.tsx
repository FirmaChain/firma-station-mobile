import { 
    HANDLE_CURRENCY, 
    HANDLE_NETWORK, 
} from "../types"
    

export const handleCurrency = (currency:string) => (
    {
        type: HANDLE_CURRENCY,
        payload: currency,
    }
)

export const handleNetwork = (network:string) => (
    {
        type: HANDLE_NETWORK,
        payload: network,
    }
) 