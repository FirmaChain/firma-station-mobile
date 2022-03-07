import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BgColor } from "@/constants/theme";
import AddressBox from "@/organims/wallet/addressBox";
import BalanceBox from "@/organims/wallet/balanceBox";
import HistoryBox from "@/organims/wallet/historyBox";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import { useStakingData } from "@/hooks/staking/hooks";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { useAppSelector } from "@/redux/hooks";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

const WalletScreen = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const {wallet, staking} = useAppSelector(state => state);

    const { recentHistory, refetchCurrentHistory, currentHistoryPolling } = useHistoryData();
    const { stakingState, getStakingState, updateStakingState } = useStakingData();
    
    const handleSend = () => {
        navigation.navigate(Screens.Send);
    }

    const handleStaking = () => {
        navigation.navigate(Screens.Staking);
    }

    const handleHistory = () => {
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
                    <BalanceBox stakingValues={stakingState} handleSend={handleSend} handleStaking={handleStaking}/>
                    <HistoryBox handleHistory={handleHistory} recentHistory={recentHistory}/>
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


export default React.memo(WalletScreen);