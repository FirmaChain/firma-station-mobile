import { CHAIN_NETWORK, FIRMACHAIN_DEFAULT_CONFIG } from '@/../config';
import { TOKEN_DENOM } from '@/constants/common';
import { EncodeObject } from '@cosmjs/proto-signing';
import { FirmaSDK, FirmaUtil, ValidatorDataType } from '@firmachain/firma-js';
import { AuthzTxClient } from '@firmachain/firma-js/dist/sdk/firmachain/authz/AuthzTxClient';
import { AuthorizationType, StakeAuthorization } from '@firmachain/firma-js/dist/sdk/firmachain/authz/AuthzTxTypes';
import { Any } from '@firmachain/firma-js/dist/sdk/firmachain/google/protobuf/any';
import { StakingTxClient } from '@firmachain/firma-js/dist/sdk/firmachain/staking/StakingTxClient';
import { StakingValidatorStatus } from '@firmachain/firma-js/dist/sdk/FirmaStakingService';
import { FirmaWalletService } from '@firmachain/firma-js/dist/sdk/FirmaWalletService';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { MsgBeginRedelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

import { IRedelegationInfo, IStakingState, IUndelegationInfo } from '@/hooks/staking/hooks';

import { compareBigIntDesc, convertAmountByDecimalToTx, convertNumber, convertToFctNumber } from './common';
import { getDecryptPassword, getRecoverValue } from './wallet';

export interface IWallet {
    name?: string;
    password?: string;
    mnemonic?: string;
}

export interface ITransactionState {
    walletName: string;
    password: string;
    targetAddress: string;
    amount: number;
}

export interface INftItemType {
    id: string;
    owner: string;
    tokenURI: string;
}

let firmaSDK: FirmaSDK;
let restakeAddress: string;

export const setFirmaSDK = (network: string) => {
    if (network === 'MainNet') {
        firmaSDK = new FirmaSDK(FIRMACHAIN_DEFAULT_CONFIG);
    } else {
        firmaSDK = new FirmaSDK(CHAIN_NETWORK[network].FIRMACHAIN_CONFIG);
    }
    restakeAddress = CHAIN_NETWORK[network].RESTAKE_ADDRESS;
};

export const getFirmaSDK = () => {
    return firmaSDK;
};

export const getRestakeAddress = () => {
    return restakeAddress;
};

export const getFirmaConfig = () => {
    return getFirmaSDK().Config;
};

export const getChainInfo = async () => {
    return await getFirmaSDK().BlockChain.getChainInfo();
};

// Wallet
export const createNewWallet = async () => {
    try {
        const wallet = await getFirmaSDK().Wallet.newWallet();

        return organizeWallet(wallet);
    } catch (error) {
        console.log('createNewWallet error : ' + error);
        throw error;
    }
};

export const mnemonicCheck = async (mnemonic: string) => {
    try {
        await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        return true;
    } catch (error) {
        console.log('error : ' + error);
        return false;
    }
};

export const privateKeyCheck = async (privateKey: string) => {
    try {
        await getFirmaSDK().Wallet.fromPrivateKey(privateKey);
        return true;
    } catch (error) {
        console.log('error : ' + error);
        return false;
    }
};

// Refactored to improve performance
export const recoverWallet = async (recoverValue: string) => {
    const normalized = recoverValue.trim();
    const hasWhitespace = /\s/.test(normalized);
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;

    const isMnemonicCandidate = hasWhitespace && wordCount === 24;
    const isPrivateKeyCandidate = !hasWhitespace;

    if (isMnemonicCandidate === false && isPrivateKeyCandidate === false) {
        throw new Error('Invalid recover value format');
    }

    try {
        if (isMnemonicCandidate) {
            return await getFirmaSDK().Wallet.fromMnemonic(normalized);
        }
        return await getFirmaSDK().Wallet.fromPrivateKey(normalized);
    } catch {
        if (isMnemonicCandidate) {
            return await getFirmaSDK().Wallet.fromPrivateKey(normalized);
        }
        return await getFirmaSDK().Wallet.fromMnemonic(normalized);
    }
};

export const getPrivateKeyFromMnemonic = async (mnemonic: string) => {
    try {
        const wallet = await recoverWallet(mnemonic);
        const privateKey = wallet.getPrivateKey();
        return privateKey;
    } catch (error) {
        console.log('getPrivateKeyFromMnemonic error : ' + error);
        throw error;
    }
};

export const getAddressFromRecoverValue = async (recoverValue: string) => {
    try {
        const wallet = await recoverWallet(recoverValue);
        const address = wallet.getAddress();
        return address;
    } catch (error) {
        console.log('getAddressFromRecoverValue error : ' + error);
        throw error;
    }
};

export const getBalanceFromAdr = async (address: string) => {
    try {
        const balance = await getFirmaSDK().Bank.getBalance(address);
        return balance;
    } catch (error) {
        console.log('getBalanceFromAdr error : ' + error);
        throw error;
    }
};

export const getTokenList = async (address: string) => {
    try {
        const list = await getFirmaSDK().Bank.getTokenBalanceList(address);

        return list;
    } catch (error) {
        console.log('getTokenList error : ', error);
        throw error;
    }
};

export const getTokenBalance = async (address: string, denom: string) => {
    try {
        let balance = 0;
        const allList = await getFirmaSDK().Bank.getTokenBalanceList(address);
        allList
            .filter((token) => token.denom === denom)
            .map((value) => {
                return (balance += Number(value.amount));
            });

        return balance;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const organizeWallet = async (wallet: FirmaWalletService) => {
    try {
        const _mnemonic = wallet.getMnemonic();
        const _privateKey = wallet.getPrivateKey();
        const _address = await wallet.getAddress();

        const _balance = await getBalanceFromAdr(_address);

        const result = {
            mnemonic: _mnemonic,
            privateKey: _privateKey,
            address: _address,
            balance: _balance
        };
        return result;
    } catch (error) {
        console.log('organizeWallet error : ' + error);
        throw error;
    }
};

export const getDecryptWalletInfo = async (walletName: string) => {
    const password = await getDecryptPassword();
    const result = await getRecoverValue(walletName, password);
    const recoverValue = result === null ? '' : result;
    return await recoverWallet(recoverValue);
};

export const getEstimateGasFromAllDelegations = async (walletName: string) => {
    const wallet = await getDecryptWalletInfo(walletName);
    const delegationList = (await getFirmaSDK().Staking.getTotalDelegationInfo(await wallet.getAddress())).dataList;
    return await getFirmaSDK().Distribution.getGasEstimationWithdrawAllRewardsFromAllValidator(wallet, delegationList);
};

export const getEstimateGasFromDelegation = async (walletName: string, validatorAddress: string) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Distribution.getGasEstimationWithdrawAllRewards(wallet, validatorAddress);
};

export const getEstimateGasDelegate = async (walletName: string, validatorAddress: string, amount: number) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Staking.getGasEstimationDelegate(wallet, validatorAddress, amount);
};

export const getEstimateGasUndelegate = async (walletName: string, validatorAddress: string, amount: number) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Staking.getGasEstimationUndelegate(wallet, validatorAddress, amount);
};

const buildRestakeGrantExpiration = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    return {
        seconds: BigInt(Math.floor(date.getTime() / 1000)),
        nanos: (date.getTime() % 1000) * 1000000
    };
};

export const buildUpdatedRestakeValidatorAddressList = (
    currentValidatorAddressList: string[],
    sourceValidatorAddress: string,
    destinationValidatorAddress: string,
    sourceRestake: boolean,
    destinationRestake: boolean
) => {
    const nextValidatorAddressList = [...currentValidatorAddressList];
    const sourceAlreadyInRestake = currentValidatorAddressList.includes(sourceValidatorAddress);
    const destinationAlreadyInRestake = currentValidatorAddressList.includes(destinationValidatorAddress);

    const removeValidatorAddress = (validatorAddress: string) => {
        const index = nextValidatorAddressList.indexOf(validatorAddress);
        if (index !== -1) {
            nextValidatorAddressList.splice(index, 1);
        }
    };

    const addValidatorAddress = (validatorAddress: string) => {
        if (nextValidatorAddressList.includes(validatorAddress) === false) {
            nextValidatorAddressList.push(validatorAddress);
        }
    };

    if (sourceAlreadyInRestake && sourceRestake === false) {
        removeValidatorAddress(sourceValidatorAddress);
    }

    if (sourceAlreadyInRestake === false && sourceRestake) {
        addValidatorAddress(sourceValidatorAddress);
    }

    if (destinationAlreadyInRestake && destinationRestake === false) {
        removeValidatorAddress(destinationValidatorAddress);
    }

    if (destinationAlreadyInRestake === false && destinationRestake) {
        addValidatorAddress(destinationValidatorAddress);
    }

    return nextValidatorAddressList;
};

const registerAuthzRedelegateMessage = () => {
    AuthzTxClient.getRegistry().register('/cosmos.staking.v1beta1.MsgBeginRedelegate', MsgBeginRedelegate);
};

const buildRedelegateTransactionMessages = async (
    wallet: FirmaWalletService,
    validatorSrcAddress: string,
    validatorDstAddress: string,
    amount: number,
    validatorAddressList?: string[]
) => {
    const walletAddress = await wallet.getAddress();
    const messageList: EncodeObject[] = [
        StakingTxClient.msgRedelegate({
            delegatorAddress: walletAddress,
            validatorSrcAddress,
            validatorDstAddress,
            amount: Coin.fromPartial({
                denom: TOKEN_DENOM(),
                amount: FirmaUtil.getUFCTStringFromFCT(amount)
            })
        })
    ];

    if (validatorAddressList !== undefined) {
        const authorization = StakeAuthorization.fromPartial({
            authorizationType: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
            allowList: {
                address: validatorAddressList
            }
        });

        messageList.push(
            AuthzTxClient.msgGrantAllowance({
                granter: walletAddress,
                grantee: getRestakeAddress(),
                grant: {
                    authorization: Any.fromPartial({
                        typeUrl: '/cosmos.staking.v1beta1.StakeAuthorization',
                        value: StakeAuthorization.encode(authorization).finish()
                    }),
                    expiration: buildRestakeGrantExpiration()
                }
            })
        );
    }

    return messageList;
};

export const getEstimateGasRedelegate = async (
    walletName: string,
    validatorSrcAddress: string,
    validatorDstAddress: string,
    amount: number,
    validatorAddressList?: string[]
) => {
    const wallet = await getDecryptWalletInfo(walletName);

    if (validatorAddressList === undefined) {
        return await getFirmaSDK().Staking.getGasEstimationRedelegate(wallet, validatorSrcAddress, validatorDstAddress, amount);
    }

    registerAuthzRedelegateMessage();
    const authzTxClient = new AuthzTxClient(wallet, getFirmaConfig().rpcAddress);
    const messageList = await buildRedelegateTransactionMessages(
        wallet,
        validatorSrcAddress,
        validatorDstAddress,
        amount,
        validatorAddressList
    );
    const signedTxRaw = await authzTxClient.sign(
        messageList,
        FirmaUtil.getSignAndBroadcastOption(getFirmaConfig().denom, {
            gas: getFirmaConfig().defaultGas,
            fee: getFirmaConfig().defaultFee,
            memo: ''
        }),
        false
    );

    return await FirmaUtil.estimateGas(signedTxRaw);
};

export const getEstimateGasGrantStakeAuthorization = async (walletName: string, validatorAddress: string[]) => {
    const wallet = await getDecryptWalletInfo(walletName);

    return await getFirmaSDK().Authz.getGasEstimationGrantStakeAuthorization(
        wallet,
        getRestakeAddress(),
        validatorAddress,
        1,
        buildRestakeGrantExpiration(),
        0
    );
};

export const getEstimateGasRevokeStakeAuthorization = async (walletName: string) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Authz.getGasEstimationRevokeStakeAuthorization(wallet, getRestakeAddress(), 1);
};

export const getEstimateGasSend = async (walletName: string, address: string, amount: number) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Bank.getGasEstimationSend(wallet, address, amount);
};

export const getEstimateGasSendToken = async (walletName: string, address: string, tokenId: string, amount: number, decimal: number) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Bank.getGasEstimationSendToken(wallet, address, tokenId, amount, decimal);
};

export const getEstimateGasSendIBC = async (
    walletName: string,
    port: string,
    channel: string,
    denom: string,
    address: string,
    amount: number,
    decimal: number
) => {
    const wallet = await getDecryptWalletInfo(walletName);
    const _amount = convertAmountByDecimalToTx(amount, decimal);
    const clientState = await getFirmaSDK().Ibc.getClientState(channel, port);
    const timeStamp = (Date.now() + 600000).toString() + '000000';
    const timeoutTimeStamp = BigInt(timeStamp);
    const height = {
        revisionHeight: BigInt(clientState.identified_client_state.client_state.latest_height.revision_height) + BigInt(1000),
        revisionNumber: BigInt(clientState.identified_client_state.client_state.latest_height.revision_number)
    };

    return await getFirmaSDK().Ibc.getGasEstimationTransfer(wallet, port, channel, denom, _amount, address, height, timeoutTimeStamp);
};

export const getEstimateGasSendCW20 = async (walletName: string, contract: string, address: string, amount: string) => {
    const wallet = await getDecryptWalletInfo(walletName);
    const _amount = await convertCW20Amount(contract, amount);
    return await getFirmaSDK().Cw20.getGasEstimationTransfer(wallet, contract, address, _amount);
};

export const getEstimateGasSendCW721 = async (walletName: string, contract: string, address: string, tokenId: string) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Cw721.getGasEstimationTransfer(wallet, contract, address, tokenId);
};

export const getEstimateGasVoting = async (walletName: string, proposalId: number, votingOpt: number) => {
    const wallet = await getDecryptWalletInfo(walletName);
    return await getFirmaSDK().Gov.getGasEstimationVote(wallet, proposalId, votingOpt);
};

export const getFeesFromGas = (estimatedGas: number) => {
    const fee = Math.ceil(estimatedGas * 0.1);
    return Math.max(fee, getFirmaConfig().defaultFee);
};

export const sendFCT = async (recoverValue: string, target: string, amount: number, estimatedGas: number, memo?: string) => {
    const wallet = await recoverWallet(recoverValue);
    return await getFirmaSDK().Bank.send(wallet, target, amount, {
        memo: memo,
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const sendToken = async (
    recoverValue: string,
    target: string,
    amount: number,
    tokenId: string,
    decimal: number,
    estimatedGas: number,
    memo?: string
) => {
    const wallet = await recoverWallet(recoverValue);
    return await getFirmaSDK().Bank.sendToken(wallet, target, tokenId, amount, decimal, {
        memo: memo,
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const sendIBC = async (
    recoverValue: string,
    port: string,
    channel: string,
    denom: string,
    target: string,
    amount: number,
    decimal: number,
    estimatedGas: number,
    memo?: string
) => {
    const wallet = await recoverWallet(recoverValue);
    const _amount = convertAmountByDecimalToTx(amount, decimal);
    const clientState = await getFirmaSDK().Ibc.getClientState(channel, port);
    const timeStamp = (Date.now() + 600000).toString() + '000000';
    const timeoutTimeStamp = BigInt(timeStamp);
    const height = {
        revisionHeight: BigInt(clientState.identified_client_state.client_state.latest_height.revision_height) + BigInt(1000),
        revisionNumber: BigInt(clientState.identified_client_state.client_state.latest_height.revision_number)
    };
    //! Added 'memo' parameter to fix type error (currently undefined)
    return await getFirmaSDK().Ibc.transfer(wallet, port, channel, denom, _amount, target, height, timeoutTimeStamp, undefined, {
        memo: memo,
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const addressCheck = (address: string) => {
    return FirmaUtil.isValidAddress(address);
};

// Staking
export const getDelegateList = async (address: string) => {
    try {
        return (await getFirmaSDK().Staking.getTotalDelegationInfo(address)).dataList;
    } catch (error) {
        console.log('getDelegateList : ', error);
        return [];
    }
};

export const getRedelegationList = async (address: string) => {
    try {
        return await getFirmaSDK().Staking.getTotalRedelegationInfo(address);
    } catch (error) {
        console.log('getRedelegationList : ', error);
        return [];
    }
};

export const getUndelegateList = async (address: string) => {
    try {
        return await getFirmaSDK().Staking.getTotalUndelegateInfo(address);
    } catch (error) {
        console.log('getUndelegateList : ', error);
        return [];
    }
};

export const getTotalReward = async (address: string) => {
    return await getFirmaSDK().Distribution.getTotalRewardInfo(address);
};

export const getStakingPoolState = async () => {
    return await getFirmaSDK().Staking.getPool();
};

export const getSlashingState = async () => {
    return await getFirmaSDK().Slashing.getSlashingParam();
};

export const getBankSupply = async () => {
    const denom = TOKEN_DENOM();
    const supply = await getFirmaSDK().Bank.getTokenSupply(denom);
    return convertNumber(supply);
};

export const getMintInflation = async () => {
    const inflation = await getFirmaSDK().Mint.getInflation();
    return convertNumber(inflation);
};

export const getValidators = async () => {
    const validatorList = await getFirmaSDK().Staking.getValidatorList();

    const dataList: ValidatorDataType[] = validatorList.dataList;
    let nextKey: string = validatorList.pagination.next_key;

    while (nextKey !== null) {
        const nextValidatorList = await getFirmaSDK().Staking.getValidatorList('' as StakingValidatorStatus, nextKey);
        const nextDataList = nextValidatorList.dataList;
        nextKey = nextValidatorList.pagination.next_key;

        dataList.push(...nextDataList);
    }

    return dataList;
};

export const getSigningInfos = async () => {
    return await getFirmaSDK().Slashing.getSigningInfos();
};

export const getSigningInfo = async (address: string) => {
    try {
        return await getFirmaSDK().Slashing.getSigningInfo(address);
    } catch {
        return null;
    }
};

export const getValidatorFromAddress = async (address: string) => {
    return await getFirmaSDK().Staking.getValidator(address);
};

export const getDelegationListFromValidator = async (address: string) => {
    return (await getFirmaSDK().Staking.getDelegationListFromValidator(address)).dataList;
};

export const getSelfDelegateAddressFromValOperAddress = async (address: string) => {
    return FirmaUtil.getAccAddressFromValOperAddress(address);
};

export const getStakingFromvalidator = async (address: string, validatorAddress: string) => {
    const balance = await getBalanceFromAdr(address);

    const totalReward = await getTotalReward(address);
    const reward = totalReward.rewards.find((value) => value.validator_address === validatorAddress);

    const delegateListOrigin = await getDelegateList(address);
    const delegation = delegateListOrigin.find((value) => value.delegation.validator_address === validatorAddress);

    const available = convertToFctNumber(convertNumber(balance));
    const delegated = convertToFctNumber(delegation ? delegation.balance.amount : 0);
    const undelegate = 0;
    const stakingReward = convertToFctNumber(reward ? reward.amount : 0);

    return {
        available,
        delegated,
        undelegate,
        stakingReward
    } satisfies IStakingState;
};

export const delegate = async (recoverValue: string, address: string, amount: number, estimatedGas: number) => {
    const wallet = await recoverWallet(recoverValue);
    return await getFirmaSDK().Staking.delegate(wallet, address, amount, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const redelegate = async (
    recoverValue: string,
    srcAddress: string,
    dstAddress: string,
    amount: number,
    estimatedGas: number,
    validatorAddressList?: string[]
) => {
    const wallet = await recoverWallet(recoverValue);

    if (validatorAddressList === undefined) {
        return await getFirmaSDK().Staking.redelegate(wallet, srcAddress, dstAddress, amount, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
    }

    registerAuthzRedelegateMessage();
    const authzTxClient = new AuthzTxClient(wallet, getFirmaConfig().rpcAddress);
    const messageList = await buildRedelegateTransactionMessages(wallet, srcAddress, dstAddress, amount, validatorAddressList);
    return await authzTxClient.signAndBroadcast(
        messageList,
        FirmaUtil.getSignAndBroadcastOption(getFirmaConfig().denom, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas),
            memo: ''
        })
    );
};

export const undelegate = async (recoverValue: string, address: string, amount: number, estimatedGas: number) => {
    const wallet = await recoverWallet(recoverValue);
    return await getFirmaSDK().Staking.undelegate(wallet, address, amount, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const grant = async (recoverValue: string, validatorAddress: string[], maxTokens: number, estimatedGas: number) => {
    const wallet = await recoverWallet(recoverValue);

    return await getFirmaSDK().Authz.grantStakeAuthorization(
        wallet,
        getRestakeAddress(),
        validatorAddress,
        1,
        buildRestakeGrantExpiration(),
        maxTokens,
        {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        }
    );
};

export const revoke = async (recoverValue: string, estimatedGas: number) => {
    const wallet = await recoverWallet(recoverValue);
    return await getFirmaSDK().Authz.revokeStakeAuthorization(wallet, getRestakeAddress(), 1, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const withdrawRewards = async (recoverValue: string, address: string, estimatedGas: number) => {
    const wallet = await recoverWallet(recoverValue);
    return await getFirmaSDK().Distribution.withdrawAllRewards(wallet, address, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const withdrawAllRewards = async (recoverValue: string, estimatedGas: number) => {
    const wallet = await recoverWallet(recoverValue);

    const delegationList = (await getFirmaSDK().Staking.getTotalDelegationInfo(await wallet.getAddress())).dataList;
    return await getFirmaSDK().Distribution.withdrawAllRewardsFromAllValidator(wallet, delegationList, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

export const voting = async (recoverValue: string, proposalId: number, votingOpt: number, estimatedGas: number) => {
    const wallet = await recoverWallet(recoverValue);
    return await getFirmaSDK().Gov.vote(wallet, proposalId, votingOpt, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
};

//Todo: Need to consider using bigint for amount and reward
export const getDelegations = async (address: string) => {
    try {
        const totalReward = await getTotalReward(address);
        const delegateListOrigin = await getDelegateList(address);
        const delegateListSort = [...delegateListOrigin].sort((a, b) => compareBigIntDesc(a.balance.amount, b.balance.amount));

        return delegateListSort.map((value) => {
            return {
                validatorAddress: value.delegation.validator_address,
                delegatorAddress: value.delegation.delegator_address,
                amount: convertNumber(value.balance.amount),
                reward: convertNumber(
                    totalReward.rewards.find((adr) => adr.validator_address === value.delegation.validator_address)?.amount
                ),
                moniker: value.delegation.validator_address,
                avatarURL: ''
            };
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getRedelegations = async (address: string) => {
    try {
        const redelegationListOrigin = await getRedelegationList(address);

        const redelegationList: IRedelegationInfo[] = [];
        redelegationListOrigin.map((redelegation) => {
            redelegation.entries.map((entry) => {
                redelegationList.push({
                    srcAddress: redelegation.redelegation.validator_src_address,
                    srcMoniker: '',
                    srcAvatarURL: '',
                    dstAddress: redelegation.redelegation.validator_dst_address,
                    dstMoniker: '',
                    dstAvatarURL: '',
                    balance: convertNumber(entry.redelegation_entry.shares_dst),
                    completionTime: entry.redelegation_entry.completion_time
                });
            });
        });

        const redelegationListSort = [...redelegationList].sort((a, b) => {
            return Date.parse(a.completionTime) - Date.parse(b.completionTime);
        });

        return redelegationListSort;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUndelegations = async (address: string) => {
    try {
        const undelegationListOrigin = await getUndelegateList(address);

        const undelegationList: IUndelegationInfo[] = [];
        undelegationListOrigin.map((undelegation) => {
            undelegation.entries.map((entry) => {
                undelegationList.push({
                    validatorAddress: undelegation.validator_address,
                    moniker: '',
                    avatarURL: '',
                    balance: convertNumber(entry.balance),
                    completionTime: entry.completion_time
                });
            });
        });

        const redelegationListSort = [...undelegationList].sort((a, b) => {
            return Date.parse(a.completionTime) - Date.parse(b.completionTime);
        });

        return redelegationListSort;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getStakingGrant = async (address: string) => {
    try {
        return (await getFirmaSDK().Authz.getStakingGrantData(address, getRestakeAddress(), 1)).dataList;
    } catch {
        return [];
    }
};

export const getStaking = async (address: string) => {
    const [balance, totalReward, delegateListOrigin, undelegateListOrigin] = await Promise.all([
        getBalanceFromAdr(address),
        getTotalReward(address),
        getDelegateList(address),
        getUndelegateList(address)
    ]);

    const available = convertNumber(balance);
    const stakingReward = convertToFctNumber(totalReward.total);

    const delegateListSort = [...delegateListOrigin].sort((a, b) => compareBigIntDesc(a.balance.amount, b.balance.amount));
    const delegationBalanceList = delegateListSort.map((value) => {
        return value.balance.amount;
    });
    const delegated = convertToFctNumber(
        delegationBalanceList.length > 0
            ? delegationBalanceList.reduce((prev: string, current: string) => {
                  return (convertNumber(prev) + convertNumber(current)).toString();
              })
            : 0
    );

    const undelegationBalanceList = undelegateListOrigin.map((value) => {
        return value.entries
            .map((value) => {
                return value.balance;
            })
            .reduce((prev: string, current: string) => {
                return (convertNumber(prev) + convertNumber(current)).toString();
            });
    });
    const undelegate = convertToFctNumber(
        undelegationBalanceList.length > 0
            ? undelegationBalanceList.reduce((prev: string, current: string) => {
                  return (convertNumber(prev) + convertNumber(current)).toString();
              })
            : 0
    );

    return {
        available,
        delegated,
        undelegate,
        stakingReward
    };
};

export const getNFTIdListOfOwner = async (address: string) => {
    try {
        const result = await getFirmaSDK().Nft.getNftIdListOfOwner(address);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getNFTItemFromId = async (id: string) => {
    try {
        const nft = await getFirmaSDK().Nft.getNftItem(id);
        return nft;
    } catch {
        console.log('error');
        return null;
    }
};

export const getProposals = async () => {
    const result = await getFirmaSDK().Gov.getAllProposalList();
    return result;
};

export const getProposalParams = async () => {
    const result = await getFirmaSDK().Gov.getParam();
    return result;
};

export const getProposalByProposalId = async (proposalId: string) => {
    const result = await getFirmaSDK().Gov.getProposal(proposalId);
    return result;
};

export const getProposalTally = async (proposalId: string) => {
    const result = await getFirmaSDK().Gov.getCurrentVoteInfo(proposalId);

    return {
        yes: result.yes_count,
        no: result.no_count,
        no_with_veto: result.no_with_veto_count,
        abstain: result.abstain_count
    };
};

// CW
export const getCW20Balance = async (contract: string, address: string) => {
    try {
        const balance = await getFirmaSDK().Cw20.getBalance(contract, address);
        return convertNumber(balance);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW20TokenInfo = async (contract: string) => {
    try {
        const info = await getFirmaSDK().Cw20.getTokenInfo(contract);
        return info;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW20TokenMarketingInfo = async (contract: string) => {
    try {
        const info = await getFirmaSDK().Cw20.getMarketingInfo(contract);
        return info;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW721NftIdList = async (contract: string, address: string, startId: string) => {
    try {
        const nftList = await getFirmaSDK().Cw721.getNFTIdListOfOwner(contract, address, 30, startId);
        return nftList;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW721NFTItemFromId = async (contract: string, id: string) => {
    try {
        const nft = await getFirmaSDK().Cw721.getNftData(contract, id);
        return nft;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const sendCW20 = async (
    recoverValue: string,
    target: string,
    amount: string,
    estimatedGas: number,
    contract: string,
    memo: string
) => {
    const wallet = await recoverWallet(recoverValue);
    const _amount = await convertCW20Amount(contract, amount);
    const send = await getFirmaSDK().Cw20.transfer(wallet, contract, target, _amount, {
        memo: memo,
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
    return send;
};

export const sendCW721NFT = async (
    recoverValue: string,
    target: string,
    tokenId: string,
    estimatedGas: number,
    contract: string,
    memo: string
) => {
    const wallet = await recoverWallet(recoverValue);
    const send = await getFirmaSDK().Cw721.transfer(wallet, contract, target, tokenId, {
        memo: memo,
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas)
    });
    return send;
};

export const convertCW20Amount = async (contract: string, amount: string) => {
    const tokenInfo = await getFirmaSDK().Cw20.getTokenInfo(contract);
    const result = convertAmountByDecimalToTx(amount, tokenInfo.decimals);
    return result;
};

export type ValidCWType = 'DEFAULT' | 'NON_EXIST' | 'CW20' | 'CW721' | 'ERROR';
export const verifyCWContract = async (contract: string): Promise<ValidCWType> => {
    try {
        await getCWContractInfo(contract);
    } catch {
        return 'NON_EXIST';
    }

    try {
        await getCW20ContractInfo(contract);
        return 'CW20';
    } catch (error) {
        console.log('Error in CW20 check:', error);
    }

    try {
        await getCW721ContractInfo(contract);
        return 'CW721';
    } catch (error) {
        console.log('Error in Cw721 check:', error);
        return 'ERROR';
    }
};

export const getCWContractInfo = async (contract: string) => {
    try {
        const result = await getFirmaSDK().CosmWasm.getContractInfo(contract);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW20ContractInfo = async (contract: string) => {
    try {
        const result = await getFirmaSDK().Cw20.getTokenInfo(contract);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW20ExtraInfo = async (contract: string) => {
    try {
        const marketing = await getFirmaSDK().Cw20.getMarketingInfo(contract);

        return {
            marketing
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW721ContractInfo = async (contract: string) => {
    try {
        const result = await getFirmaSDK().Cw721.getContractInfo(contract);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW721TotalNFTs = async (contract: string) => {
    try {
        const totalSupply = await getFirmaSDK().Cw721.getTotalNfts(contract);
        const totalNFTIds = await getFirmaSDK().Cw721.getAllNftIdList(contract);

        return {
            totalSupply,
            totalNFTIds
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getCW721NFTImage = async ({ contractAddress, tokenId }: { contractAddress: string; tokenId: string }) => {
    try {
        const tokenURI = await firmaSDK.Cw721.getNftTokenUri(contractAddress, tokenId);
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        const imageURI = metadata.imageURI || '';

        return imageURI;
    } catch (error) {
        console.log(error);
        return '';
    }
};
