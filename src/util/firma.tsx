import { FirmaMobileSDK, FirmaUtil } from '@firmachain/firma-js';
import { FirmaWalletService } from '@firmachain/firma-js/dist/sdk/FirmaWalletService';
import { IRedelegationInfo, IStakingState, IUndelegationInfo } from '@/hooks/staking/hooks';
import { CHAIN_NETWORK, FIRMACHAIN_DEFAULT_CONFIG } from '@/../config';
import { convertNumber, convertToFctNumber } from './common';
import { getDecryptPassword, getMnemonic } from './wallet';

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

let firmaSDK: FirmaMobileSDK;
let restakeAddress: string;

export const setFirmaSDK = (network: string) => {
    if (network === 'MainNet') {
        firmaSDK = new FirmaMobileSDK(FIRMACHAIN_DEFAULT_CONFIG);
    } else {
        firmaSDK = new FirmaMobileSDK(CHAIN_NETWORK[network].FIRMACHAIN_CONFIG);
    }
    restakeAddress = CHAIN_NETWORK[network].RESTAKE_ADDRESS;
};

export const getFirmaSDK = () => {
    return firmaSDK;
};

export const getRestakeAddress = () => {
    return restakeAddress;
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

export const recoverFromMnemonic = async (mnemonic: string) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        return wallet;
    } catch (error) {
        console.log('recoverFromMnemonic error : ' + error);
        throw error;
    }
};

export const getPrivateKeyFromMnemonic = async (mnemonic: string) => {
    try {
        let wallet = await recoverFromMnemonic(mnemonic);
        let privateKey = await wallet?.getPrivateKey();
        return privateKey;
    } catch (error) {
        console.log('getPrivateKeyFromMnemonic error : ' + error);
        throw error;
    }
};

export const getAdrFromMnemonic = async (mnemonic: string) => {
    try {
        let wallet = await recoverFromMnemonic(mnemonic);
        let address = await wallet?.getAddress();
        return address;
    } catch (error) {
        console.log('getAdrFromMnemonic error : ' + error);
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
        let result = await getMnemonic(walletName, password);
        let mnemonic = result === null ? '' : result;
        return await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
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
    return Math.max(fee, FIRMACHAIN_DEFAULT_CONFIG.defaultFee);
};

export const sendFCT = async (mnemonic: string, target: string, amount: number, estimatedGas: number, memo?: string) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
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

export const delegate = async (mnemonic: string, address: string, amount: number, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        let result = await getFirmaSDK().Staking.delegate(wallet, address, amount, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
        return result;
    } catch (error) {
        throw error;
    }
};

export const redelegate = async (mnemonic: string, srcAddress: string, dstAddress: string, amount: number, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        let result = await getFirmaSDK().Staking.redelegate(wallet, srcAddress, dstAddress, amount, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });
        return result;
    } catch (error) {
        throw error;
    }
};

export const undelegate = async (mnemonic: string, address: string, amount: number, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        let result = await getFirmaSDK().Staking.undelegate(wallet, address, amount, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const grant = async (mnemonic: string, validatorAddress: string[], maxTokens: number, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
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

export const revoke = async (mnemonic: string, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        let result = await getFirmaSDK().Authz.revokeStakeAuthorization(wallet, getRestakeAddress(), 1, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const withdrawRewards = async (mnemonic: string, address: string, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        const result = await getFirmaSDK().Distribution.withdrawAllRewards(wallet, address, {
            gas: estimatedGas,
            fee: getFeesFromGas(estimatedGas)
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export const withdrawAllRewards = async (mnemonic: string, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
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

export const voting = async (mnemonic: string, proposalId: number, votingOpt: number, estimatedGas: number) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
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
        const balance = await getBalanceFromAdr(address);
        const available = convertNumber(balance);
        const totalReward = await getTotalReward(address);
        const stakingReward = convertToFctNumber(totalReward.total);

        const delegateListOrigin = await getDelegateList(address);
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

        const undelegateListOrigin = await getUndelegateList(address);
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
        let idList = result.nftIdList;

        return idList;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getNFTItemFromId = async (id: string) => {
    let nft = await getFirmaSDK().Nft.getNftItem(id);

    return nft;
};
