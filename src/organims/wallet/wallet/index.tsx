import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { BgColor } from "@/constants/theme";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { useStakingData } from "@/hooks/staking/hooks";
import { COINGECKO } from "@/../config";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import AddressBox from "./addressBox";
import BalanceBox from "./balanceBox";
import HistoryBox from "./historyBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

const Wallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const {wallet, staking, common} = useAppSelector(state => state);

    const { recentHistory, refetchCurrentHistory, currentHistoryPolling } = useHistoryData();
    const { stakingState, getStakingState, updateStakingState } = useStakingData();

    const [chainInfo, setChainInfo]:Array<any> = useState([]);

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
        try{
            if(refetchCurrentHistory){
                await refetchCurrentHistory();
            }
        }catch(e){
            console.log(e);
        }
    }

    const handleCurrentHistoryPolling = async(polling:boolean) => {
        await currentHistoryRefetch();
        if(currentHistoryPolling) {
            currentHistoryPolling(polling);
        }
    }

    const handleMoveToWeb = (uri:string) => {
        navigation.navigate(Screens.WebScreen, {uri: uri});
    }

    const getChainInfo = async() => {
        try {
            const result = await fetch(COINGECKO);
            const json = await result.json();
            setChainInfo(json);
        } catch (error) {
            console.log(error);
        }
    }

    const refreshStates = async() => {
        console.log("refreshStates");
        CommonActions.handleLoadingProgress(true);
        try {
            await getChainInfo();
            await getStakingState();
            await currentHistoryRefetch();
            if(staking.stakingReward > 0 && isFocused){
                await updateStakingState(staking.stakingReward);
            }
        } catch (error) {
            console.log(error);
        }
        if(common.isNetworkChanged === false){
            CommonActions.handleLoadingProgress(false);
        }
    }

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
            {(common.connect && common.isNetworkChanged === false) && 
                <RefreshScrollView
                    refreshFunc={refreshStates}>
                    <View style={styles.content}>
                        <AddressBox address={wallet.address} />
                        <BalanceBox stakingValues={stakingState} handleSend={moveToSendScreen} handleStaking={moveToStakingTab} chainInfo={chainInfo}/>
                        <HistoryBox handleHistory={moveToHistoryScreen} recentHistory={recentHistory} handleExplorer={handleMoveToWeb}/>
                    </View>
                </RefreshScrollView>
            }
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
        paddingTop: 32,
    }
})

export default Wallet;