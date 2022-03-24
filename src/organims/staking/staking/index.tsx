import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { useStakingData } from "@/hooks/staking/hooks";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { BgColor } from "@/constants/theme";
import { TRANSACTION_TYPE } from "@/constants/common";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import RewardBox from "./rewardBox";
import BalanceBox from "./balanceBox";
import StakingLists from "./stakingLists";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

const Staking = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const { wallet, staking, common } = useAppSelector(state => state);

    const { stakingState, getStakingState, updateStakingState } = useStakingData();
    const { recentHistory, currentHistoryPolling, refetchCurrentHistory } = useHistoryData();

    const [isRefresh, setIsRefresh] = useState(false);

    const currentHistoryRefetch = async() => {
        if(refetchCurrentHistory)
            await refetchCurrentHistory();
    }

    const handleCurrentHistoryPolling = (polling:boolean) => {
        currentHistoryRefetch();
        if(currentHistoryPolling) {
            currentHistoryPolling(polling);
        }
    }

    const refreshStates = async() => {
        CommonActions.handleLoadingProgress(true);
        await getStakingState();
        setIsRefresh(true);
        if(common.isNetworkChanged === false){
            CommonActions.handleLoadingProgress(false);
        }
        setIsRefresh(false);
    }

    const handleWithdrawAll = (password:string, gas:number) => {
        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW ALL"],
            password: password,
            address : wallet.address,
            gas: gas,
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const moveToValidator = (address:string) => {
        navigation.navigate(Screens.Validator, {
            validatorAddress: address,
        });
    }

    useEffect(() => {
        if(stakingState.stakingReward > 0) {
            updateStakingState(stakingState.stakingReward);
        }
    }, [stakingState.stakingReward])

    useEffect(() => {
        if(recentHistory !== undefined && common.isNetworkChanged === false){
            refreshStates();
        }
    },[recentHistory])

    useEffect(() => {
        if(isFocused){
            handleCurrentHistoryPolling(true);
        } else {
            handleCurrentHistoryPolling(false);
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <RefreshScrollView
                refreshFunc={refreshStates}>
                {(common.connect && common.isNetworkChanged === false) && 
                <View>
                    <View style={styles.box}>
                        <RewardBox 
                            walletName={wallet.name} 
                            available={stakingState.available} 
                            reward={staking.stakingReward} 
                            transactionHandler={handleWithdrawAll}/>
                        <BalanceBox stakingValues={stakingState}/>
                    </View>
                    <StakingLists isRefresh={isRefresh} navigateValidator={moveToValidator} />
                </View>
                }
            </RefreshScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
    },
    box: {
        paddingTop: 32,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 4,
    },
})

export default Staking;