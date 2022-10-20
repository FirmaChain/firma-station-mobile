import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CommonActions, StakingActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { IStakeInfo, useDelegationData } from '@/hooks/staking/hooks';
import { convertToFctNumber, wait } from '@/util/common';
import { DownArrow } from '@/components/icon/icon';
import { BgColor, BorderColor, GrayColor, Lato, PointLightColor, TextGrayColor } from '@/constants/theme';
import { DELEGATE_NOT_EXIST, REDELEGATE_NOT_EXIST, UNDELEGATE_NOT_EXIST } from '@/constants/common';
import CustomModal from '@/components/modal/customModal';
import ModalItems from '@/components/modal/modalItems';
import DelegateItem from './delegateItem';
import RedelegateItem from './redelegateItem';
import UndelegateItem from './undelegateItem';
import NoticeItem from './noticeItem';

interface IProps {
    visible: boolean;
    isRefresh: boolean;
    delegationState: Array<IStakeInfo>;
    handleDelegationLoading: (loading: boolean) => void;
    handleDelegationExist: (exist: boolean) => void;
    handleIsRefresh: (refresh: boolean) => void;
    navigateValidator: (address: string) => void;
}

const DelegationList = ({
    visible,
    isRefresh,
    delegationState,
    handleDelegationLoading,
    handleDelegationExist,
    handleIsRefresh,
    navigateValidator
}: IProps) => {
    const { common } = useAppSelector((state) => state);

    const sortItems = ['Delegate', 'Redelegate', 'Undelegate'];
    const [selected, setSelected] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const { redelegationState, undelegationState, handleRedelegationState, handleUndelegationState } = useDelegationData();

    const delegationList = useMemo(() => {
        return delegationState;
    }, [delegationState]);

    const redelegationList = useMemo(() => {
        return redelegationState;
    }, [redelegationState]);

    const undelegationList = useMemo(() => {
        return undelegationState;
    }, [undelegationState]);

    const allReward = useMemo(() => {
        let reward = 0;
        delegationList.map((value) => {
            reward = reward + value.reward;
        });
        return reward;
    }, [delegationList]);

    useEffect(() => {
        let exist = delegationList.length > 0 || redelegationList.length > 0 || undelegationList.length > 0;
        handleDelegationExist(exist);
    }, [delegationList, redelegationList, undelegationList]);

    useEffect(() => {
        if (delegationList.length > 0) {
            StakingActions.updateStakingRewardState(convertToFctNumber(allReward));
        }
    }, [delegationList, allReward]);

    const handleOpenModal = (open: boolean) => {
        setOpenModal(open);
    };

    const handleSelectSort = (index: number) => {
        setSelected(index);
        handleOpenModal(false);
    };

    const refreshStakings = useCallback(async () => {
        try {
            switch (selected) {
                case 1:
                    await handleRedelegationState();
                case 2:
                    await handleUndelegationState();
                default:
                    break;
            }
            CommonActions.handleLoadingProgress(false);
            handleIsRefresh(false);
            wait(800).then(() => {
                handleDelegationLoading(false);
            });
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }, [selected]);

    const listLength = useMemo(() => {
        switch (selected) {
            case 0:
                return delegationList ? delegationList.length : 0;
            case 1:
                return redelegationList ? redelegationList.length : 0;
            case 2:
                return undelegationList ? undelegationList.length : 0;
            default:
                return 0;
        }
    }, [selected, delegationList, redelegationList, undelegationList]);

    const ClassifyByType = () => {
        if (visible) {
            switch (selected) {
                case 0:
                    return delegate();
                case 1:
                    return redelegate();
                case 2:
                    return undelegate();
            }
        }
    };

    useEffect(() => {
        refreshStakings();
    }, [selected, isRefresh]);

    const delegate = () => {
        return (
            <View>
                {delegationList.length > 0 ? (
                    delegationList.map((value, index) => {
                        const isLastItem = index === delegationList.length - 1;
                        return (
                            <View key={index} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                                <DelegateItem data={value} navigate={navigateValidator} />
                            </View>
                        );
                    })
                ) : (
                    <NoticeItem notification={DELEGATE_NOT_EXIST} />
                )}
            </View>
        );
    };

    const redelegate = () => {
        return (
            <View>
                {redelegationList.length > 0 ? (
                    redelegationList.map((value, index) => {
                        const isLastItem = index === redelegationList.length - 1;
                        return (
                            <View key={index} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                                <RedelegateItem data={value} navigate={navigateValidator} />
                            </View>
                        );
                    })
                ) : (
                    <NoticeItem notification={REDELEGATE_NOT_EXIST} />
                )}
            </View>
        );
    };

    const undelegate = () => {
        return (
            <View>
                {undelegationList.length > 0 ? (
                    undelegationList.map((value, index) => {
                        const isLastItem = index === undelegationList.length - 1;
                        return (
                            <View key={index} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                                <UndelegateItem data={value} navigate={navigateValidator} />
                            </View>
                        );
                    })
                ) : (
                    <NoticeItem notification={UNDELEGATE_NOT_EXIST} />
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    List
                    <Text style={{ color: PointLightColor }}>{' ' + listLength}</Text>
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                        <Text style={[styles.sortItem, { paddingRight: 4 }]}>{sortItems[selected]}</Text>
                        <DownArrow size={12} color={GrayColor} />
                    </TouchableOpacity>
                </View>
            </View>
            {ClassifyByType()}
            <CustomModal bgColor={BgColor} visible={openModal} handleOpen={handleOpenModal}>
                <ModalItems initVal={selected} data={sortItems} onPressEvent={handleSelectSort} />
            </CustomModal>
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

export default DelegationList;
