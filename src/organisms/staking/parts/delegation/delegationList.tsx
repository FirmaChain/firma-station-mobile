import React, { memo, useEffect, useMemo, useState } from 'react';
import { DELEGATE_NOT_EXIST, REDELEGATE_NOT_EXIST, UNDELEGATE_NOT_EXIST } from '@/constants/common';
import { BgColor, BorderColor, GrayColor, Lato, PointLightColor, TextGrayColor } from '@/constants/theme';
import { StakingActions } from '@/redux/actions';
import { convertToFctNumber } from '@/util/common';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IRedelegationInfo, IStakeInfo, IUndelegationInfo } from '@/hooks/staking/hooks';
import { DownArrow } from '@/components/icon/icon';
import CustomModal from '@/components/modal/customModal';
import ModalItems from '@/components/modal/modalItems';

import DelegateItem from './delegateItem';
import NoticeItem from './noticeItem';
import RedelegateItem from './redelegateItem';
import UndelegateItem from './undelegateItem';

interface IProps {
    delegationState: Array<IStakeInfo>;
    redelegationState: Array<IRedelegationInfo>;
    undelegationState: Array<IUndelegationInfo>;
    navigateValidator: (address: string) => void;
}

const chkLastItem = (index: number, length: number) => {
    if (length > 1 && index === length - 1) {
        return true;
    }
    return false;
};

const DelegationList = ({ delegationState, redelegationState, undelegationState, navigateValidator }: IProps) => {
    const sortItems = ['Delegate', 'Redelegate', 'Undelegate'];
    const [selected, setSelected] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    // Remove unnecessary useMemo - direct assignment is more efficient
    const delegationList = delegationState;
    const redelegationList = redelegationState;
    const undelegationList = undelegationState;

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

    const handleOpenModal = (open: boolean) => {
        setOpenModal(open);
    };

    const handleSelectSort = (index: number) => {
        setSelected(index);
        handleOpenModal(false);
    };

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    List
                    <Text style={styles.inlineStyle1}>{' ' + listLength}</Text>
                </Text>
                <View style={styles.inlineStyle2}>
                    <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                        <Text style={[styles.sortItem, styles.inlineStyle3]}>{sortItems[selected]}</Text>
                        <DownArrow size={12} color={GrayColor} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inlineStyle4}>
                {selected === 0 && <Delegate delegationList={delegationList} navigateValidator={navigateValidator} />}
                {selected === 1 && <ReDelegate redelegationList={redelegationList} navigateValidator={navigateValidator} />}
                {selected === 2 && <UnDelegate undelegationList={undelegationList} navigateValidator={navigateValidator} />}
            </View>
            <CustomModal bgColor={BgColor} visible={openModal} handleOpen={handleOpenModal}>
                <ModalItems initVal={selected} data={sortItems} onPressEvent={handleSelectSort} />
            </CustomModal>
        </View>
    );
};

const Delegate = ({
    delegationList,
    navigateValidator
}: {
    delegationList: IStakeInfo[];
    navigateValidator: (address: string) => void;
}) => {
    return (
        <>
            {delegationList.length > 0 ? (
                delegationList.map((value, index) => {
                    const isLastItem = chkLastItem(index, delegationList.length);

                    return (
                        <View key={index} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                            <DelegateItem data={value} navigate={navigateValidator} />
                        </View>
                    );
                })
            ) : (
                <NoticeItem notification={DELEGATE_NOT_EXIST} />
            )}
        </>
    );
};

const ReDelegate = ({
    redelegationList,
    navigateValidator
}: {
    redelegationList: IRedelegationInfo[];
    navigateValidator: (address: string) => void;
}) => {
    return (
        <>
            {redelegationList.length > 0 ? (
                redelegationList.map((value, index) => {
                    const isLastItem = chkLastItem(index, redelegationList.length);

                    return (
                        <View key={index} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                            <RedelegateItem data={value} navigate={navigateValidator} />
                        </View>
                    );
                })
            ) : (
                <NoticeItem notification={REDELEGATE_NOT_EXIST} />
            )}
        </>
    );
};

const UnDelegate = ({
    undelegationList,
    navigateValidator
}: {
    undelegationList: IUndelegationInfo[];
    navigateValidator: (address: string) => void;
}) => {
    return (
        <>
            {undelegationList.length > 0 ? (
                undelegationList.map((value, index) => {
                    const isLastItem = chkLastItem(index, undelegationList.length);

                    return (
                        <View key={index} style={isLastItem ? styles.itemBoxLast : styles.itemBox}>
                            <UndelegateItem data={value} navigate={navigateValidator} />
                        </View>
                    );
                })
            ) : (
                <NoticeItem notification={UNDELEGATE_NOT_EXIST} />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { color: PointLightColor },
    inlineStyle2: { flexDirection: 'row', alignItems: 'center' },
    inlineStyle3: { paddingRight: 4 },
    inlineStyle4: {
        backgroundColor: BgColor,
        flex: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    container: {
        overflow: 'hidden',
        justifyContent: 'flex-start',
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

export default memo(DelegationList);
