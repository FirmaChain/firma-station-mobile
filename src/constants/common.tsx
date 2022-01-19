interface IKeyValue {
    [key: string]: string;
}

export const RECOVER_INFO_MESSAGE = "Generate QR code from setting menu of\nFirma Station desktop or extionsion";

export const PROPOSAL_STATUS: IKeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "DEPOSIT",
    PROPOSAL_STATUS_VOTING_PERIOD: "VOTING",
    PROPOSAL_STATUS_PASSED: "PASSED",
    PROPOSAL_STATUS_REJECTED: "REJECTED",
    PROPOSAL_STATUS_FAILED: "FAILED",
    PROPOSAL_STATUS_INVALID: "INVALID",
};

export const STATUS_COLOR: IKeyValue = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: "#2460FA",
    PROPOSAL_STATUS_VOTING_PERIOD: "#E79720",
    PROPOSAL_STATUS_PASSED: "#F17047",
    PROPOSAL_STATUS_REJECTED: "#DA4B4B",
    PROPOSAL_STATUS_FAILED: "#9438DC",
    PROPOSAL_STATUS_INVALID: "#2BA891",
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