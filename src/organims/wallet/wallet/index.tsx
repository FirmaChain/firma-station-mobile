import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useAppSelector } from "@/redux/hooks";
import { BgColor } from "@/constants/theme";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { useStakingData } from "@/hooks/staking/hooks";
import AddressBox from "./addressBox";
import BalanceBox from "./balanceBox";
import HistoryBox from "./historyBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

const Wallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const {wallet, staking} = useAppSelector(state => state);

    const { recentHistory, refetchCurrentHistory, currentHistoryPolling } = useHistoryData();
    const { stakingState, getStakingState, updateStakingState } = useStakingData();
    
    const moveToSendScreen = () => {
        navigation.navigate(Screens.Send);
    }
    const moveToStakingTab = () => {
        navigation.navigate(Screens.Staking);
    }
    const moveToHistoryScreen = () => {
        navigation.navigate(Screens.History);
    }

    const currentHistoryRefetch = async() => {
        if(refetchCurrentHistory)
            await refetchCurrentHistory();
    }

    const handleCurrentHistoryPolling = async(polling:boolean) => {
        if(currentHistoryPolling) {
            currentHistoryPolling(polling);
        }
    }

    const refreshStates = async() => {
        await getStakingState();
        await currentHistoryRefetch();
    }

    useEffect(() => {
        if(staking.stakingReward > 0 && isFocused)
            updateStakingState(staking.stakingReward);
    }, [staking.stakingReward, isFocused])

    useEffect(() => {
        if(recentHistory !== undefined){
            refreshStates();
        }
    },[recentHistory])

    useFocusEffect(
        useCallback(() => {
            currentHistoryRefetch();
            handleCurrentHistoryPolling(true);
            return () => {
                handleCurrentHistoryPolling(false);
            }
        }, [])
    )

    return (
        <View style={styles.container}>
            <AddressBox address={wallet.address} />
            <RefreshScrollView
                refreshFunc={refreshStates}>
                <View style={styles.content}>
                    <BalanceBox stakingValues={stakingState} handleSend={moveToSendScreen} handleStaking={moveToStakingTab}/>
                    <HistoryBox handleHistory={moveToHistoryScreen} recentHistory={recentHistory}/>
                </View>
            </RefreshScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
    },
    wallet:{
        paddingBottom: 10,
        paddingHorizontal: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa',
    },
    content: {
    }
})

export default Wallet;