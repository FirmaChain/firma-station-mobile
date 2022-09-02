import {
    HANDLE_RESET_MODAL,
    HANDLE_MODAL_DATA,
    HANDLE_DAPP_DATA,
    VALIDATION_MODAL,
    QR_SCANNER_MODAL,
    DAPP_CONNECT_MODAL,
    DAPP_SIGN_MODAL,
    DAPP_DIRECT_SIGN_MODAL
} from '../types';

export const handleResetModal = () => ({ type: HANDLE_RESET_MODAL });
export const handleModalData = (data: any) => ({ type: HANDLE_MODAL_DATA, payload: data });
export const handleDAppData = (data: any) => ({ type: HANDLE_DAPP_DATA, payload: data });

export const handleValidationModal = (open: boolean) => ({ type: VALIDATION_MODAL, payload: open });
export const handleQRScannerModal = (open: boolean) => ({ type: QR_SCANNER_MODAL, payload: open });
export const handleDAppConnectModal = (open: boolean) => ({ type: DAPP_CONNECT_MODAL, payload: open });
export const handleDAppSignModal = (open: boolean) => ({ type: DAPP_SIGN_MODAL, payload: open });
export const handleDAppDirectSignModal = (open: boolean) => ({ type: DAPP_DIRECT_SIGN_MODAL, payload: open });
