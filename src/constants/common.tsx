import { CHAIN_NETWORK } from "@/../config";
import TRANSACTION_LABELS from "@constants/message_labels.json";

export interface KeyValue {
  [key: string]: any;
}

const LABELS:KeyValue = TRANSACTION_LABELS;
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

export const WALLETNAME_CHANGE_SUCCESS = "Successfully changed your wallet name.";

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

export const CONNECTION_NOTICE = "Connection error.\nPlease check your network.";
export const COPIED_CLIPBOARD = "Copied your ";
export const CHANGE_NETWORK_NOTICE = "Under changing into the ";
export const BIOAUTH_ACTIVATE = "Bio Auth has been activated";
export const APP_LOCK_ACTIVATE = "App lock has been inactivated.";
export const FEE_INSUFFICIENT_NOTICE = "The fee is insufficient. Please check the balance.";

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

export const CREATE_WALLET_FAILED = "Wallet creation failed. Please try again.";
export const WRONG_ADDRESS = "Wrong address";
export const CHECK_MNEMONIC = "Check your mnemonic again.";

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

export const NO_DELEGATION = "No Delegation";
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

// transaction & unlock
export const TRANSACTION_AUTH_TEXT = "Enter your password to make a transaction.";
export const UNLOCK_AUTH_TEXT = "Enter your password to unlock.";

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

const TYPE_COLORS: KeyValue = {
    zero: '#E8E8E8',
    one: '#2460FA',
    two: '#2BA891',
    three: '#E79720',
    four: '#F17047',
    five: '#DA4B4B',
    six: '#9438DC',
    seven: '#1A869D',
    eight: '#2C9944',
    nine: '#B49F31',
    ten: '#E9A846',
    eleven: '#E94681',
    twelve: '#C15EC4',
    thirteen: '#C388D9',
    fourteen: '#46AEE9',
    fifteen: '#58BC91',
    sixteen: '#90BC58',
    seventeen: '#E99E8E',
    eighteen: '#F0A479',
    nineteen: '#D37763',
    twenty: '#D9C788',
}

export const TRANSACTION_TYPE_MODEL: KeyValue = {
      // ========================
      // staking
      // ========================
      '/cosmos.staking.v1beta1.MsgDelegate': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txDelegateLabel'],
      },
      '/cosmos.staking.v1beta1.MsgBeginRedelegate': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txRedelegateLabel'],
      },
      '/cosmos.staking.v1beta1.MsgUndelegate': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txUndelegateLabel'],
      },
      '/cosmos.staking.v1beta1.MsgCreateValidator': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txCreateValidatorLabel'],
      },
      '/cosmos.staking.v1beta1.MsgEditValidator': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txEditValidatorLabel'],
      },
      // ========================
      // bank
      // ========================
      '/cosmos.bank.v1beta1.MsgSend': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txSendLabel'],
      },
      '/cosmos.bank.v1beta1.MsgMultiSend': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txMultisendLabel'],
      },
      // ========================
      // crisis
      // ========================
      '/cosmos.crisis.v1beta1.MsgVerifyInvariant': {
        tagTheme: TYPE_COLORS['three'],
        tagDisplay: LABELS['txVerifyInvariantLabel'],
      },
      // ========================
      // slashing
      // ========================
      '/cosmos.slashing.v1beta1.MsgUnjail': {
        tagTheme: TYPE_COLORS['five'],
        tagDisplay: LABELS['txUnjailLabel'],
      },
      // ========================
      // distribution
      // ========================
      '/cosmos.distribution.v1beta1.MsgFundCommunityPool': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txFundLabel'],
      },
      '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txsetRewardAddressLabel'],
      },
      '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txWithdrawRewardLabel'],
      },
      '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txWithdrawCommissionLabel'],
      },
      // ========================
      // governance
      // ========================
      '/cosmos.gov.v1beta1.MsgDeposit': {
        tagTheme: TYPE_COLORS['seven'],
        tagDisplay: LABELS['txDepositLabel'],
      },
      '/cosmos.gov.v1beta1.MsgVote': {
        tagTheme: TYPE_COLORS['seven'],
        tagDisplay: LABELS['txVoteLabel'],
      },
      '/cosmos.gov.v1beta1.MsgSubmitProposal': {
        tagTheme: TYPE_COLORS['seven'],
        tagDisplay: LABELS['txSubmitProposalLabel'],
      },
      // ========================
      // ibc client
      // ========================
      '/ibc.core.client.v1.MsgCreateClient': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txCreateClientLabel'],
      },
      '/ibc.core.client.v1.MsgUpdateClient': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txUpdateClientLabel'],
      },
      '/ibc.core.client.v1.MsgUpgradeClient': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txUpgradeClientLabel'],
      },
      '/ibc.core.client.v1.MsgSubmitMisbehaviour': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txSubmitMisbehaviourLabel'],
      },
      '/ibc.core.client.v1.Height': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txHeightLabel'],
      },
      // ========================
      // ibc channel
      // ========================
      '/ibc.core.channel.v1.MsgRecvPacket': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txRecvPacketLabel'],
      },
      '/ibc.core.channel.v1.Channel': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelLabel'],
      },
      '/ibc.core.channel.v1.Counterparty': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txCounterpartyLabel'],
      },
      '/ibc.core.channel.v1.Packet': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txPacketLabel'],
      },
      '/ibc.core.channel.v1.MsgAcknowledgement': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txAcknowledgementLabel'],
      },
      '/ibc.core.channel.v1.MsgChannelCloseConfirm': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelCloseConfirmLabel'],
      },
      '/ibc.core.channel.v1.MsgChannelCloseInit': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelCloseInitLabel'],
      },
      '/ibc.core.channel.v1.MsgChannelOpenAck': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenAckLabel'],
      },
      '/ibc.core.channel.v1.MsgChannelOpenConfirm': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenConfirmLabel'],
      },
      '/ibc.core.channel.v1.MsgChannelOpenInit': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenInitLabel'],
      },
      '/ibc.core.channel.v1.MsgChannelOpenTry': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenTryLabel'],
      },
      '/ibc.core.channel.v1.MsgTimeout': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txTimeoutLabel'],
      },
      '/ibc.core.channel.v1.MsgTimeoutOnClose': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txTimeoutOnCloseLabel'],
      },
      // ========================
      // ibc connection
      // ========================
      '/ibc.core.connection.v1.MsgConnectionOpenAck': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenAckLabel'],
      },
      '/ibc.core.connection.v1.MsgConnectionOpenConfirm': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenConfirmLabel'],
      },
      '/ibc.core.connection.v1.MsgConnectionOpenInit': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenInitLabel'],
      },
      '/ibc.core.connection.v1.MsgConnectionOpenTry': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenTryLabel'],
      },
      '/ibc.core.connection.v1.ConnectionEnd': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionEndLabel'],
      },
      '/ibc.core.connection.v1.Counterparty': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txCounterpartyLabel'],
      },
      '/ibc.core.connection.v1.Version': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txVersionLabel'],
      },
      // ========================
      // ibc transfer
      // ========================
      '/ibc.applications.transfer.v1.MsgTransfer': {
        tagTheme: TYPE_COLORS['ten'],
        tagDisplay: LABELS['txTransferLabel'],
      },

      // ========================
      // firmachain transfer
      // ========================
      '/firmachain.firmachain.nft.MsgMint': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txNFTMintLabel'],
      },
      '/firmachain.firmachain.nft.MsgTransfer': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txNFTTransferLabel'],
      },
      '/firmachain.firmachain.nft.MsgBurn': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txNFTBurnLabel'],
      },
      '/firmachain.firmachain.contract.MsgAddContractLog': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txAddContractLogLabel'],
      },
      '/firmachain.firmachain.contract.MsgCreateContractFile': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txCreateContractFileLabel'],
      },
      '/cosmos.feegrant.v1beta1.MsgGrantAllowance': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txFeegrantGrantLabel'],
      },
      '/cosmos.feegrant.v1beta1.MsgRevokeAllowance': {
        tagTheme: TYPE_COLORS['three'],
        tagDisplay: LABELS['txFeegrantRevokeLabel'],
      },
      '/cosmos.authz.v1beta1.MsgGrant': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txAuthzGrantLabel'],
      },
      '/firmachain.firmachain.token.MsgCreateToken': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txTokenCreateLabel'],
      },
      '/firmachain.firmachain.token.MsgMint': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txTokenMintLabel'],
      },
      '/firmachain.firmachain.token.MsgBurn': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txTokenBurnLabel'],
      },
      '/firmachain.firmachain.token.MsgUpdateTokenURI': {
        tagTheme: TYPE_COLORS['three'],
        tagDisplay: LABELS['txTokenUpdateURILabel'],
      },
}
  