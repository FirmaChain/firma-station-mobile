import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CommonActions, StakingActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { useDelegationData } from "@/hooks/staking/hooks";
import { convertToFctNumber } from "@/util/common";
import { BgColor, BoxColor, DisableColor, GrayColor, Lato, PointLightColor, TextGrayColor } from "@/constants/theme";
import { DownArrow } from "@/components/icon/icon";
// import { RESTAKE_API } from "@/../config";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";
import DelegateItem from "./delegateItem";
import RedelegateItem from "./redelegateItem";
import UndelegateItem from "./undelegateItem";
import RestakeItem from "./restakeItem";

interface Props {
    visible: boolean;
    isRefresh: boolean;
    handleIsRefresh: (refresh:boolean) => void;
    navigateValidator: (address:string) => void;
}

interface RestakeStates {
    validatorAddress: string,
    accRestakeAmount: number,
    isActive: boolean,
}

const DelegationList = ({visible, isRefresh, handleIsRefresh, navigateValidator}:Props) => {
    const {wallet, common} = useAppSelector(state => state);

    // const sortItems = ['Delegate', 'Redelegate', 'Undelegate', 'Restake'];
    const sortItems = ['Delegate', 'Redelegate', 'Undelegate'];
    const [selected, setSelected] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [stakingGrantListFromBot, setStakingGrantListFromBot] = useState([]);

    const { delegationState, 
        redelegationState, 
        undelegationState, 
        // stakingGrantState,
        handleDelegationState,
        handleRedelegationState,
        handleUndelegationState,
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

    // const stakingGrantList:Array<String> = useMemo(() => {
    //     if(stakingGrantState.length > 0){
    //         return stakingGrantState[0].authorization.allow_list;
    //     }
    //     return [];
    // }, [stakingGrantState])

    // const restakeList = useMemo(() => {

    // },[delegationList, stakingGrantList, stakingGrantListFromBot])

    // useEffect(() => {
    //     const getStakingGrantListFromBot = async() => {
    //         try {
    //             const result = await fetch(RESTAKE_API + wallet.address);
    //             const json = await result.json();
    //             setStakingGrantListFromBot(json);
    //         } catch (error) {
    //             console.log(error);
    //             return [];
    //         }
    //     }
    //     getStakingGrantListFromBot();
    // }, [stakingGrantList])

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
            await refetchValidatorDescList();
            await handleDelegationState();
            if(redelegationList.length > 0){
                await handleRedelegationState();
            }
            if(undelegationList.length > 0){
                await handleUndelegationState();
            }
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
                    if(delegationList.length === 0){
                        await handleDelegationState();
                    }
                    return;
                case 1:
                    if(redelegationList.length === 0){
                        CommonActions.handleLoadingProgress(true);
                        await handleRedelegationState();
                        CommonActions.handleLoadingProgress(false);
                    }
                    return;
                case 2:
                    if(undelegationList.length === 0){
                        CommonActions.handleLoadingProgress(true);
                        await handleUndelegationState();
                        CommonActions.handleLoadingProgress(false);
                    }
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
            // case 3:
            //     return delegationList? delegationList.length : 0;
            default:
                return 0;
        }
    }, [selected, delegationList, redelegationList, undelegationList]);

    const ClassifyByType = () => {
        switch (selected) {
            case 0:
                return delegate();
            case 1:
                return redelegate();
            case 2:
                return undelegate();
            // case 3:
            //     return restake();
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
        if(isRefresh && visible || visible){
            refreshStakings();
        }
    }, [isRefresh, visible])

    const delegate = () => {
        return (
            <View>
            {delegationList.map((value, index) => {
                return (
                    <DelegateItem key={index} data={value} navigate={navigateValidator} />
                )
            })}
            </View>
        )
    }

    const redelegate = () => {
        return (
            <View>
            {redelegationList.map((value, index) => {
                return (
                    <RedelegateItem key={index} data={value} navigate={navigateValidator} />
                )
            })}
            </View>
        )
    }

    const undelegate = () => {
        return (
            <View>
            {undelegationList.map((value, index) => {
                return (
                    <UndelegateItem key={index} data={value} navigate={navigateValidator} />
                )
            })}
            </View>
        )
    }

    // const restake = () => {
    //     return (
    //         <View>
    //         {delegationList.map((value, index) => {
    //             return (
    //                 <RestakeItem key={index} data={value} grantList={stakingGrantList} grantListFromBot={stakingGrantListFromBot} navigate={navigateValidator} />
    //             )
    //         })}
    //         </View>
    //     )
    // }

    return (
        <>
        {visible &&
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List 
                    <Text style={{color: PointLightColor}}> {listLength}</Text>
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
        backgroundColor: BoxColor,
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 5,
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    item : {
        paddingTop: 22,
        backgroundColor: BgColor,
        marginVertical: 5,
        borderRadius: 8,
    },
    title: {
        flex: 2,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: DisableColor,
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