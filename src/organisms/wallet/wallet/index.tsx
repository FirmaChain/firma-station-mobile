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
import { useInterval } from '@/hooks/common/hooks';
import { CHAIN_PREFIX, DATA_RELOAD_INTERVAL } from '@/constants/common';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

const Wallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const { storage, wallet, common } = useAppSelector((state) => state);

    const { recentHistory, handleHisotyPolling } = useHistoryData();
    const { stakingState, getStakingState } = useStakingData();

    const [isInit, setIsInit] = useState(false);
    const [chainInfo, setChainInfo]: Array<any> = useState([]);

    const historyVolume = useMemo(() => {
        if (storage.historyVolume === undefined) return null;
        if (storage.historyVolume[wallet.address] === undefined) return null;
        return storage.historyVolume[wallet.address];
    }, [storage.historyVolume]);

    const moveToSendScreen = () => {
        navigation.navigate(Screens.Send);
    };
    const moveToStakingTab = () => {
        navigation.navigate(Screens.Staking);
    };
    const moveToHistoryScreen = () => {
        navigation.navigate(Screens.History);
    };

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    const getChainInfo = async () => {
        try {
            const result = await fetch(`${COINGECKO}/${CHAIN_PREFIX()}`);
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
            await Promise.all([getStakingState(), handleHisotyPolling()]);
            CommonActions.handleDataLoadStatus(0);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
            throw error;
        }
    };

    useInterval(
        () => {
            refreshStates();
        },
        common.dataLoadStatus > 0 ? DATA_RELOAD_INTERVAL : null,
        true
    );

    useEffect(() => {
        if (isFocused) {
            refreshStates();
            if (isInit === false) {
                setIsInit(true);
            }
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
                            historyVolume={historyVolume}
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
