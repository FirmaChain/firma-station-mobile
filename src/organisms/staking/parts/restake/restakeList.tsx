import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import { RESTAKE_NOT_EXIST } from '@/constants/common';
import { BgColor, BorderColor, Lato, PointLightColor, TextGrayColor } from '@/constants/theme';
import { CommonActions, StakingActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { convertToFctNumber } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

import { IStakeInfo, IStakingGrantState } from '@/hooks/staking/hooks';

import NoticeItem from '../delegation/noticeItem';
import RestakeItem from '../delegation/restakeItem';

interface IProps {
    isRefresh: boolean;
    delegationState: Array<IStakeInfo>;
    restakeState: IStakingGrantState;
    handleIsRefresh: (refresh: boolean) => void;
    navigateValidator: (address: string) => void;
}

interface IRestakeLatestInfo {
    validatorAddr: string;
    rewards: number;
}

const RestakeList = ({ isRefresh, delegationState, restakeState, handleIsRefresh, navigateValidator }: IProps) => {
    const { dataLoadStatus } = useAppSelector((state) => state.common);
    const { address: walletAddress } = useAppSelector((state) => state.wallet);
    const { network } = useAppSelector((state) => state.storage);

    const [restakeLatestInfo, setRestakeLatestInfo] = useState<IRestakeLatestInfo[] | null>(null);

    // Remove unnecessary useMemo - direct assignment is more efficient
    const delegationList = delegationState;
    const stakingGrantList: IStakingGrantState = restakeState;

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
            const result = await fetch(CHAIN_NETWORK[network].RESTAKE_REWARD_API + walletAddress);
            const json = await result.json();
            setRestakeLatestInfo(json);
        } catch (error) {
            console.log(error);
        }
    };

    const refreshStakings = useCallback(async () => {
        try {
            await getLatestRestakeInfo();
            handleIsRefresh(false);
        } catch (error) {
            CommonActions.handleDataLoadStatus(dataLoadStatus + 1);
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (isRefresh) {
            refreshStakings();
        }
    }, [isRefresh]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    List
                    <Text style={styles.inlineStyle1}>{' ' + listLength}</Text>
                    <Text style={styles.inlineStyle2}>{'/' + stakingGrantList.list.length}</Text>
                </Text>
            </View>
            <Restake stakingGrantList={stakingGrantList} restakeLatestInfo={restakeLatestInfo} navigateValidator={navigateValidator} />
        </View>
    );
};

const Restake = ({
    stakingGrantList,
    restakeLatestInfo,
    navigateValidator
}: {
    stakingGrantList: IStakingGrantState;
    restakeLatestInfo: IRestakeLatestInfo[] | null;
    navigateValidator: (address: string) => void;
}) => {
    return (
        <View style={styles.inlineStyle3}>
            {stakingGrantList.list.length > 0 ? (
                stakingGrantList.list.map((value, index) => {
                    const isLastItem = index === stakingGrantList.list.length - 1;

                    let latestReward = 0;
                    if (restakeLatestInfo) {
                        const result = restakeLatestInfo.find((restake) => restake.validatorAddr === value.validatorAddress);
                        latestReward = result !== undefined ? result.rewards : 0;
                    }

                    const data = {
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
};

const styles = StyleSheet.create({
    inlineStyle1: { color: PointLightColor },
    inlineStyle2: { color: TextGrayColor, opacity: 0.6 },
    inlineStyle3: {
        backgroundColor: BgColor,
        flex: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    container: {
        overflow: 'hidden',
        justifyContent: 'center',
        flex: 1
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
    }
});

export default memo(RestakeList);
