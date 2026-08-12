import React, { useCallback, useMemo } from 'react';
import { BgColor } from '@/constants/theme';
import { useIBCTokenContext } from '@/context/ibcTokenContext';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { getTokenList } from '@/util/firma';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import type { RefreshLifecycle } from '@/hooks/common/useRefreshPolling';
import { useScreenRefreshPolling } from '@/hooks/common/useScreenRefreshPolling';
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
    const walletAddress = useAppSelector((state) => state.wallet.address);
    const isNetworkChanged = useAppSelector((state) => state.common.isNetworkChanged);
    const connect = useAppSelector((state) => state.common.connect);
    const storageHistoryVolume = useAppSelector((state) => state.storage.historyVolume);

    const { recentHistory, handleHisotyPolling } = useHistoryData();
    const { stakingState, getStakingState } = useStakingData();
    const { setTokenList, setIbcTokenConfig } = useIBCTokenContext();

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

    const getIBCTokenList = useCallback(
        async (lifecycle: RefreshLifecycle) => {
            try {
                return await getTokenList(walletAddress);
            } catch (error) {
                if (lifecycle.isValid()) {
                    console.error(error);
                    Toast.show({
                        type: 'error',
                        text1: String(error)
                    });
                }
                throw error;
            }
        },
        [walletAddress]
    );

    const refreshStates = useCallback(
        async (lifecycle: RefreshLifecycle) => {
            const [stakingResult, historyResult, tokenResult] = await Promise.allSettled([
                getStakingState(lifecycle),
                handleHisotyPolling(lifecycle),
                getIBCTokenList(lifecycle)
            ]);
            if (stakingResult.status === 'rejected') throw stakingResult.reason;
            if (historyResult.status === 'rejected') throw historyResult.reason;
            if (tokenResult.status === 'rejected') throw tokenResult.reason;
            return tokenResult.value;
        },
        [getIBCTokenList, getStakingState, handleHisotyPolling]
    );

    const refreshNow = useScreenRefreshPolling({
        refresh: refreshStates,
        commit: (tokenList, lifecycle) => {
            if (!lifecycle.isValid()) return;
            setTokenList(tokenList);
            setIbcTokenConfig(IBC_CONFIG);
        }
    });

    return (
        <View style={styles.container}>
            {connect && isNetworkChanged === false && (
                <RefreshScrollView refreshFunc={refreshNow}>
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
    content: {
        paddingTop: 16
    }
});

export default Wallet;
