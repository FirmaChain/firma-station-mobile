import { StakingValues } from "@/hooks/staking/hooks";
import { FirmaMobileSDK } from "@firmachain/firma-js"
import { FirmaConfig } from "@firmachain/firma-js"
import { FirmaWalletService } from "@firmachain/firma-js/dist/sdk/FirmaWalletService";
import { convertNumber, convertToFctNumber } from "./common";

const firmaSDK = new FirmaMobileSDK(FirmaConfig.TestNetConfig);

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
        let wallet = await firmaSDK.Wallet.newWallet();
        return organizeWallet(wallet);
    } catch (error) {
        console.log('createNewWallet error : ' + error);
    }
}

export const recoverFromMnemonic = async(mnemonic:string) => {
    try {
        let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic);
        return wallet;
    } catch (error) {
        console.log('recoverFromMnemonic error : ' + error);
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
        let balance = await firmaSDK.Bank.getBalance(address);
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

export const sendFCT = async(mnemonic:string, target:string, amount:number, memo?:string) => {
    let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic);
    let send = await firmaSDK.Bank.send(wallet, target, amount, {memo: memo});
    return send;
}

// Staking
export const getDelegateList = async(address:string) => {
    return await firmaSDK.Staking.getTotalDelegationInfo(address);
}

export const getUndelegateList = async(address:string) => {
    return await firmaSDK.Staking.getTotalUndelegateInfo(address);
}

export const getTotalReward = async(address:string) => {
    return await firmaSDK.Distribution.getTotalRewardInfo(address);
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

    const values: StakingValues = {
        available,
        delegated,
        undelegate,
        stakingReward,
    }

    return values;
}

export const delegate = async(mnemonic:string, address:string, amount:number) => {
    let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic);
    let result = await firmaSDK.Staking.delegate(wallet, address, amount);

    return result;
}

export const redelegate = async(mnemonic:string, srcAddress:string, dstAddress:string, amount:number) => {
    let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic);
    let result = await firmaSDK.Staking.redelegate(wallet, srcAddress, dstAddress, amount, {
        fee: 30000,
        gas: 30000,
      });
    return result;
}

export const undelegate = async(mnemonic:string, address:string, amount:number) => {
    let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic);
    let result = await firmaSDK.Staking.undelegate(wallet, address, amount);

    return result;
}

export const withdrawRewards = async (mnemonic:string, address:string) => {
    let wallet = await firmaSDK.Wallet.fromMnemonic(mnemonic);
    const result = await firmaSDK.Distribution.withdrawAllRewards(wallet, address);

    return result;
};

export const getStaking = async(address:string) => {
    const balance = await getBalanceFromAdr(address);
    const available = convertToFctNumber(convertNumber(balance));

    const totalReward = await getTotalReward(address);
    const stakingReward = convertToFctNumber(totalReward.total);
    const stakingRewardList = totalReward.rewards;

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
        stakingRewardList,
        delegateList,
    }

    return staking;
}