import { IKeyValue } from './common';

export const VOTE_TYPE = ['YES', 'NO', 'NoWithVeto', 'Abstain'];

export const BANK_SEND = 'BANK_SEND';
export const STAKING_DELEGATE = 'STAKING_DELEGATE';
export const STAKING_REDELEGATE = 'STAKING_REDELEGATE';
export const STAKING_UNDELEGATE = 'STAKING_UNDELEGATE';
export const STAKING_WITHDRAW = 'STAKING_WITHDRAW';
export const STAKING_WITHDRAW_ALL = 'STAKING_WITHDRAW_ALL';
export const GOV_PROPOSAL = 'GOV_PROPOSAL';
export const GOV_DEPOSIT = 'GOV_DEPOSIT';
export const GOV_VOTE = 'GOV_VOTE';
export const AUTHZ_GRANT = 'AUTHZ_GRANT';
export const AUTHZ_REVOKE = 'AUTHZ_REVOKE';

export const DAPP_MESSAGE_TYPE: IKeyValue = {
    bank_send: BANK_SEND,
    staking_delegate: STAKING_DELEGATE,
    staking_redelegate: STAKING_REDELEGATE,
    staking_undelegate: STAKING_UNDELEGATE,
    staking_withdraw: STAKING_WITHDRAW,
    staking_withdraw_all: STAKING_WITHDRAW_ALL,
    gov_submit_proposal: GOV_PROPOSAL,
    gov_deposit: GOV_DEPOSIT,
    gov_vote: GOV_VOTE,
    authz_grant: AUTHZ_GRANT,
    authz_revoke: AUTHZ_REVOKE
};
