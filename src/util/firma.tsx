import { FirmaSDK, FirmaUtil, ValidatorDataType } from '@firmachain/firma-js';
import { FirmaWalletService } from '@firmachain/firma-js/dist/sdk/FirmaWalletService';
import { IRedelegationInfo, IStakingState, IUndelegationInfo } from '@/hooks/staking/hooks';
import { CHAIN_NETWORK, FIRMACHAIN_DEFAULT_CONFIG } from '@/../config';
import { convertAmountByDecimalToTx, convertNumber, convertToFctNumber } from './common';
import { getDecryptPassword, getRecoverValue } from './wallet';
import { TOKEN_DENOM } from '@/constants/common';
import { StakingValidatorStatus } from '@firmachain/firma-js/dist/sdk/FirmaStakingService';
import Long from 'long';

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
    return getFirmaSDK().Config
}

export const getChainInfo = async () => {
    try {
        const result = await getFirmaSDK().BlockChain.getChainInfo();
        return result;
    } catch (error) {
        throw error;
    }
};

// Wallet
export const createNewWallet = async () => {
    try {
        let wallet = await getFirmaSDK().Wallet.newWallet();
        return organizeWallet(wallet);
    } catch (error) {
        console.log('createNewWallet error : ' + error);
        throw error;
    }
};

export const mnemonicCheck = async (mnemonic: string) => {
    try {
        let valid = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
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

export const recoverWallet = async (recoverValue: string) => {
    try {
        let wallet;
        let isMnemonic = await mnemonicCheck(recoverValue);
        if (isMnemonic) {
            wallet = await getFirmaSDK().Wallet.fromMnemonic(recoverValue);
        } else {
            wallet = await getFirmaSDK().Wallet.fromPrivateKey(recoverValue);
        }
        return wallet;
    } catch (error) {
        throw error;
    }
};

export const getPrivateKeyFromMnemonic = async (mnemonic: string) => {
    try {
        let wallet = await recoverWallet(mnemonic);
        let privateKey = wallet.getPrivateKey();
        return privateKey;
    } catch (error) {
        console.log('getPrivateKeyFromMnemonic error : ' + error);
        throw error;
    }
};

export const getAddressFromRecoverValue = async (recoverValue: string) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let address = wallet.getAddress();
        return address;
    } catch (error) {
        console.log('getAddressFromRecoverValue error : ' + error);
        throw error;
    }
};

export const getBalanceFromAdr = async (address: string) => {
    try {
        let balance = await getFirmaSDK().Bank.getBalance(address);
        return balance;
    } catch (error) {
        console.log('getBalanceFromAdr error : ' + error);
        throw error;
    }
};

export const getTokenList = async (address: string) => {
    try {
        const list = await getFirmaSDK().Bank.getTokenBalanceList(address);

        return list
    } catch (error) {
        console.log('getTokenList error : ', error);
        throw error;
    }
}

export const getTokenBalance = async (address: string, denom: string) => {
    try {
        let balance = 0;
        let allList = await getFirmaSDK().Bank.getTokenBalanceList(address);
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
        let _mnemonic = wallet.getMnemonic();
        let _privateKey = wallet.getPrivateKey();
        let _address = await wallet.getAddress();

        let _balance = await getBalanceFromAdr(_address);

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
    try {
        let password = await getDecryptPassword();
        let result = await getRecoverValue(walletName, password);
        let recoverValue = result === null ? '' : result;
        return await recoverWallet(recoverValue);
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasFromAllDelegations = async (walletName: string) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const delegationList = (await getFirmaSDK().Staking.getTotalDelegationInfo(await wallet.getAddress())).dataList;
        const estimatedGas = await getFirmaSDK().Distribution.getGasEstimationWithdrawAllRewardsFromAllValidator(wallet, delegationList);
        return estimatedGas;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasFromDelegation = async (walletName: string, validatorAddress: string) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const estimatedGas = await getFirmaSDK().Distribution.getGasEstimationWithdrawAllRewards(wallet, validatorAddress);
        return estimatedGas;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasDelegate = async (walletName: string, validatorAddress: string, amount: number) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Staking.getGasEstimationDelegate(wallet, validatorAddress, amount);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasUndelegate = async (walletName: string, validatorAddress: string, amount: number) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Staking.getGasEstimationUndelegate(wallet, validatorAddress, amount);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasRedelegate = async (
    walletName: string,
    validatorSrcAddress: string,
    validatorDstAddress: string,
    amount: number
) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Staking.getGasEstimationRedelegate(
            wallet,
            validatorSrcAddress,
            validatorDstAddress,
            amount
        );
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasGrantStakeAuthorization = async (walletName: string, validatorAddress: string[]) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        let date = new Date();
        date.setFullYear(date.getFullYear() + 1);

        const gasEstimation = await getFirmaSDK().Authz.getGasEstimationGrantStakeAuthorization(
            wallet,
            getRestakeAddress(),
            validatorAddress,
            1,
            date,
            0
        );
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasRevokeStakeAuthorization = async (walletName: string) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Authz.getGasEstimationRevokeStakeAuthorization(wallet, getRestakeAddress(), 1);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasSend = async (walletName: string, address: string, amount: number) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Bank.getGasEstimationSend(wallet, address, amount);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasSendToken = async (walletName: string, address: string, tokenId: string, amount: number, decimal: number) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Bank.getGasEstimationSendToken(wallet, address, tokenId, amount, decimal);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasSendIBC = async (walletName: string, port: string, channel: string, denom: string, address: string, amount: number, decimal: number) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const _amount = convertAmountByDecimalToTx(amount, decimal);
        const clientState = await getFirmaSDK().Ibc.getClientState(channel, port);
        const timeStamp = (Date.now() + 600000).toString() + "000000";
        const timeoutTimeStamp = Long.fromString(timeStamp, true);
        const height = {
            revisionHeight: Long.fromString(clientState.identified_client_state.client_state.latest_height.revision_height, true).add(Long.fromNumber(1000)),
            revisionNumber: Long.fromString(clientState.identified_client_state.client_state.latest_height.revision_number, true),
        }

        const gasEstimation = await getFirmaSDK().Ibc.getGasEstimationTransfer(wallet, port, channel, denom, _amount, address, height, timeoutTimeStamp);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasSendCW20 = async (walletName: string, contract: string, address: string, amount: string) => {
    try {
        const wallet = await getDecryptWalletInfo(walletName);
        const _amount = await convertCW20Amount(contract, amount);
        const gasEstimation = await getFirmaSDK().Cw20.getGasEstimationTransfer(wallet, contract, address, _amount);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};


export const getEstimateGasSendCW721 = async (walletName: string, contract: string, address: string, tokenId: string) => {
    try {
        const wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Cw721.getGasEstimationTransfer(wallet, contract, address, tokenId)
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getEstimateGasVoting = async (walletName: string, proposalId: number, votingOpt: number) => {
    try {
        let wallet = await getDecryptWalletInfo(walletName);
        const gasEstimation = await getFirmaSDK().Gov.getGasEstimationVote(wallet, proposalId, votingOpt);
        return gasEstimation;
    } catch (error) {
        throw error;
    }
};

export const getFeesFromGas = (estimatedGas: number) => {
    const fee = Math.ceil(estimatedGas * 0.1);
    return Math.max(fee, getFirmaConfig().defaultFee);
};

export const sendFCT = async (recoverValue: string, target: string, amount: number, estimatedGas: number, memo?: string) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let send = await getFirmaSDK().Bank.send(wallet, target, amount, {
            memo: memo,
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
        return send;
    } catch (error) {
        throw error;
    }
};

export const sendToken = async (recoverValue: string, target: string, amount: number, tokenId: string, decimal: number, estimatedGas: number, memo?: string) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let send = await getFirmaSDK().Bank.sendToken(wallet, target, tokenId, amount, decimal, {
            memo: memo,
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
        return send;
    } catch (error) {
        throw error;
    }
};

export const sendIBC = async (recoverValue: string, port: string, channel: string, denom: string, target: string, amount: number, decimal: number, estimatedGas: number, memo?: string) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        const _amount = convertAmountByDecimalToTx(amount, decimal);
        const clientState = await getFirmaSDK().Ibc.getClientState(channel, port);
        const timeStamp = (Date.now() + 600000).toString() + "000000";
        const timeoutTimeStamp = Long.fromString(timeStamp, true);
        const height = {
            revisionHeight: Long.fromString(clientState.identified_client_state.client_state.latest_height.revision_height, true).add(Long.fromNumber(1000)),
            revisionNumber: Long.fromString(clientState.identified_client_state.client_state.latest_height.revision_number, true),
        }
        let send = await getFirmaSDK().Ibc.transfer(wallet, port, channel, denom, _amount, target, height, timeoutTimeStamp, {
            memo: memo,
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
        return send;
    } catch (error) {
        throw error;
    }
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
    try {
        return await getFirmaSDK().Distribution.getTotalRewardInfo(address);
    } catch (error) {
        throw error;
    }
};

export const getStakingPoolState = async () => {
    try {
        const pool = await getFirmaSDK().Staking.getPool();
        return pool;
    } catch (error) {
        throw error;
    }
};

export const getSlashingState = async () => {
    try {
        const slashing = await getFirmaSDK().Slashing.getSlashingParam();
        return slashing;
    } catch (error) {
        throw error;
    }
};

export const getBankSupply = async () => {
    try {
        const denom = TOKEN_DENOM();
        const supply = await getFirmaSDK().Bank.getTokenSupply(denom);
        return convertNumber(supply);
    } catch (error) {
        throw error;
    }
};

export const getMintInflation = async () => {
    try {
        const inflation = await getFirmaSDK().Mint.getInflation();
        return convertNumber(inflation);
    } catch (error) {
        throw error;
    }
};

export const getValidators = async () => {
    try {
        const validatorList = await getFirmaSDK().Staking.getValidatorList();

        let dataList: ValidatorDataType[] = validatorList.dataList;
        let nextKey: string = validatorList.pagination.next_key;

        while (nextKey !== null) {
            const nextValidatorList = await getFirmaSDK().Staking.getValidatorList("" as StakingValidatorStatus, nextKey);
            const nextDataList = nextValidatorList.dataList;
            nextKey = nextValidatorList.pagination.next_key;

            dataList.push(...nextDataList);
        }

        return dataList;
    } catch (error) {
        throw error;
    }
};

export const getSigningInfos = async () => {
    try {
        const result = await getFirmaSDK().Slashing.getSigningInfos();
        return result;
    } catch (error) {
        throw error;
    }
};

export const getSigningInfo = async (address: string) => {
    try {
        const result = await getFirmaSDK().Slashing.getSigningInfo(address);
        return result;
    } catch (error) { }
};

export const getValidatorFromAddress = async (address: string) => {
    try {
        const validator = await getFirmaSDK().Staking.getValidator(address);
        return validator;
    } catch (error) {
        throw error;
    }
};

export const getDelegationListFromValidator = async (address: string) => {
    try {
        const delegation = (await getFirmaSDK().Staking.getDelegationListFromValidator(address)).dataList;
        return delegation;
    } catch (error) {
        throw error;
    }
};

export const getSelfDelegateAddressFromValOperAddress = async (address: string) => {
    try {
        const selfDelegateAddress = FirmaUtil.getAccAddressFromValOperAddress(address);
        return selfDelegateAddress;
    } catch (error) {
        throw error;
    }
};

export const getStakingFromvalidator = async (address: string, validatorAddress: string) => {
    try {
        const balance = await getBalanceFromAdr(address);

        const totalReward = await getTotalReward(address);
        const reward = totalReward.rewards.find((value) => value.validator_address === validatorAddress);

        const delegateListOrigin = await getDelegateList(address);
        const delegation = delegateListOrigin.find((value) => value.delegation.validator_address === validatorAddress);

        const available = convertToFctNumber(convertNumber(balance));
        const delegated = convertToFctNumber(delegation ? delegation.balance.amount : 0);
        const undelegate = 0;
        const stakingReward = convertToFctNumber(reward ? reward.amount : 0);

        const values: IStakingState = {
            available,
            delegated,
            undelegate,
            stakingReward
        };

        return values;
    } catch (error) {
        throw error;
    }
};

export const delegate = async (recoverValue: string, address: string, amount: number, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let result = await getFirmaSDK().Staking.delegate(wallet, address, amount, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
        return result;
    } catch (error) {
        throw error;
    }
};

export const redelegate = async (recoverValue: string, srcAddress: string, dstAddress: string, amount: number, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let result = await getFirmaSDK().Staking.redelegate(wallet, srcAddress, dstAddress, amount, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
        return result;
    } catch (error) {
        throw error;
    }
};

export const undelegate = async (recoverValue: string, address: string, amount: number, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let result = await getFirmaSDK().Staking.undelegate(wallet, address, amount, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const grant = async (recoverValue: string, validatorAddress: string[], maxTokens: number, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let date = new Date();
        date.setFullYear(date.getFullYear() + 1);

        let result = await getFirmaSDK().Authz.grantStakeAuthorization(wallet, getRestakeAddress(), validatorAddress, 1, date, maxTokens, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const revoke = async (recoverValue: string, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        let result = await getFirmaSDK().Authz.revokeStakeAuthorization(wallet, getRestakeAddress(), 1, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const withdrawRewards = async (recoverValue: string, address: string, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        const result = await getFirmaSDK().Distribution.withdrawAllRewards(wallet, address, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const withdrawAllRewards = async (recoverValue: string, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);

        const delegationList = (await getFirmaSDK().Staking.getTotalDelegationInfo(await wallet.getAddress())).dataList;
        const result = await getFirmaSDK().Distribution.withdrawAllRewardsFromAllValidator(wallet, delegationList, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const voting = async (recoverValue: string, proposalId: number, votingOpt: number, estimatedGas: number) => {
    try {
        let wallet = await recoverWallet(recoverValue);
        const result = await getFirmaSDK().Gov.vote(wallet, proposalId, votingOpt, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const getDelegations = async (address: string) => {
    try {
        const totalReward = await getTotalReward(address);
        const delegateListOrigin = await getDelegateList(address);
        const delegateListSort = delegateListOrigin.sort((a: any, b: any) => b.balance.amount - a.balance.amount);
        const delegateList = delegateListSort.map((value) => {
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
        return delegateList;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getRedelegations = async (address: string) => {
    try {
        const redelegationListOrigin = await getRedelegationList(address);

        let redelegationList: IRedelegationInfo[] = [];
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

        const redelegationListSort = redelegationList.sort((a: any, b: any) => {
            return new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime();
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

        let undelegationList: IUndelegationInfo[] = [];
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

        const redelegationListSort = undelegationList.sort((a: any, b: any) => {
            return new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime();
        });

        return redelegationListSort;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getStakingGrant = async (address: string) => {
    try {
        const data = await getFirmaSDK().Authz.getStakingGrantData(address, getRestakeAddress(), 1);
        const grantData = data.dataList;

        return grantData;
    } catch (error) {
        return [];
    }
};

export const getStaking = async (address: string) => {
    try {
        const [balance, totalReward, delegateListOrigin, undelegateListOrigin] = await Promise.all([
            getBalanceFromAdr(address),
            getTotalReward(address),
            getDelegateList(address),
            getUndelegateList(address)
        ]);

        const available = convertNumber(balance);
        const stakingReward = convertToFctNumber(totalReward.total);

        const delegateListSort = delegateListOrigin.sort((a: any, b: any) => b.balance.amount - a.balance.amount);
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

        const staking = {
            available,
            delegated,
            undelegate,
            stakingReward
        };
        return staking;
    } catch (error) {
        throw error;
    }
};

export const getNFTIdListOfOwner = async (address: string) => {
    try {
        let result = await getFirmaSDK().Nft.getNftIdListOfOwner(address);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getNFTItemFromId = async (id: string) => {
    try {
        let nft = await getFirmaSDK().Nft.getNftItem(id);
        return nft;
    } catch (error) {
        console.log('error');
        return null;
    }
};

export const getProposals = async () => {
    try {
        let result = await getFirmaSDK().Gov.getProposalList();
        return result;
    } catch (error) {
        throw error;
    }
};

export const getProposalParams = async () => {
    try {
        let result = await getFirmaSDK().Gov.getParam();
        return result;
    } catch (error) {
        throw error;
    }
};

export const getProposalByProposalId = async (proposalId: string) => {
    try {
        let result = await getFirmaSDK().Gov.getProposal(proposalId);
        return result;
    } catch (error) {
        throw error;
    }
};

export const getProposalTally = async (proposalId: string) => {
    try {
        let result = await getFirmaSDK().Gov.getCurrentVoteInfo(proposalId);
        return result;
    } catch (error) {
        throw error;
    }
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
}

export const getCW20TokenInfo = async (contract: string) => {
    try {
        const info = await getFirmaSDK().Cw20.getTokenInfo(contract);
        return info
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getCW20TokenMarketingInfo = async (contract: string) => {
    try {
        const info = await getFirmaSDK().Cw20.getMarketingInfo(contract);
        return info
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getCW721NftIdList = async (contract: string, address: string, startId: string) => {
    try {
        const nftList = await getFirmaSDK().Cw721.getNFTIdListOfOwner(contract, address, 30, startId);
        return nftList;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const getCW721NFTItemFromId = async (contract: string, id: string) => {
    try {
        let nft = await getFirmaSDK().Cw721.getNftData(contract, id);
        return nft;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const sendCW20 = async (recoverValue: string, target: string, amount: string, estimatedGas: number, contract: string, memo: string) => {
    try {
        const wallet = await recoverWallet(recoverValue);
        const _amount = await convertCW20Amount(contract, amount);
        const send = await getFirmaSDK().Cw20.transfer(wallet, contract, target, _amount, { memo: memo, gas: estimatedGas, fee: getFeesFromGas(estimatedGas) })
        return send;
    } catch (error) {
        throw error;
    }
};

export const sendCW721NFT = async (recoverValue: string, target: string, tokenId: string, estimatedGas: number, contract: string, memo: string) => {
    try {
        const wallet = await recoverWallet(recoverValue);
        const send = await getFirmaSDK().Cw721.transfer(wallet, contract, target, tokenId, { memo: memo, gas: estimatedGas, fee: getFeesFromGas(estimatedGas) })
        return send;
    } catch (error) {
        throw error;
    }
};

export const convertCW20Amount = async (contract: string, amount: string) => {
    try {
        const tokenInfo = await getFirmaSDK().Cw20.getTokenInfo(contract);
        const result = convertAmountByDecimalToTx(amount, tokenInfo.decimals);
        return result;
    } catch (error) {
        throw error;
    }
}