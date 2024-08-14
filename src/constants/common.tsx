import { CHAIN_NETWORK } from '@/../config';
import TRANSACTION_LABELS from '@constants/message_labels.json';
import { RestakeActiveColor, RestakeInactiveColor, RestakeNoDelegationColor } from './theme';

export interface IKeyValue {
    [key: string]: any;
}

const LABELS: IKeyValue = TRANSACTION_LABELS;
let EXPLORER = CHAIN_NETWORK['MainNet'].EXPLORER;
let DENOM = CHAIN_NETWORK['MainNet'].FIRMACHAIN_CONFIG.denom;
let _CHAIN_PREFIX = CHAIN_NETWORK['MainNet'].CHAIN_NAME_FOR_COINGECKO;
let _CHAIN_SYMBOL = CHAIN_NETWORK['MainNet'].CHAIN_SYMBOL;
let _BLOCKS_PER_YEAR = CHAIN_NETWORK['MainNet'].BLOCKS_PER_YEAR;
let _DEFAULT_MINT_INFLATION = CHAIN_NETWORK['MainNet'].DEFAULT_MINT_INFLATION;

export const setNetworkData = (network: string) => {
    EXPLORER = CHAIN_NETWORK[network].EXPLORER;
    _CHAIN_PREFIX = CHAIN_NETWORK[network].CHAIN_NAME_FOR_COINGECKO;
    DENOM = CHAIN_NETWORK[network].FIRMACHAIN_CONFIG.denom;
    _CHAIN_SYMBOL = CHAIN_NETWORK[network].CHAIN_SYMBOL;
    _BLOCKS_PER_YEAR = CHAIN_NETWORK[network].BLOCKS_PER_YEAR;
    _DEFAULT_MINT_INFLATION = CHAIN_NETWORK[network].DEFAULT_MINT_INFLATION;
};

export const EXPLORER_URL = () => {
    return EXPLORER;
};

export const TOKEN_DENOM = () => {
    return DENOM;
};
export const CHAIN_PREFIX = () => {
    return _CHAIN_PREFIX;
};

export const CHAIN_SYMBOL = () => {
    return _CHAIN_SYMBOL;
};

export const BLOCKS_PER_YEAR = () => {
    return _BLOCKS_PER_YEAR;
};

export const DEFAULT_MINT_INFLATION = () => {
    return _DEFAULT_MINT_INFLATION;
};

export const MAINTENANCE_ERROR = 'Could not verify version information.';
export const UPDATE_NOTIFICATION =
    'The latest version of Firma Station has been released.\nPress the OK button to go to the store for updates.';

export const UNABLE_TO_RETRIEVE_WALLET = 'Unable to retrieve wallet information. If the problem repeats, please contact us.';

export const APPLE_APP_STORE = 'itms-apps://apps.apple.com/tr/app/firma-station/id1611660902?l=tr';
export const APPLE_APP_STORE_WEB = 'https://apps.apple.com/us/app/firma-station/idid1611660902';
export const GOOGLE_PLAY_STORE = 'market://details?id=com.firma_station_mobile';
export const GOOGLE_PLAY_STORE_WEB = 'https://play.google.com/store/apps/details?id=com.firma_station_mobile';

export const WELCOME_DESCRIPTION = 'Use seed phrases to create\nnew wallets or restore existing wallets.';
export const LOGIN_DESCRIPTION = 'Select a wallet and connect it.';
export const JAILBREAK_ALERT =
    'Firma Station is not supported on jailbroken devices.\nPlease restore your device to a non-jailbroken state.';

export const DATA_LOAD_DELAYED_NOTICE = 'Data loading is being delayed.';
export const DATA_RELOAD_INTERVAL = 30000;

export const MNEMONIC_WARN_MESSAGE = "If you lose your seed phrase it's gone forever. Station doesn't store any data.";
export const RECOVER_INFO_MESSAGE = 'Generate QR code from setting menu of\nFirma Station desktop or extionsion';

export const PLACEHOLDER_FOR_WALLET_NAME = 'Enter 5-20 alphanumeric characters';
export const PLACEHOLDER_FOR_PASSWORD = 'Must be at least 10 characters';
export const PLACEHOLDER_FOR_PASSWORD_CONFIRM = 'Confirm your password';

export const WARNING_WALLET_NAME_IS_TOO_SHORT = 'name must be between 5 and 20 characters';
export const WARNING_PASSWORD_IS_TOO_SHORT = 'Password must be longer than 10 characters';
export const WARNING_PASSWORD_NOT_MATCH = 'Password does not match';

export const WALLETNAME_CHANGE_SUCCESS = 'Successfully changed your wallet name.';

export const PASSWORD_CHANGE_SUCCESS = 'Successfully changed your password.';
export const PASSWORD_CHANGE_FAIL = 'Please check your current password.';

export const TRANSACTION_PROCESS_TEXT = 'This transaction is in process.';
export const TRANSACTION_PROCESS_DESCRIPTION_TEXT = 'It can take up from 5 to 15 seconds for\na transaction to be completed.';
export const TRANSACTION_PROCESS_NOTICE_TEXT = 'Depending on the condition of the network,\nit can take up to more than 15 seconds.';

export const WRONG_TARGET_ADDRESS_WARN_TEXT = 'Invalid address. Please check again.';
export const EXIST_ADDRESS_IN_FAVORITE_WARN_TEXT = 'This address already exists in the favorite.';
export const EXIST_NAME_IN_FAVORITE_WARN_TEXT = 'This name already exists in the favorite.';
export const FAVORITE_REMOVE_WARN_TEXT = 'Press the delete button,\nthe favorite will be deleted immediately.';
export const NO_FAVORITE = 'Favotite does not exist.';
export const FAVORITE_ADD_SUCCESS = 'Successfully added favorite.';
export const FAVORITE_ADJUST_SUCCESS = 'Successfully changed favorite data.';
export const FAVORITE_REMOVE_SUCCESS = 'Successfully removed favorite.';

export const BIOMETRICS_PERMISSION_ALERT = {
    title: 'Biometrics not authorized',
    desc: 'Move to settings to enable Biometrics permissions?'
};

export const CAMERA_PERMISSION_ALERT = {
    title: 'Camera not authorized',
    desc: 'Move to settings to enable camera permissions?'
};

export const LOADING_DATA_NOTICE = 'Loading data. Please wait...';

export const CONNECTION_NOTICE = 'Connection error.\nPlease check your network.';
export const COPIED_CLIPBOARD = 'Copied your ';
export const CHANGE_NETWORK_NOTICE = 'Under changing into the ';
export const BIOAUTH_ACTIVATE = 'Bio Auth has been activated';
export const APP_LOCK_ACTIVATE = 'App lock has been inactivated.';
export const FEE_INSUFFICIENT_NOTICE = 'The fee is insufficient. Please check the balance.';

// wallet
export const ADDRESS_QRCODE_MODAL_TEXT = {
    title: 'Address',
    desc: 'Description for QR code',
    confirmTitle: 'Ok'
};

export const QRCODE_SCANNER_MODAL_TEXT = 'Please read the QR code.';

export const CHECK_ACTIVATE_BIO_AUTH_MODAL_TEXT = {
    title: 'Use Bio Auth',
    desc: 'Use your Biometric for faster, easeier access to your account',
    confirmTitle: 'Enable',
    cancelTitle: 'Later'
};

export const CREATE_WALLET_FAILED = 'Wallet creation failed. Please try again.';
export const RECOVER_WALLET_FAILED = 'Wallet recover failed. Please try again.';
export const CHECK_MNEMONIC = 'Check your mnemonic again.';
export const CHECK_PRIVATEKEY = 'Check your private key again.';
export const CHECK_RECOVER_VALUE = 'Check your mnemonic or private key again.';

export const HISTORY_NOT_EXIST = "There's no history yet.";

// setting
export const SETTING_BIO_AUTH_MODAL_TEXT = {
    title: 'Use Bio Auth',
    desc: 'Enter your password to turn on Bio Auth.',
    confirmTitle: 'Confirm'
};

export const SETTING_DELETE_WALLET_TEXT = {
    title: 'Delete wallet',
    desc: 'Are you sure you want to delete this wallet?\nYour wallet cannot be recovered without seed phrase.',
    confirmTitle: 'Delete'
};

// delegate
export const DELEGATE_NOT_EXIST = 'There are no delegation\ncurrently in progress.';
export const REDELEGATE_NOT_EXIST = 'There are no redelegation\ncurrently in progress.';
export const UNDELEGATE_NOT_EXIST = 'There are no undelegation\ncurrently in progress.';
export const RESTAKE_NOT_EXIST = 'Restake is inactive';

export const AUTO_ENTERED_AMOUNT_TEXT = `The entire amount is automatically entered except 0.1 ${_CHAIN_SYMBOL}, which will be used as a transaction fee.`;
export const WARNING_FOR_MAX_AMOUNT_TEST = 'If the maximum value is transmitted, the subsequent transaction cannot be guaranteed.';
export const MAXIMUM_UNDELEGATE_NOTICE_TEXT = 'A maximum of 7 undelegations are allowed per validator during the 21 day link period.';
export const UNDELEGATE_NOTICE_TEXT = [
    "A 21 day period is required when undelegating your tokens. During the 21 day period, you will not receive any rewards. And you can't send and delegate that amount during 21 days.",
    MAXIMUM_UNDELEGATE_NOTICE_TEXT
];

export const NO_DELEGATION = 'No Delegation';
export const REDELEGATE_NOTICE_TEXT = [
    'Redelegated supply will be linked for a period of 21 days.',
    'A maximum of 7 redelegations are allowed. ',
    'Until the 21 day link period passes, you cannot redelegate your redelgated supply to another validator.'
];

export const RESTAKE_NOTICE_TEXT = [
    'Performs a restake to all validators currently being delegated.',
    'If you delegate to a new Validator after activating Restake, you must update Restake.'
];

export const DAPP_SERVICE_CONNECTION = 'SERVICE CONNECTION REQUEST';
export const DAPP_SERVICE_CONNECTION_DESCRIPTION_1 = 'The service request the use of ';
export const DAPP_SERVICE_CONNECTION_DESCRIPTION_2 = 'The signature does not incur any costs.';
export const DAPP_SIGNATURE_REQUEST = 'SIGNATURE REQUEST';
export const DAPP_SIGNATURE_REQUEST_DESCRIPTION =
    'The signature requested by the service. Please proceed with the signature if you can trust it. There is no charge for these signatures.';
export const DAPP_INVALID_QR = 'Invalid wallet. Please check your wallet.';
export const DAPP_NO_SERVICE = 'There are no services available.';
export const DAPP_LOADING_NFT = 'Loading NFT list.';
export const DAPP_NO_NFT = 'NFT does not exist.';
export const DAPP_NOT_ENOUGHT_BALANCE = 'Not enough balance.';
export const DAPP_SERVICE_USING_NOTICE = 'Please go to the service you were using.';
export const DAPP_SERVICE_REGIST = 'Register for a new Dapp service.';
export const DAPP_SERVICE_REGIST_SUCCESS = 'The service has been registered.\nAvailable on the Dapps tab.';
export const DAPP_SERVICE_EXIST_NOTICE = 'This service is already registered.';

export const CW_TX_NOTICE_TEXT = `A transaction fee of 0.02 ${_CHAIN_SYMBOL} is required to transfer this token. Ensure you have enough ${_CHAIN_SYMBOL}.`

export const IBC_OSMO_ADDRESS_INVALID_TEXT = `Only addresses starting with "osmo1" are accepted.`

export const CW20_NOT_EXIST = 'No CW20 contracts\nhave been added.';
export const CW721_NOT_EXIST = 'No CW721 contracts\nhave been added.';
export const CW_REMOVE_WARN_TEXT = 'Press Remove to delete immediately.';
export const CW721_REMOVE_SUCCESS = 'Successfully removed from list.';
export const CW20_REMOVE_SUCCESS = 'Successfully removed from list.';
export const EXIST_CW_CONTRACT_TO_LIST = 'Contract address already registered.';
export const NON_EXIST_CW_CONTRACT = 'Contract information does not exist.';
export const ERROR_CW_CONTRACT = 'The contract address is invalid.'

// transaction
export const TRANSACTION_TYPE: IKeyValue = {
    SEND: 'TRANSACTION_SEND',
    SEND_TOKEN: 'TRANSACTION_SEND_TOKEN',
    SEND_IBC: 'TRANSACTION_SEND_IBC',
    DELEGATE: 'TRANSACTION_DELEGATE',
    REDELEGATE: 'TRANSACTION_REDELEGATE',
    UNDELEGATE: 'TRANSACTION_UNDELEGATE',
    GRANT: 'TRANSACTION_GRANT_STAKE_AUTH',
    REVOKE: 'TRANSACTION_REVOKE_STAKE_AUTH',
    WITHDRAW: 'TRANSACTION_WITHDRAW',
    WITHDRAW_ALL: 'TRANSACTION_WITHDRAW_ALL',
    VOTING: 'TRANSACTION_VOTING',
    DAPP: 'TRANSACTION_DAPP',
    SEND_CW20: 'TRANSACTION_SEND_CW20',
    SEND_CW721: 'TRANSACTION_SEND_CW721',
};

export const RESTAKE_STATUS: IKeyValue = {
    NO_DELEGATION: {
        title: 'Not yet delegated',
        color: RestakeNoDelegationColor
    },
    ACTIVE: {
        title: 'Active',
        color: RestakeActiveColor
    },
    INACTIVE: {
        title: 'Inactive',
        color: RestakeInactiveColor
    }
};

export const RESTAKE_TYPE: IKeyValue = {
    GRANT: 'Grant stake authorization',
    REVOKE: 'Revoke stake authorization'
};

// transaction & unlock
export const TRANSACTION_AUTH_TEXT = 'Enter your password to make a transaction.';
export const UNLOCK_AUTH_TEXT = 'Enter your password to unlock.';

// proposal
export const PROPOSAL_NOT_REGISTERED = 'No proposal registered.';

export const PROPOSAL_STATUS: IKeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: 'DEPOSIT PERIOD',
    PROPOSAL_STATUS_VOTING_PERIOD: 'VOTING PERIOD',
    PROPOSAL_STATUS_PASSED: 'PASSED',
    PROPOSAL_STATUS_REJECTED: 'REJECTED',
    PROPOSAL_STATUS_FAILED: 'FAILED',
    PROPOSAL_STATUS_INVALID: 'INVALID'
};

export const STATUS_COLOR: IKeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: '#2460FA',
    PROPOSAL_STATUS_VOTING_PERIOD: '#E79720',
    PROPOSAL_STATUS_INVALID: '#2BA891',
    PROPOSAL_STATUS_PASSED: '#F17047',
    PROPOSAL_STATUS_REJECTED: '#DA4B4B',
    PROPOSAL_STATUS_FAILED: '#9438DC'
};

export const PROPOSAL_MESSAGE_TYPE: IKeyValue = {
    '/cosmos.gov.v1beta1.TextProposal': 'Text',
    '/cosmos.params.v1beta1.ParameterChangeProposal': 'ParameterChange',
    '/cosmos.distribution.v1beta1.CommunityPoolSpendProposal': 'CommunityPoolSpend',
    '/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal': 'SoftwareUpgrade'
};

export const PROPOSAL_MESSAGE_TYPE_TEXT = 'Text';
export const PROPOSAL_MESSAGE_TYPE_PARAMETERCHANGE = 'ParameterChange';
export const PROPOSAL_MESSAGE_TYPE_COMMUNITYPOOLSPEND = 'CommunityPoolSpend';
export const PROPOSAL_MESSAGE_TYPE_SOFTWAREUPGRADE = 'SoftwareUpgrade';

export const PROPOSAL_STATUS_DEPOSIT_PERIOD = 'PROPOSAL_STATUS_DEPOSIT_PERIOD';
export const PROPOSAL_STATUS_VOTING_PERIOD = 'PROPOSAL_STATUS_VOTING_PERIOD';
export const PROPOSAL_STATUS_PASSED = 'PROPOSAL_STATUS_PASSED';
export const PROPOSAL_STATUS_REJECTED = 'PROPOSAL_STATUS_REJECTED';
export const PROPOSAL_STATUS_FAILED = 'PROPOSAL_STATUS_FAILED';
export const PROPOSAL_STATUS_INVALID = 'PROPOSAL_STATUS_INVALID';

export const TYPE_COLORS: IKeyValue = {
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
    twenty: '#D9C788'
};

export const TRANSACTION_TYPE_MODEL: IKeyValue = {
    // ========================
    // staking
    // ========================
    '/cosmos.staking.v1beta1.MsgDelegate': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txDelegateLabel']
    },
    '/cosmos.staking.v1beta1.MsgBeginRedelegate': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txRedelegateLabel']
    },
    '/cosmos.staking.v1beta1.MsgUndelegate': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txUndelegateLabel']
    },
    '/cosmos.staking.v1beta1.MsgCreateValidator': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txCreateValidatorLabel']
    },
    '/cosmos.staking.v1beta1.MsgEditValidator': {
        tagTheme: TYPE_COLORS['one'],
        tagDisplay: LABELS['txEditValidatorLabel']
    },
    // ========================
    // bank
    // ========================
    '/cosmos.bank.v1beta1.MsgSend': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txSendLabel']
    },
    '/cosmos.bank.v1beta1.MsgMultiSend': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txMultisendLabel']
    },
    // ========================
    // crisis
    // ========================
    '/cosmos.crisis.v1beta1.MsgVerifyInvariant': {
        tagTheme: TYPE_COLORS['three'],
        tagDisplay: LABELS['txVerifyInvariantLabel']
    },
    // ========================
    // slashing
    // ========================
    '/cosmos.slashing.v1beta1.MsgUnjail': {
        tagTheme: TYPE_COLORS['five'],
        tagDisplay: LABELS['txUnjailLabel']
    },
    // ========================
    // distribution
    // ========================
    '/cosmos.distribution.v1beta1.MsgFundCommunityPool': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txFundLabel']
    },
    '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txsetRewardAddressLabel']
    },
    '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txWithdrawRewardLabel']
    },
    '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission': {
        tagTheme: TYPE_COLORS['six'],
        tagDisplay: LABELS['txWithdrawCommissionLabel']
    },
    // ========================
    // governance
    // ========================
    '/cosmos.gov.v1beta1.MsgDeposit': {
        tagTheme: TYPE_COLORS['seven'],
        tagDisplay: LABELS['txDepositLabel']
    },
    '/cosmos.gov.v1beta1.MsgVote': {
        tagTheme: TYPE_COLORS['seven'],
        tagDisplay: LABELS['txVoteLabel']
    },
    '/cosmos.gov.v1beta1.MsgSubmitProposal': {
        tagTheme: TYPE_COLORS['seven'],
        tagDisplay: LABELS['txSubmitProposalLabel']
    },
    // ========================
    // ibc client
    // ========================
    '/ibc.core.client.v1.MsgCreateClient': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txCreateClientLabel']
    },
    '/ibc.core.client.v1.MsgUpdateClient': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txUpdateClientLabel']
    },
    '/ibc.core.client.v1.MsgUpgradeClient': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txUpgradeClientLabel']
    },
    '/ibc.core.client.v1.MsgSubmitMisbehaviour': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txSubmitMisbehaviourLabel']
    },
    '/ibc.core.client.v1.Height': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txHeightLabel']
    },
    // ========================
    // ibc channel
    // ========================
    '/ibc.core.channel.v1.MsgRecvPacket': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txRecvPacketLabel']
    },
    '/ibc.core.channel.v1.Channel': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelLabel']
    },
    '/ibc.core.channel.v1.Counterparty': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txCounterpartyLabel']
    },
    '/ibc.core.channel.v1.Packet': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txPacketLabel']
    },
    '/ibc.core.channel.v1.MsgAcknowledgement': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txAcknowledgementLabel']
    },
    '/ibc.core.channel.v1.MsgChannelCloseConfirm': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelCloseConfirmLabel']
    },
    '/ibc.core.channel.v1.MsgChannelCloseInit': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelCloseInitLabel']
    },
    '/ibc.core.channel.v1.MsgChannelOpenAck': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenAckLabel']
    },
    '/ibc.core.channel.v1.MsgChannelOpenConfirm': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenConfirmLabel']
    },
    '/ibc.core.channel.v1.MsgChannelOpenInit': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenInitLabel']
    },
    '/ibc.core.channel.v1.MsgChannelOpenTry': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txChannelOpenTryLabel']
    },
    '/ibc.core.channel.v1.MsgTimeout': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txTimeoutLabel']
    },
    '/ibc.core.channel.v1.MsgTimeoutOnClose': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txTimeoutOnCloseLabel']
    },
    // ========================
    // ibc connection
    // ========================
    '/ibc.core.connection.v1.MsgConnectionOpenAck': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenAckLabel']
    },
    '/ibc.core.connection.v1.MsgConnectionOpenConfirm': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenConfirmLabel']
    },
    '/ibc.core.connection.v1.MsgConnectionOpenInit': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenInitLabel']
    },
    '/ibc.core.connection.v1.MsgConnectionOpenTry': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionOpenTryLabel']
    },
    '/ibc.core.connection.v1.ConnectionEnd': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txConnectionEndLabel']
    },
    '/ibc.core.connection.v1.Counterparty': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txCounterpartyLabel']
    },
    '/ibc.core.connection.v1.Version': {
        tagTheme: TYPE_COLORS['nine'],
        tagDisplay: LABELS['txVersionLabel']
    },
    // ========================
    // ibc transfer
    // ========================
    '/ibc.applications.transfer.v1.MsgTransfer': {
        tagTheme: TYPE_COLORS['ten'],
        tagDisplay: LABELS['txTransferLabel']
    },

    // ========================
    // firmachain transfer
    // ========================
    '/firmachain.firmachain.nft.MsgMint': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txNFTMintLabel']
    },
    '/firmachain.firmachain.nft.MsgTransfer': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txNFTTransferLabel']
    },
    '/firmachain.firmachain.nft.MsgBurn': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txNFTBurnLabel']
    },
    '/firmachain.firmachain.contract.MsgAddContractLog': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txAddContractLogLabel']
    },
    '/firmachain.firmachain.contract.MsgCreateContractFile': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txCreateContractFileLabel']
    },
    '/cosmos.feegrant.v1beta1.MsgGrantAllowance': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txFeegrantGrantLabel']
    },
    '/cosmos.feegrant.v1beta1.MsgRevokeAllowance': {
        tagTheme: TYPE_COLORS['three'],
        tagDisplay: LABELS['txFeegrantRevokeLabel']
    },
    '/cosmos.authz.v1beta1.MsgGrant': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txAuthzGrantLabel']
    },
    '/firmachain.firmachain.token.MsgCreateToken': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txTokenCreateLabel']
    },
    '/firmachain.firmachain.token.MsgMint': {
        tagTheme: TYPE_COLORS['two'],
        tagDisplay: LABELS['txTokenMintLabel']
    },
    '/firmachain.firmachain.token.MsgBurn': {
        tagTheme: TYPE_COLORS['four'],
        tagDisplay: LABELS['txTokenBurnLabel']
    },
    '/firmachain.firmachain.token.MsgUpdateTokenURI': {
        tagTheme: TYPE_COLORS['three'],
        tagDisplay: LABELS['txTokenUpdateURILabel']
    }
};

export const CURRENCY_LIST = ['USD', 'KRW', 'SGD', 'IDR', 'THB', 'RUB', 'EUR', 'JPY', 'BTC', 'ETH'];

export const CHAIN_CURRENCY: IKeyValue = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    LTC: 'Litecoin',
    BCH: 'Bitcoin Cash',
    BNB: 'Binance Coin',
    EOS: 'EOS',
    XRP: 'XRP',
    XLM: 'Lumens',
    LINK: 'Chainlink',
    DOT: 'Polkadot',
    YFI: 'Yearn.finance',
    BITS: 'Bits',
    SATS: 'Satoshi',
    XAG: 'Silver - Troy Ounce',
    XAU: 'Gold - Troy Ounce'
};

export const CURRENCY_SYMBOL: IKeyValue = {
    ALL: 'Lek',
    AFN: '؋',
    ARS: '$',
    AWG: 'ƒ',
    AUD: '$',
    AZN: '₼',
    BSD: '$',
    BBD: '$',
    BYN: 'Br',
    BZD: 'BZ$',
    BMD: '$',
    BOB: '$b',
    BAM: 'KM',
    BWP: 'P',
    BGN: 'лв',
    BRL: 'R$',
    BND: '$',
    KHR: '៛',
    CAD: '$',
    KYD: '$',
    CLP: '$',
    CNY: '¥',
    COP: '$',
    CRC: '₡',
    HRK: 'kn',
    CUP: '₱',
    CZK: 'Kč',
    DKK: 'kr',
    DOP: 'RD$',
    XCD: '$',
    EGP: '£',
    SVC: '$',
    EUR: '€',
    FKP: '£',
    FJD: '$',
    GHS: '¢',
    GIP: '£',
    GTQ: 'Q',
    GGP: '£',
    GYD: '$',
    HNL: 'L',
    HKD: '$',
    HUF: 'Ft',
    ISK: 'kr',
    INR: '₹',
    IDR: 'Rp',
    IRR: '﷼',
    IMP: '£',
    ILS: '₪',
    JMD: 'J$',
    JPY: '¥',
    JEP: '£',
    KZT: 'лв',
    KPW: '₩',
    KRW: '₩',
    KGS: 'лв',
    LAK: '₭',
    LBP: '£',
    LRD: '$',
    MKD: 'ден',
    MYR: 'RM',
    MUR: '₨',
    MXN: '$',
    MNT: '₮',
    MZN: 'MT',
    NAD: '$',
    NPR: '₨',
    ANG: 'ƒ',
    NZD: '$',
    NIO: 'C$',
    NGN: '₦',
    NOK: 'kr',
    OMR: '﷼',
    PKR: '₨',
    PAB: 'B/.',
    PYG: 'Gs',
    PEN: 'S/.',
    PHP: '₱',
    PLN: 'zł',
    QAR: '﷼',
    RON: 'lei',
    RUB: '₽',
    SHP: '£',
    SAR: '﷼',
    RSD: 'Дин.',
    SCR: '₨',
    SGD: '$',
    SBD: '$',
    SOS: 'S',
    ZAR: 'R',
    LKR: '₨',
    SEK: 'kr',
    CHF: 'CHF',
    SRD: '$',
    SYP: '£',
    TWD: 'NT$',
    THB: '฿',
    TTD: 'TT$',
    TRY: '₺',
    TVD: '$',
    UAH: '₴',
    AED: 'د.إ',
    GBP: '£',
    USD: '$',
    UYU: '$U',
    UZS: 'лв',
    VEF: 'Bs',
    VND: '₫',
    YER: '﷼',
    ZWD: 'Z$'
};
