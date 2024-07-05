import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions } from '@/redux/actions';
import { useDelegationData, useStakingData } from '@/hooks/staking/hooks';
import { BgColor, BoxColor } from '@/constants/theme';
import { DATA_RELOAD_INTERVAL, TRANSACTION_TYPE } from '@/constants/common';
import { useInterval } from '@/hooks/common/hooks';
import RefreshScrollView from '@/components/parts/refreshScrollView';
import RewardBox from './rewardBox';
import BalanceBox from './balanceBox';
import StakingLists from './stakingLists';
import RestakeInfoBox from './restakeInfoBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

const Staking = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { wallet, staking, common } = useAppSelector((state) => state);
    const { stakingState, getStakingState } = useStakingData();
    const { stakingGrantActivation, handleStakingGrantActivationState } = useDelegationData();

    const [isListRefresh, setIsListRefresh] = useState(false);
    const [stakingReward, setStakingReward] = useState(0);

    const handleStakingReward = useCallback(async () => {
        setStakingReward(staking.stakingReward);
    }, [staking.stakingReward]);

    useEffect(() => {
        handleStakingReward();
    }, [staking.stakingReward]);

    const refreshStates = useCallback(async () => {
        if (isListRefresh === false && common.isNetworkChanged === false) {
            try {
                await Promise.all([getStakingState(), handleStakingGrantActivationState()]);
                handleIsRefresh(true);
                CommonActions.handleDataLoadStatus(0);
            } catch (error) {
                CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
                console.log(error);
            }
        }
    }, [isListRefresh, common.isNetworkChanged]);

    const handleWithdrawAll = (password: string, gas: number) => {
        const transactionState = {
            type: TRANSACTION_TYPE['WITHDRAW_ALL'],
            password: password,
            address: wallet.address,
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
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <RefreshScrollView background={BgColor} refreshFunc={refreshStates}>
                <Fragment>
                    {common.connect && common.isNetworkChanged === false && (
                        <View>
                            <View style={styles.box}>
                                <RewardBox walletName={wallet.name} reward={stakingReward} transactionHandler={handleWithdrawAll} />
                                <BalanceBox stakingValues={stakingState} />
                                <RestakeInfoBox
                                    stakingState={stakingState}
                                    grantStates={stakingGrantActivation}
                                    moveToRestake={moveToRestake}
                                />
                            </View>
                            <StakingLists isRefresh={isListRefresh} handleIsRefresh={handleIsRefresh} navigateValidator={moveToValidator} />
                        </View>
                    )}
                </Fragment>
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
        marginTop: -10,
        paddingTop: 42,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: BgColor
    }
});

export default Staking;
