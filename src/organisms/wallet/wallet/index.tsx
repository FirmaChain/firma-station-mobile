import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { BgColor } from '@/constants/theme';
import { useHistoryData } from '@/hooks/wallet/hooks';
import { useStakingData } from '@/hooks/staking/hooks';
import { COINGECKO } from '@/../config';
import RefreshScrollView from '@/components/parts/refreshScrollView';
import AddressBox from './addressBox';
import BalanceBox from './balanceBox';
import HistoryBox from './historyBox';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

const Wallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const { wallet, staking, common } = useAppSelector((state) => state);

    const { recentHistory, historyExist, currentHistoryPolling } = useHistoryData();
    const { stakingState, getStakingState, updateStakingState } = useStakingData();

    const [isInit, setIsInit] = useState(false);
    const [chainInfo, setChainInfo]: Array<any> = useState([]);

    const isHistoryExist = useMemo(() => {
        return historyExist;
    }, [historyExist]);

    const moveToSendScreen = () => {
        navigation.navigate(Screens.Send);
    };
    const moveToStakingTab = () => {
        navigation.navigate(Screens.Staking);
    };
    const moveToHistoryScreen = () => {
        navigation.navigate(Screens.History);
    };

    const handleCurrentHistoryPolling = async (polling: boolean) => {
        await currentHistoryPolling(polling);
    };

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    const getChainInfo = async () => {
        try {
            const result = await fetch(COINGECKO);
            const json = await result.json();

            LayoutAnim();
            easeInAndOutCustomAnim(150);
            setChainInfo(json);
        } catch (error) {
            console.log(error);
        }
    };

    const refreshStates = async () => {
        try {
            await getChainInfo();
            await getStakingState();
            refreshAtFocus();
            CommonActions.handleDataLoadStatus(0);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    };

    const refreshAtFocus = () => {
        if (staking.stakingReward > 0) {
            updateStakingState(staking.stakingReward);
        }
        handleCurrentHistoryPolling(true);
    };

    useEffect(() => {
        if (isFocused && common.dataLoadStatus > 0) {
            let count = 0;
            let intervalId = setInterval(() => {
                if (common.dataLoadStatus > 0 && common.dataLoadStatus < 2) {
                    count = count + 1;
                } else {
                    clearInterval(intervalId);
                }
                if (count >= 6) {
                    count = 0;
                    refreshStates();
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [common.dataLoadStatus]);

    useEffect(() => {
        if (isInit) {
            if (recentHistory !== undefined && common.isNetworkChanged === false) {
                refreshStates();
            }
        }
    }, [recentHistory]);

    useEffect(() => {
        if (isFocused) {
            if (isInit) {
                refreshAtFocus();
            } else {
                setIsInit(true);
            }
        } else {
            handleCurrentHistoryPolling(false);
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            {common.connect && common.isNetworkChanged === false && (
                <RefreshScrollView refreshFunc={refreshStates}>
                    <View style={styles.content}>
                        <AddressBox address={wallet.address} />
                        <BalanceBox
                            stakingValues={stakingState}
                            handleSend={moveToSendScreen}
                            handleStaking={moveToStakingTab}
                            chainInfo={chainInfo}
                        />
                        <HistoryBox
                            handleHistory={moveToHistoryScreen}
                            historyExist={isHistoryExist}
                            recentHistory={recentHistory}
                            handleExplorer={handleMoveToWeb}
                        />
                    </View>
                </RefreshScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor
    },
    wallet: {
        paddingBottom: 10,
        paddingHorizontal: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa'
    },
    content: {
        paddingTop: 32
    }
});

export default Wallet;
