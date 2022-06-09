import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CommonActions, StakingActions } from "@/redux/actions";
import { useDelegationData } from "@/hooks/staking/hooks";
import { convertAmount, convertTime, convertToFctNumber } from "@/util/common";
import { BgColor, BoxColor, DisableColor, GrayColor, Lato, PointLightColor, TextGrayColor } from "@/constants/theme";
import { DownArrow } from "@/components/icon/icon";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";
import MonikerSection from "./parts/list/monikerSection";
import DataSection from "./parts/list/dataSection";
import MonikerSectionForRedelegate from "./parts/list/monikerSectionForRedelegate";

interface Props {
    visible: boolean;
    isRefresh: boolean;
    navigateValidator: (address:string) => void;
}

const DelegationList = ({visible, isRefresh, navigateValidator}:Props) => {
    const sortItems = ['Delegate', 'Redelegate', 'Undelegate'];
    const [selected, setSelected] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const { delegationState, 
        redelegationState, 
        undelegationState, 
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

    useEffect(() => {
        if(isRefresh === false){
            if(delegationList.length > 0){
                let reward = 0;
                delegationList.map(value => {
                    reward = reward + value.reward;
                })
                StakingActions.updateStakingRewardState(convertToFctNumber(reward));
            }
        }
    },[delegationList]);

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
        } catch (error) {
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
        }
    }

    useEffect(() => {
        if(isRefresh){
            refreshStakings();
        } 
    }, [isRefresh])

    const convertDelegateAmount = (amount:number) => {
        if(amount >= 10000){ return convertAmount(amount, true, 2)}
        if(amount >= 1000){ return convertAmount(amount, true, 3)}
        if(amount >= 100){ return convertAmount(amount, true, 4)}
        if(amount >= 10){ return convertAmount(amount, true, 5)}
        if(amount >= 0){ return convertAmount(amount, true, 6)}
    }

    const delegate = () => {
        return (
            <>
            {delegationList.map((value, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => navigateValidator(value.validatorAddress)}>
                        <View style={[styles.item]}>
                            <MonikerSection validator={value} />
                            <DataSection title="Delegated" data={convertDelegateAmount(value.amount) + " FCT"} />
                            <DataSection title="Reward" data={convertAmount(value.reward, true, 6) + " FCT"} />
                            <View style={{paddingBottom: 22}} />
                        </View>
                    </TouchableOpacity>
                )
            })}
            </>
        )
    }

    const redelegate = () => {
        return (
            <>
            {redelegationList.map((value, index) => {
                return (
                    <View key={index} style={[styles.item]}>
                        <MonikerSectionForRedelegate validators={value} navigateValidator={navigateValidator}/>
                        <DataSection title="Amount" data={convertAmount(value.balance) + " FCT"} />
                        <DataSection title="Linked Until" data={convertTime(value.completionTime, true)} />
                        <View style={{paddingBottom: 22}} />
                    </View>
                )
            })}
            </>
        )
    }

    const undelegate = () => {
        return (
            <>
            {undelegationList.map((value, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => navigateValidator(value.validatorAddress)}>
                        <View style={[styles.item]}>
                                <MonikerSection validator={value} />
                            <DataSection title="Amount" data={convertAmount(value.balance) + " FCT"} />
                            <DataSection title="Linked Until" data={convertTime(value.completionTime, true)} />
                            <View style={{paddingBottom: 22}} />
                        </View>
                    </TouchableOpacity>
                )
            })}
            </>
        )
    }

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
            <CustomModal visible={openModal} handleOpen={handleOpenModal}>
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