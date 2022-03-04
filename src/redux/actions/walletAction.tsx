import { HANDLE_WALLET_ADDRESS, HANDLE_WALLET_NAME } from "../types"

export const handleWalletName = (name:string) => (
    {
        type: HANDLE_WALLET_NAME,
        payload: name,
    }
)

export const handleWalletAddress = (address:string) => (
    {
        type: HANDLE_WALLET_ADDRESS,
        payload: address,
    }
)

