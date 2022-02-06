interface IKeyValue {
    [key: string]: string;
}

export const WALLET_LIST = "FIRMA_WALLET_LIST_1";
export const USE_BIO_AUTH = "USE_BIO_AUTH";
export const RECOVER_INFO_MESSAGE = "Generate QR code from setting menu of\nFirma Station desktop or extionsion";

export const PROPOSAL_STATUS: IKeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "DEPOSIT PERIOD",
    PROPOSAL_STATUS_VOTING_PERIOD: "VOTING PERIOD",
    PROPOSAL_STATUS_PASSED: "PASSED",
    PROPOSAL_STATUS_REJECTED: "REJECTED",
    PROPOSAL_STATUS_FAILED: "FAILED",
    PROPOSAL_STATUS_INVALID: "INVALID",
};

export const STATUS_COLOR: IKeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "#2460FA",
    PROPOSAL_STATUS_VOTING_PERIOD: "#45eba9",
    PROPOSAL_STATUS_INVALID: "#2BA891",
    PROPOSAL_STATUS_PASSED: "#c5c5d1",
    PROPOSAL_STATUS_REJECTED: "#ffc542",
    PROPOSAL_STATUS_FAILED: "#de3d3d",
};

export const STATUS_BACKGROUND_COLOR: IKeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "#28345A",
    PROPOSAL_STATUS_VOTING_PERIOD: "#2F504A",
    PROPOSAL_STATUS_INVALID: "#294345",
    PROPOSAL_STATUS_PASSED: "#494952",
    PROPOSAL_STATUS_REJECTED: "#544935",
    PROPOSAL_STATUS_FAILED: "#4E2D34",
};
  
export const PROPOSAL_MESSAGE_TYPE: IKeyValue = {
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