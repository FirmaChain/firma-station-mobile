import { HOME_QR_SCANNER_MODAL, WALLET_CONNECT_LOGIN_MODAL, WALLET_RESULT_MODAL } from "../types";

export const handleHomeQRScannerModal = (open:boolean) => (
    {
        type: HOME_QR_SCANNER_MODAL,
        payload: open,
    }
)

export const handleWalletConnectLoginModal = (open:boolean) => (
    {
        type: WALLET_CONNECT_LOGIN_MODAL,
        payload: open,
    }
)

export const handleWalletResultModal = (open:boolean) => (
    {
        type: WALLET_RESULT_MODAL,
        payload: open,
    }
)