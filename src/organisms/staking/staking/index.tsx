import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { useStakingData } from "@/hooks/staking/hooks";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { BgColor, BoxColor } from "@/constants/theme";
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
    const { recentHistory, currentHistoryPolling } = useHistoryData();

    const [isInit, setIsInit] = useState(false);
    const [isListRefresh, setIsListRefresh] = useState(false);

    const stakingReward = useMemo(() => {
        return staking.stakingReward;
    }, [staking.stakingReward])

    const handleIsRefresh = (refresh:boolean) => {
        setIsListRefresh(refresh);
    }

    const handleWithdrawAll = (password:string, gas:number) => {
        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW_ALL"],
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
    
    const handleCurrentHistoryPolling = async(polling:boolean) => {
        if(currentHistoryPolling) {
            await currentHistoryPolling(polling);
        }
    }

    const refreshStates = async() => {
        if(isFocused){
            CommonActions.handleLoadingProgress(true);
        }
        try {
            await getStakingState();
            refreshAtFocus();
            handleIsRefresh(isFocused);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }

    const refreshAtFocus = () => {
        if(staking.stakingReward > 0 && isFocused) {
            updateStakingState(staking.stakingReward);
        }
        handleCurrentHistoryPolling(isFocused);
        if(isInit === false){
            handleIsRefresh(isFocused);
        }
    }

    useEffect(() => {
        if(isListRefresh === false){
            CommonActions.handleDataLoadStatus(0);
        }
    }, [isListRefresh])

    useEffect(() => {
        let count = 0;
        let intervalId = setInterval(() => {
            if(common.dataLoadStatus > 0 && common.dataLoadStatus < 2){
                count = count + 1;
            } else {
                clearInterval(intervalId);
            }
            if(count >= 6){
                count = 0;
                refreshStates();
            }
        }, 1000)

        return () => clearInterval(intervalId);
    }, [common.dataLoadStatus])

    useEffect(() => {
        if(recentHistory !== undefined 
            && common.isNetworkChanged === false){
            refreshStates();
        }
    },[recentHistory])
    
    useEffect(() => {
        if(isInit){
            refreshAtFocus();
        } else {
            CommonActions.handleLoadingProgress(true);
            refreshAtFocus();
            setIsInit(true);
        }
    }, [isFocused])

    return (
        <View style={styles.container}>
            <RefreshScrollView
                background={BgColor}
                refreshFunc={refreshStates}>
                {(common.connect && common.isNetworkChanged === false) && 
                <View>
                    <View style={styles.box}>
                        <RewardBox
                            walletName={wallet.name}
                            reward={stakingReward}
                            transactionHandler={handleWithdrawAll}/>
                        <BalanceBox stakingValues={stakingState}/>
                    </View>
                    <StakingLists isRefresh={isListRefresh} handleIsRefresh={handleIsRefresh} navigateValidator={moveToValidator} />
                </View>
                }
            </RefreshScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BoxColor,
    },
    box: {
        marginTop: -10,
        paddingTop: 42,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: BgColor,
    },
})

export default Staking;