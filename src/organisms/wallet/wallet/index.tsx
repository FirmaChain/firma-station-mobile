import React, { useEffect, useMemo, useState } from 'react';
import { DATA_RELOAD_INTERVAL } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { useIBCTokenContext } from '@/context/ibcTokenContext';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { getTokenList } from '@/util/firma';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useInterval } from '@/hooks/common/hooks';
import { useStakingData } from '@/hooks/staking/hooks';
import { useHistoryData } from '@/hooks/wallet/hooks';
import RefreshScrollView from '@/components/parts/refreshScrollView';

import { IBC_CONFIG } from '../../../../config';
import AddressBox from './addressBox';
import AssetsBox from './assetsBox';
import BalanceBox from './balanceBox';
import HistoryBox from './historyBox';
import StakingBox from './stakingBox';

export interface IBCDataState {
    enable: boolean;
    displayName: string;
    denom: string;
    decimal: number;
    icon: string;
    link: string;
    amount: string;
    chainName: string;
}

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Wallet>;

const Wallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { address: walletAddress } = useAppSelector((state) => state.wallet);
    const { dataLoadStatus, isNetworkChanged, connect } = useAppSelector((state) => state.common);
    const { historyVolume: storageHistoryVolume } = useAppSelector((state) => state.storage);

    const { recentHistory, handleHisotyPolling } = useHistoryData();
    const { stakingState, getStakingState } = useStakingData();
    const { setTokenList, setIbcTokenConfig } = useIBCTokenContext();

    const [isInit, setIsInit] = useState(false);

    const historyVolume = useMemo(() => {
        if (storageHistoryVolume === undefined) return null;
        if (storageHistoryVolume[walletAddress] === undefined) return null;
        return storageHistoryVolume[walletAddress];
    }, [storageHistoryVolume]);

    const moveToSendScreen = () => {
        navigation.navigate(Screens.Send);
    };
    const moveToSendIBCScrees = (token: IBCDataState) => {
        navigation.navigate(Screens.SendIBC, { tokenData: token });
    };
    const moveToStakingTab = () => {
        navigation.navigate(Screens.Staking);
    };
    const moveToHistoryScreen = () => {
        navigation.navigate(Screens.History);
    };
    const moveToAssetsScrees = () => {
        navigation.navigate(Screens.Assets);
    };

    const handleMoveToWeb = (uri: string) => {
        navigation.navigate(Screens.WebScreen, { uri: uri });
    };

    const getIBCTokenList = async () => {
        try {
            const list = await getTokenList(walletAddress);
            setTokenList(list);
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const refreshStates = async () => {
        try {
            await Promise.all([getStakingState(), handleHisotyPolling(), getIBCTokenList()]);
            setIbcTokenConfig(IBC_CONFIG);
            CommonActions.handleDataLoadStatus(0);
        } catch (error) {
            CommonActions.handleDataLoadStatus(dataLoadStatus + 1);
            console.log(error);
            throw error;
        }
    };

    useInterval(
        () => {
            refreshStates();
        },
        dataLoadStatus > 0 ? DATA_RELOAD_INTERVAL : null,
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
            {connect && isNetworkChanged === false && (
                <RefreshScrollView refreshFunc={refreshStates}>
                    <View style={styles.content}>
                        <AddressBox address={walletAddress} />
                        <BalanceBox
                            stakingValues={stakingState}
                            handleSend={moveToSendScreen}
                            handleSendIBC={moveToSendIBCScrees}
                            handleStaking={moveToStakingTab}
                        />
                        <AssetsBox handleAssets={moveToAssetsScrees} />
                        <StakingBox stakingValues={stakingState} handleStaking={moveToStakingTab} />
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
    //   wallet: {
    //     paddingBottom: 10,
    //     paddingHorizontal: 20,
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     color: '#aaa',
    //   },
    content: {
        paddingTop: 32
    }
});

export default Wallet;
