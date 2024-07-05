import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CommonActions, StakingActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { IStakeInfo, IStakingGrantState } from '@/hooks/staking/hooks';
import { convertToFctNumber } from '@/util/common';
import { BgColor, BorderColor, GrayColor, Lato, PointLightColor, TextGrayColor } from '@/constants/theme';
import { RESTAKE_NOT_EXIST } from '@/constants/common';
import { CHAIN_NETWORK } from '@/../config';
import RestakeItem from '../delegation/restakeItem';
import NoticeItem from '../delegation/noticeItem';

interface IProps {
    visible: boolean;
    isRefresh: boolean;
    delegationState: Array<IStakeInfo>;
    restakeState: IStakingGrantState;
    handleIsRefresh: (refresh: boolean) => void;
    navigateValidator: (address: string) => void;
}

const RestakeList = ({ visible, isRefresh, delegationState, restakeState, handleIsRefresh, navigateValidator }: IProps) => {
    const { common, wallet, storage } = useAppSelector((state) => state);

    const [restakeLatestInfo, setRestakeLatestInfo]: any = useState(null);

    const delegationList = useMemo(() => {
        return delegationState;
    }, [delegationState]);

    const stakingGrantList: IStakingGrantState = useMemo(() => {
        return restakeState;
    }, [restakeState]);

    const listLength = useMemo(() => {
        return stakingGrantList.count;
    }, [stakingGrantList]);

    const allReward = useMemo(() => {
        let reward = 0;
        delegationList.map((value) => {
            reward = reward + value.reward;
        });
        return reward;
    }, [delegationList]);

    useEffect(() => {
        if (delegationList.length > 0) {
            StakingActions.updateStakingRewardState(convertToFctNumber(allReward));
        }
    }, [delegationList, allReward]);

    const getLatestRestakeInfo = async () => {
        try {
            const result = await fetch(CHAIN_NETWORK[storage.network].RESTAKE_REWARD_API + wallet.address);
            const json = await result.json();
            setRestakeLatestInfo(json);
        } catch (error) {
            console.log(error);
        }
    };

    const refreshStakings = useCallback(async () => {
        if (visible === false) return;
        try {
            await getLatestRestakeInfo();
            CommonActions.handleLoadingProgress(false);
            handleIsRefresh(false);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }, [visible]);

    useEffect(() => {
        if (visible || (visible && isRefresh)) {
            refreshStakings();
        }
    }, [visible, isRefresh]);

    const restake = useCallback(() => {
        return (
            <View>
                {stakingGrantList.list.length > 0 ? (
                    stakingGrantList.list.map((value, index) => {
                        const isLastItem = index === stakingGrantList.list.length - 1;

                        let latestReward = 0;
                        if (restakeLatestInfo) {
                            let result = restakeLatestInfo.find((restake: any) => restake.validatorAddr === value.validatorAddress);
                            latestReward = result !== undefined ? result.rewards : 0;
                        }

                        let data = {
                            ...value,
                            latestReward: latestReward
                        };

                        return (
                            <View key={index} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                                <RestakeItem data={data} navigate={navigateValidator} />
                            </View>
                        );
                    })
                ) : (
                    <NoticeItem notification={RESTAKE_NOT_EXIST} />
                )}
            </View>
        );
    }, [stakingGrantList, restakeLatestInfo]);

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    List
                    <Text style={{ color: PointLightColor }}>{' ' + listLength}</Text>
                    <Text style={{ color: TextGrayColor, opacity: 0.6 }}>{'/' + stakingGrantList.list.length}</Text>
                </Text>
            </View>
            {restake()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        marginBottom: 20,
        paddingHorizontal: 20
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    itemBox: {
        borderBottomColor: BorderColor,
        borderBottomWidth: 0.5
    },
    itemBoxLast: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: 'hidden'
    },
    title: {
        flex: 2,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    sortItem: {
        color: GrayColor,
        fontFamily: Lato,
        fontSize: 16
    }
});

export default memo(RestakeList);
