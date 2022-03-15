import { CHAIN_NETWORK } from "@/../config";

export interface KeyValue {
    [key: string]: any;
}

let EXPLORER = CHAIN_NETWORK["MainNet"].EXPLORER;

export const setExplorerUrl = (network:string) => {
    EXPLORER = CHAIN_NETWORK[network].EXPLORER;
}

export const EXPLORER_URL = () => {
    return EXPLORER;
}

export const WELCOME_DESCRIPTION = "Use seed phrases to create\nnew wallets or restore existing wallets.";

export const MNEMONIC_WARN_MESSAGE = "If you lose your seed phrase it's gone forever. Station doesn't store any data.";
export const RECOVER_INFO_MESSAGE = "Generate QR code from setting menu of\nFirma Station desktop or extionsion";

export const PLACEHOLDER_FOR_WALLET_NAME = "Enter 5-20 alphanumeric characters";
export const PLACEHOLDER_FOR_PASSWORD = "Must be at least 10 characters";
export const PLACEHOLDER_FOR_PASSWORD_CONFIRM = "Confirm your password";

export const WARNING_WALLET_NAME_IS_TOO_SHORT = "name must be between 5 and 20 characters";
export const WARNING_PASSWORD_IS_TOO_SHORT = "Password must be longer than 10 characters";
export const WARNING_PASSWORD_NOT_MATCH = "Password does not match";

export const PASSWORD_CHANGE_SUCCESS = "Successfully changed your password.";
export const PASSWORD_CHANGE_FAIL = "Please check your current password.";

export const TRANSACTION_PROCESS_TEXT = "This transaction is in process.";
export const TRANSACTION_PROCESS_DESCRIPTION_TEXT = "It can take up from 5 to 15 seconds for\na transaction to be completed.";
export const TRANSACTION_PROCESS_NOTICE_TEXT = "Depending on the condition of the network,\nit can take up to more than 15 seconds.";

export const WRONG_TARGET_ADDRESS_WARN_TEXT = "Invalid address. Please check again.";

export const BIOMETRICS_PERMISSION_ALERT = {
    title: "Biometrics not authrized",
    desc: "Move to settings to enable Biometrics permissions?"
}

export const CAMERA_PERMISSION_ALERT = {
    title: "Camera not authrized",
    desc: "Move to settings to enable camera permissions?"
}

// wallet
export const ADDRESS_QRCODE_MODAL_TEXT = {
    title: 'Address',
    desc: 'Description for QR code',
    confirmTitle: 'Ok'
}

export const QRCODE_SCANNER_MODAL_TEXT = "Scan QR code";

export const CHECK_ACTIVATE_BIO_AUTH_MODAL_TEXT = {
    title: 'Use Bio Auth',
    desc: 'Use your Biometric for faster, easeier access to your account',
    confirmTitle: 'Enable',
    cancelTitle: 'Later'
}

// setting
export const SETTING_BIO_AUTH_MODAL_TEXT = {
    title: 'Use Bio Auth',
    desc: 'Enter your password to turn on Bio Auth.',
    confirmTitle: 'Confirm'
}

export const SETTING_DELETE_WALLET_TEXT = {
    title: 'Delete wallet',
    desc: 'Are you sure you want to delete this wallet?\nYour wallet cannot be recovered without seed phrase.',
    confirmTitle: 'Delete'
}

// delegate
export const AUTO_ENTERED_AMOUNT_TEXT = "The entire amount is automatically entered except 0.1FCT, which will be used as a transaction fee.";
export const UNDELEGATE_NOTICE_TEXT = [
    "A 21 day period is required when undelegating your tokens. During the 21 day period, you will not receive any rewards. And you can't send and delegate that amount during 21 days.",
    "A maximum of 7 undelegations are allowed per validator during the 21 day link period."
]

export const REDELEGATE_NOTICE_TEXT = [
    "Redelegated supply will be linked for a period of 21 days.",
    "A maximum of 7 redelegations are allowed. ",
    "Until the 21 day link period passes, you cannot redelegate your redelgated supply to another validator.",
]

// transaction
export const TRANSACTION_TYPE: KeyValue = {
    SEND: "TRANSACTION_SEND",
    DELEGATE: "TRANSACTION_DELEGATE",
    REDELEGATE: "TRANSACTION_REDELEGATE",
    UNDELEGATE: "TRANSACTION_UNDELEGATE",
    WITHDRAW: "TRANSACTION_WITHDRAW",
}

// proposal
export const PROPOSAL_STATUS: KeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "DEPOSIT PERIOD",
    PROPOSAL_STATUS_VOTING_PERIOD: "VOTING PERIOD",
    PROPOSAL_STATUS_PASSED: "PASSED",
    PROPOSAL_STATUS_REJECTED: "REJECTED",
    PROPOSAL_STATUS_FAILED: "FAILED",
    PROPOSAL_STATUS_INVALID: "INVALID",
};

export const STATUS_COLOR: KeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "#2460FA",
    PROPOSAL_STATUS_VOTING_PERIOD: "#45eba9",
    PROPOSAL_STATUS_INVALID: "#2BA891",
    PROPOSAL_STATUS_PASSED: "#c5c5d1",
    PROPOSAL_STATUS_REJECTED: "#ffc542",
    PROPOSAL_STATUS_FAILED: "#de3d3d",
};

export const STATUS_BACKGROUND_COLOR: KeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "#28345A",
    PROPOSAL_STATUS_VOTING_PERIOD: "#2F504A",
    PROPOSAL_STATUS_INVALID: "#294345",
    PROPOSAL_STATUS_PASSED: "#494952",
    PROPOSAL_STATUS_REJECTED: "#544935",
    PROPOSAL_STATUS_FAILED: "#4E2D34",
};
  
export const PROPOSAL_MESSAGE_TYPE: KeyValue = {
    "/cosmos.gov.v1beta1.TextProposal": "Text",
    "/cosmos.params.v1beta1.ParameterChangeProposal": "ParameterChange",
    "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal": "CommunityPoolSpend",
    "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal": "SoftwareUpgrade",
};
  
export const PROPOSAL_MESSAGE_TYPE_TEXT = "Text";
export const PROPOSAL_MESSAGE_TYPE_PARAMETERCHANGE = "ParameterChange";
export const PROPOSAL_MESSAGE_TYPE_COMMUNITYPOOLSPEND = "CommunityPoolSpend";
export const PROPOSAL_MESSAGE_TYPE_SOFTWAREUPGRADE = "SoftwareUpgrade";

export const PROPOSAL_STATUS_DEPOSIT_PERIOD = "PROPOSAL_STATUS_DEPOSIT_PERIOD";
export const PROPOSAL_STATUS_VOTING_PERIOD = "PROPOSAL_STATUS_VOTING_PERIOD";
export const PROPOSAL_STATUS_PASSED = "PROPOSAL_STATUS_PASSED";
export const PROPOSAL_STATUS_REJECTED = "PROPOSAL_STATUS_REJECTED";
export const PROPOSAL_STATUS_FAILED = "PROPOSAL_STATUS_FAILED";
export const PROPOSAL_STATUS_INVALID = "PROPOSAL_STATUS_INVALID";