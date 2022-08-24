import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CommonActions, StakingActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { useDelegationData } from "@/hooks/staking/hooks";
import { convertToFctNumber } from "@/util/common";
import { DownArrow } from "@/components/icon/icon";
import { BgColor, BorderColor, GrayColor, Lato, PointLightColor, TextGrayColor } from "@/constants/theme";
import { DELEGATE_NOT_EXIST, REDELEGATE_NOT_EXIST, UNDELEGATE_NOT_EXIST } from "@/constants/common";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";
import DelegateItem from "./delegateItem";
import RedelegateItem from "./redelegateItem";
import UndelegateItem from "./undelegateItem";
import RestakeItem from "./restakeItem";
import NoticeItem from "./noticeItem";

interface IProps {
    visible: boolean;
    isRefresh: boolean;
    handleIsRefresh: (refresh:boolean) => void;
    navigateValidator: (address:string) => void;
}

const DelegationList = ({visible, isRefresh, handleIsRefresh, navigateValidator}:IProps) => {
    const {common} = useAppSelector(state => state);

    const sortItems = ['Delegate', 'Redelegate', 'Undelegate', 'Restake'];
    // const sortItems = ['Delegate', 'Redelegate', 'Undelegate'];
    const [selected, setSelected] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const { delegationState, 
        redelegationState, 
        undelegationState, 
        stakingGrantState,
        handleDelegationState,
        handleRedelegationState,
        handleUndelegationState,
        handleStakingGrantState,
        refetchValidatorDescList } = useDelegationData();

    const delegationList = useMemo(() => {
        return delegationState;
    }, [delegationState]);

    const redelegationList = useMemo(() => {
        return redelegationState;
    }, [redelegationState]);

    const undelegationList = useMemo(() => {
        return undelegationState;
    }, [undelegationState]);

    const stakingGrantList = useMemo(() => {
        return stakingGrantState;
    }, [stakingGrantState])

    const allReward = useMemo(() => {
        let reward = 0;
        delegationList.map(value => {
            reward = reward + value.reward;
        })
        return reward; 
    }, [delegationList])

    useEffect(() => {
        if(delegationList.length > 0){
            StakingActions.updateStakingRewardState(convertToFctNumber(allReward));
        }
    },[delegationList, allReward]);

    const refreshStakings = async() => {
        try {
            await handleDelegationState();
            await refetchValidatorDescList();
            await handleRedelegationState();
            await handleUndelegationState();
            await handleStakingGrantState();
        CommonActions.handleLoadingProgress(false);
            handleIsRefresh(false);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }

    const handleOpenModal = (open:boolean) => {
        setOpenModal(open);
    }

    const handleSelectSort = (index:number) => {
        setSelected(index);
        pollingDelegations(index);
        handleOpenModal(false);
    }

    const pollingDelegations = async(index:number) => {
        try {
            switch (index) {
                case 0:
                    await handleDelegationState();
                    return;
                case 1:
                    await handleRedelegationState();
                    return;
                case 2:
                    await handleUndelegationState();
                    return;
                case 3:
                    await handleStakingGrantState();
                    return;
            }
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }

    const listLength = useMemo(() => {
        switch (selected) {
            case 0:
                return delegationList? delegationList.length : 0;
            case 1:
                return redelegationList? redelegationList.length : 0;
            case 2:
                return undelegationList? undelegationList.length : 0;
            case 3:
                return stakingGrantState.count;
            default:
                return 0;
        }
    }, [selected, delegationList, redelegationList, undelegationList, stakingGrantState]);

    const ClassifyByType = () => {
        switch (selected) {
            case 0:
                return delegate();
            case 1:
                return redelegate();
            case 2:
                return undelegate();
            case 3:
                return restake();
        }
    }

    useEffect(() => {
        const refreshDelegationList = async() => {
            try {
                switch (selected) {
                    case 0:
                        return await handleDelegationState();
                    case 1:
                        return await handleRedelegationState();
                    case 2:
                        return await handleUndelegationState();
                    default:
                        return 0;
                }
            } catch (error) {
                CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
                console.log(error);
            }
        }

        refreshDelegationList();
    }, [selected])

    useEffect(() => {
        if(isRefresh && visible){
            refreshStakings();
        }
    }, [isRefresh, visible])

    useEffect(() => {
        if(visible){
            refreshStakings();
        }
    }, [visible])

    const delegate = () => {
        return (
            <View>
            {delegationList.length > 0?
            delegationList.map((value, index) => {
                const isLastItem = index === delegationList.length -1;
                return (
                    <View
                        key={index}
                        style={isLastItem?
                            styles.itemBoxLast:
                            styles.itemBox}>
                        <DelegateItem data={value} navigate={navigateValidator} />
                    </View>
                )
            })
            :
            <NoticeItem notification={DELEGATE_NOT_EXIST} />
            }
            </View>
        )
    }

    const redelegate = () => {
        return (
            <View>
            {redelegationList.length > 0?
            redelegationList.map((value, index) => {
                const isLastItem = index === redelegationList.length -1;
                return (
                    <View
                        key={index}
                        style={isLastItem?
                            styles.itemBoxLast:
                            styles.itemBox}>
                        <RedelegateItem data={value} navigate={navigateValidator} />
                    </View>
                )
            })
            :
            <NoticeItem notification={REDELEGATE_NOT_EXIST} />
            }
            </View>
        )
    }

    const undelegate = () => {
        return (
            <View>
            {undelegationList.length > 0?
            undelegationList.map((value, index) => {
                const isLastItem = index === undelegationList.length -1;
                return (
                    <View
                        key={index}
                        style={isLastItem?
                            styles.itemBoxLast:
                            styles.itemBox}>
                        <UndelegateItem data={value} navigate={navigateValidator} />
                    </View>
                )
            })
            :
            <NoticeItem notification={UNDELEGATE_NOT_EXIST} />
            }
            </View>
        )
    }

    const restake = () => {
        return (
            <View>
            {stakingGrantList.list.length > 0?
            stakingGrantList.list.map((value, index) => {
                const isLastItem = index === stakingGrantList.list.length -1;
                return (
                    <View
                        key={index}
                        style={isLastItem?
                            styles.itemBoxLast:
                            styles.itemBox}>
                        <RestakeItem data={value} navigate={navigateValidator} />
                    </View>
                )
            })
            :
            <NoticeItem notification={DELEGATE_NOT_EXIST} />
            }
            </View>
        )
    }

    return (
        <>
        {visible &&
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List
                    <Text style={{color: PointLightColor}}>{" " + listLength}</Text>
                    {selected === 3 &&
                    <Text style={{color: TextGrayColor, opacity: .6}}>{"/" + stakingGrantList.list.length}</Text>
                    }
                </Text>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity style={styles.sortButton} onPress={() => handleOpenModal(true)}>
                        <Text style={[styles.sortItem, {paddingRight: 4}]}>{sortItems[selected]}</Text>
                        <DownArrow size={12} color={GrayColor} />
                    </TouchableOpacity>
                </View>
            </View>
            {ClassifyByType()}
            <CustomModal 
                bgColor={BgColor}
                visible={openModal} 
                handleOpen={handleOpenModal}>
                <ModalItems initVal={selected} data={sortItems} onPressEvent={handleSelectSort}/>
            </CustomModal>
        </View>
        }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        overflow: "hidden",
        justifyContent: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    itemBox: {
        borderBottomColor: BorderColor,
        borderBottomWidth: .5,
    },
    itemBoxLast: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: "hidden",
    },
    title: {
        flex: 2,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    sortItem: {
        color: GrayColor,
        fontFamily: Lato,
        fontSize: 16,
    },
})

export default DelegationList;