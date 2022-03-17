import { FirmaMobileSDK, FirmaUtil } from "@firmachain/firma-js"
import { FirmaWalletService } from "@firmachain/firma-js/dist/sdk/FirmaWalletService";
import { RedelegationInfo, StakingState, UndelegationInfo } from "@/hooks/staking/hooks";
import { CHAIN_NETWORK, FIRMACHAIN_DEFAULT_CONFIG } from "@/../config";
import { convertNumber, convertToFctNumber } from "./common";
import { getDecryptPassword, getWallet } from "./wallet";

let firmaSDK = new FirmaMobileSDK(CHAIN_NETWORK["MainNet"].FIRMACHAIN_CONFIG);

export const setFirmaSDK = (network:string) => {
    firmaSDK = new FirmaMobileSDK(CHAIN_NETWORK[network].FIRMACHAIN_CONFIG);
}

const getFirmaSDK = () => {
    return firmaSDK;
}

export interface Wallet {
    name?: string;
    password?: string;
    mnemonic?: string;
    privatekey?: string;
}

export interface TransactionState {
    walletName: string;
    password: string;
    targetAddress: string;
    amount: number;
}

// Wallet
export const createNewWallet = async() => {
    try {
        let wallet = await getFirmaSDK().Wallet.newWallet();
        return organizeWallet(wallet);
    } catch (error) {
        console.log('createNewWallet error : ' + error);
    }
}

export const recoverFromMnemonic = async(mnemonic:string) => {
    try {
        let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
        return wallet;
    } catch (error) {
        console.log('recoverFromMnemonic error : ' + error);
    }
}

export const getPrivateKeyFromMnemonic = async(mnemonic:string) => {
    try {
        let wallet = await recoverFromMnemonic(mnemonic); 
        let privateKey = await wallet?.getPrivateKey();
        return privateKey;
    } catch (error) {
        console.log("getPrivateKeyFromMnemonic error : " + error);
    }
}

export const getAdrFromMnemonic = async(mnemonic:string) => {
    try {
        let wallet = await recoverFromMnemonic(mnemonic); 
        let address = await wallet?.getAddress();
        return address;
    } catch (error) {
        console.log('getAdrFromMnemonic error : ' + error);
    }
}

export const getBalanceFromAdr = async(address:string) => {    
    try {
        let balance = await getFirmaSDK().Bank.getBalance(address);
        return balance;
    } catch (error) {
        console.log('getBalanceFromAdr error : ' + error); 
        return 0;
    }
}

const organizeWallet = async(wallet:FirmaWalletService) => {
    try {
        let _mnemonic = wallet.getMnemonic();
        let _privateKey = wallet.getPrivateKey();
        let _address = await wallet.getAddress();
        let _balance = await getBalanceFromAdr(_address);

        const result = {
            mnemonic: _mnemonic,
            privateKey: _privateKey,
            address: _address,
            balance: _balance,
        }
        return result;
    } catch (error) {
        console.log('organizeWallet error : ' + error);
    }
}

export const getDecryptWalletInfo = async(walletName:string) => {
    let password = await getDecryptPassword();
    let mnemonic = await getWallet(walletName, password);
    return await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
}

export const getEstimateGasFromAllDelegations = async(walletName:string) => {
    let wallet = await getDecryptWalletInfo(walletName);
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(await wallet.getAddress())
    const estimatedGas = await getFirmaSDK().Distribution.getGasEstimationWithdrawAllRewardsFromAllValidator(wallet, delegationList);
    return estimatedGas;
}

export const getEstimateGasFromDelegation = async(walletName:string, validatorAddress:string,) => {
    let wallet = await getDecryptWalletInfo(walletName);
    const estimatedGas = await getFirmaSDK().Distribution.getGasEstimationWithdrawAllRewards(wallet, validatorAddress);
    return estimatedGas;
}

export const getEstimateGasDelegate = async(walletName:string, validatorAddress:string, amount:number) => {
    let wallet = await getDecryptWalletInfo(walletName);
    const gasEstimation = await getFirmaSDK().Staking.getGasEstimationDelegate(wallet, validatorAddress, amount);
    return gasEstimation;
}

export const getEstimateGasUndelegate = async(walletName:string, validatorAddress:string, amount:number) => {
    let wallet = await getDecryptWalletInfo(walletName);
    const gasEstimation = await getFirmaSDK().Staking.getGasEstimationUndelegate(wallet, validatorAddress, amount);
    return gasEstimation;
}

export const getEstimateGasRedelegate = async(walletName:string, validatorSrcAddress:string, validatorDstAddress:string, amount:number) => {
    let wallet = await getDecryptWalletInfo(walletName);
    const gasEstimation = await getFirmaSDK().Staking.getGasEstimationRedelegate(wallet, validatorSrcAddress, validatorDstAddress, amount);
    return gasEstimation;
}


export const getEstimateGasSend = async(walletName:string, address:string, amount:number) => {
    let wallet = await getDecryptWalletInfo(walletName);
    const gasEstimation = await getFirmaSDK().Bank.getGasEstimationSend(wallet, address, amount);
    return gasEstimation;
}

export const getFeesFromGas = (estimatedGas: number) => {
    const fee = Math.round(estimatedGas * 0.1);
    return Math.max(fee, FIRMACHAIN_DEFAULT_CONFIG.defaultFee);
};

export const sendFCT = async(mnemonic:string, target:string, amount:number, estimatedGas:number, memo?:string) => {
    let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
    let send = await getFirmaSDK().Bank.send(wallet, target, amount, {
        memo: memo,
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas),
    });
    return send;
}

export const addressCheck = (address:string) => {
    return FirmaUtil.isValidAddress(address);
}

// Staking
export const getDelegateList = async(address:string) => {
    try {
        return await getFirmaSDK().Staking.getTotalDelegationInfo(address);
    } catch (error) {
        console.log("getDelegateList : ", error);
        return [];
    }
}

export const getRedelegationList = async(address:string) => {
    try {
        return await getFirmaSDK().Staking.getTotalRedelegationInfo(address);
    } catch (error) {
        console.log("getRedelegationList : ", error);
        return [];
    }
}

export const getUndelegateList = async(address:string) => {
    try {
        return await getFirmaSDK().Staking.getTotalUndelegateInfo(address);
    } catch (error) {
        console.log("getUndelegateList : ", error);
        return [];
    }
}

export const getTotalReward = async(address:string) => {
    return await getFirmaSDK().Distribution.getTotalRewardInfo(address);
}

export const getStakingFromvalidator = async(address:string, validatorAddress:string) => {
    const balance = await getBalanceFromAdr(address);

    const totalReward = await getTotalReward(address);
    const reward = totalReward.rewards.find((value) => value.validator_address === validatorAddress);

    const delegateListOrigin = await getDelegateList(address);
    const delegation = delegateListOrigin.find((value) => value.delegation.validator_address === validatorAddress);

    const available = convertToFctNumber(convertNumber(balance));
    const delegated = convertToFctNumber(delegation ? delegation.balance.amount : 0);
    const undelegate = 0;
    const stakingReward = convertToFctNumber(reward ? reward.amount : 0);

    const values: StakingState = {
        available,
        delegated,
        undelegate,
        stakingReward,
    }

    return values;
}

export const delegate = async(mnemonic:string, address:string, amount:number, estimatedGas:number) => {
    let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
    let result = await getFirmaSDK().Staking.delegate(wallet, address, amount,{
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas),
    });

    return result;
}

export const redelegate = async(mnemonic:string, srcAddress:string, dstAddress:string, amount:number, estimatedGas:number) => {
    let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
    let result = await getFirmaSDK().Staking.redelegate(wallet, srcAddress, dstAddress, amount, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas),
    });
    return result;
}

export const undelegate = async(mnemonic:string, address:string, amount:number, estimatedGas:number) => {
    let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
    let result = await getFirmaSDK().Staking.undelegate(wallet, address, amount, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas),
    });

    return result;
}

export const withdrawRewards = async (mnemonic:string, address:string, estimatedGas:number) => {
    let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
    const result = await getFirmaSDK().Distribution.withdrawAllRewards(wallet, address, {
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas),
    });

    return result;
};

export const withdrawAllRewards = async (mnemonic:string, estimatedGas:number) => {
    let wallet = await getFirmaSDK().Wallet.fromMnemonic(mnemonic);
    const delegationList = await getFirmaSDK().Staking.getTotalDelegationInfo(await wallet.getAddress())
    const result = await getFirmaSDK().Distribution.withdrawAllRewardsFromAllValidator(wallet, delegationList,{
        gas: estimatedGas,
        fee: getFeesFromGas(estimatedGas),
    });

    return result;
};

export const getDelegations = async(address:string) => {
    const totalReward = await getTotalReward(address);
    const delegateListOrigin = await getDelegateList(address);
    const delegateListSort = delegateListOrigin.sort((a: any, b: any) => b.balance.amount - a.balance.amount);
    const delegateList = delegateListSort.map((value) => {
        return {
            validatorAddress: value.delegation.validator_address,
            delegatorAddress: value.delegation.delegator_address,
            amount: convertNumber(value.balance.amount),
            reward: convertNumber(totalReward.rewards.find((adr) => adr.validator_address === value.delegation.validator_address)?.amount),
            moniker: value.delegation.validator_address,
            avatarURL: "",
        };
    });

    return delegateList;
}

export const getRedelegations = async(address:string) => {
    const redelegationListOrigin = await getRedelegationList(address);
    
    let redelegationList:RedelegationInfo[] = []; 
    redelegationListOrigin.map((redelegation) => {
        redelegation.entries.map((entry) => {
            redelegationList.push({
                srcAddress: redelegation.redelegation.validator_src_address,
                srcMoniker: "",
                srcAvatarURL: "",
                dstAddress: redelegation.redelegation.validator_dst_address,
                dstMoniker: "",
                dstAvatarURL: "",
                balance: convertNumber(entry.redelegation_entry.shares_dst),
                completionTime: entry.redelegation_entry.completion_time,
            })
        })
    })

    const redelegationListSort = redelegationList.sort((a: any, b: any) => {
            return new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime()
        });

    return redelegationListSort;
}

export const getUndelegations = async(address:string) => {
    const undelegationListOrigin = await getUndelegateList(address);
    
    let undelegationList:UndelegationInfo[] = []; 
    undelegationListOrigin.map((undelegation) => {
        undelegation.entries.map((entry) => {
            undelegationList.push({
                validatorAddress: undelegation.validator_address,
                moniker: "",
                avatarURL: "",
                balance: convertNumber(entry.balance),
                completionTime: entry.completion_time,
            })
        })
    })

    const redelegationListSort = undelegationList.sort((a: any, b: any) => {
            return new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime()
        });

    return redelegationListSort;
}

export const getStaking = async(address:string) => {
    const balance = await getBalanceFromAdr(address);
    
    const available = convertNumber(balance);

    const totalReward = await getTotalReward(address);
    
    const stakingReward = convertToFctNumber(totalReward.total);

    const delegateListOrigin = await getDelegateList(address);
    const delegateListSort = delegateListOrigin.sort((a: any, b: any) => b.balance.amount - a.balance.amount);
    const delegationBalanceList = delegateListSort.map((value) => {
        return value.balance.amount;
    });
    const delegated = convertToFctNumber(delegationBalanceList.length > 0
        ? delegationBalanceList.reduce((prev: string, current: string) => {
            return (convertNumber(prev) + convertNumber(current)).toString();
        })
        : 0
    );

    const undelegateListOrigin = await getUndelegateList(address);
    const undelegationBalanceList = undelegateListOrigin.map((value) => {
        return value.entries.map((value) => {
            return value.balance;
        }).reduce((prev: string, current: string) => {
            return (convertNumber(prev) + convertNumber(current)).toString();
        });
    });
    const undelegate = convertToFctNumber(undelegationBalanceList.length > 0
        ? undelegationBalanceList.reduce((prev: string, current: string) => {
            return (convertNumber(prev) + convertNumber(current)).toString();
        })
        : 0
    );

    const staking = {
        available,
        delegated,
        undelegate,
        stakingReward,
    }

    return staking;
}