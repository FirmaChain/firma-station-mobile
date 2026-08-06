import React, { useCallback, useEffect, useState } from 'react';
import { DATA_RELOAD_INTERVAL, TRANSACTION_TYPE } from '@/constants/common';
import { BgColor, BoxColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';

import { useRefreshPolling, type RefreshLifecycle } from '@/hooks/common/useRefreshPolling';
import { useDelegationData, useStakingData } from '@/hooks/staking/hooks';
import RefreshScrollView from '@/components/parts/refreshScrollView';

import BalanceBox from './balanceBox';
import RestakeInfoBox from './restakeInfoBox';
import RewardBox from './rewardBox';
import StakingLists from './stakingLists';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

const Staking = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { name: walletName, address: walletAddress } = useAppSelector((state) => state.wallet);
    const { stakingReward: stakingRewardState } = useAppSelector((state) => state.staking);
    const { isNetworkChanged, connect, appState } = useAppSelector((state) => state.common);

    const { stakingState, getStakingState } = useStakingData();
    const { stakingGrantActivation, handleStakingGrantActivationState } = useDelegationData();

    const [isListRefresh, setIsListRefresh] = useState(false);
    const [stakingReward, setStakingReward] = useState(0);

    const handleStakingReward = useCallback(async () => {
        setStakingReward(stakingRewardState);
    }, [stakingRewardState]);

    useEffect(() => {
        handleStakingReward();
    }, [stakingRewardState]);

    const handleWithdrawAll = (password: string, gas: number) => {
        const transactionState = {
            type: TRANSACTION_TYPE['WITHDRAW_ALL'],
            password: password,
            address: walletAddress,
            gas: gas
        };
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const moveToRestake = () => {
        navigation.navigate(Screens.Restake);
    };

    const moveToValidator = (address: string) => {
        navigation.navigate(Screens.Validator, {
            validatorAddress: address
        });
    };

    const handleIsRefresh = useCallback(
        (refresh: boolean) => {
            setIsListRefresh(refresh);
        },
        [isListRefresh]
    );

    const isPollingEligible = useCallback(
        () => isFocused && appState === 'active' && !isNetworkChanged,
        [appState, isFocused, isNetworkChanged]
    );

    const refreshStates = useCallback(
        async (lifecycle: RefreshLifecycle) => {
            await Promise.all([getStakingState(lifecycle), handleStakingGrantActivationState(lifecycle)]);
        },
        [getStakingState, handleStakingGrantActivationState]
    );

    const refreshNow = useRefreshPolling({
        refresh: refreshStates,
        commit: (_value, lifecycle) => {
            if (!lifecycle.isValid()) return;
            handleIsRefresh(true);
        },
        isEligible: isPollingEligible,
        delay: DATA_RELOAD_INTERVAL,
        retryLimit: 3,
        onError: (error) => {
            console.error(error);
        }
    });

    return (
        <View style={styles.container}>
            <RefreshScrollView background={BgColor} refreshFunc={refreshNow}>
                {connect && isNetworkChanged === false && (
                    <>
                        <View style={styles.box}>
                            <RewardBox walletName={walletName} reward={stakingReward} transactionHandler={handleWithdrawAll} />
                            <BalanceBox stakingValues={stakingState} />
                            <RestakeInfoBox
                                stakingState={stakingState}
                                grantStates={stakingGrantActivation}
                                moveToRestake={moveToRestake}
                            />
                        </View>

                        <StakingLists isRefresh={isListRefresh} handleIsRefresh={handleIsRefresh} navigateValidator={moveToValidator} />
                    </>
                )}
            </RefreshScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BoxColor
    },
    box: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: BgColor
    }
});

export default Staking;
