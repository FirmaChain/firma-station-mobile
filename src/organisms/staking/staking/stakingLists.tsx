import React, { useCallback, useEffect, useState } from 'react';
import { BgColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useDelegationData } from '@/hooks/staking/hooks';
import StakingSkeleton from '@/components/skeleton/stakingSkeleton';

import DelegationList from '../parts/delegation/delegationList';
import RestakeList from '../parts/restake/restakeList';
import ValidatorList from '../parts/validator/validatorList';

interface IProps {
    isRefresh: boolean;
    handleIsRefresh: (refresh: boolean) => void;
    navigateValidator: (address: string) => void;
}

const StakingLists = ({ isRefresh, handleIsRefresh, navigateValidator }: IProps) => {
    const { dataLoadStatus } = useAppSelector((state) => state.common);

    const isFocused = useIsFocused();

    const { delegationState, redelegationState, undelegationState, stakingGrantState, handleDelegationState } = useDelegationData();

    const [tab, setTab] = useState(0);
    const [dataLoading, setDataLoading] = useState(true);
    const [delegationExist, setDelegationExist] = useState(true);

    const handleDelegationLoading = (loading: boolean) => {
        setDataLoading(loading);
    };

    const handleDelegationExist = (exist: boolean) => {
        setDelegationExist(exist);
    };

    const handleTabFromDelegationData = useCallback(() => {
        if (delegationExist) {
            setTab(0);
        } else {
            setTab(2);
        }
    }, [delegationExist]);

    const loadDelegationState = useCallback(
        async (selectedTab: number) => {
            if (isFocused === false) return;
            if (delegationExist && selectedTab >= 2) return;
            try {
                await handleDelegationState();
                if (selectedTab === 0) handleIsRefresh(false);
                await wait(800)
                    .then(() => {
                        handleDelegationLoading(false);
                    })
                    .catch((error) => console.log(error));
            } catch (error) {
                console.log(error);
                CommonActions.handleDataLoadStatus(dataLoadStatus + 1);
            }
        },
        [tab, isFocused, delegationExist]
    );

    const handleTab = async (index: number) => {
        if (dataLoading) return;
        try {
            if (index === tab) return;
            setTab(index);
            await loadDelegationState(index);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleTabFromDelegationData();
    }, [delegationExist]);

    useEffect(() => {
        if (isFocused && isRefresh) {
            loadDelegationState(tab);
        }
    }, [isFocused, isRefresh, tab]);

    useEffect(() => {
        const exist = delegationState.length > 0 || redelegationState.length > 0 || undelegationState.length > 0;
        handleDelegationExist(exist);
    }, [delegationState, redelegationState, undelegationState]);

    const inlineStyles1 = {
        inlineStyle1: { borderBottomColor: tab === 0 ? WhiteColor : 'transparent' },
        inlineStyle2: { borderBottomColor: tab === 1 ? WhiteColor : 'transparent' },
        inlineStyle3: { borderBottomColor: tab === 2 ? WhiteColor : 'transparent' },
        inlineStyle4: { flex: 1 }
    } as const;

    return (
        <View style={styles.listContainer}>
            {dataLoading ? (
                <StakingSkeleton />
            ) : (
                <>
                    <View style={styles.tabBox}>
                        <TouchableOpacity style={[styles.tab, inlineStyles1.inlineStyle1]} onPress={() => handleTab(0)}>
                            <Text style={tab === 0 ? styles.tabTitleActive : styles.tabTitleInactive}>My Stake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, inlineStyles1.inlineStyle2]} onPress={() => handleTab(1)}>
                            <Text style={tab === 1 ? styles.tabTitleActive : styles.tabTitleInactive}>Restake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, inlineStyles1.inlineStyle3]} onPress={() => handleTab(2)}>
                            <Text style={tab === 2 ? styles.tabTitleActive : styles.tabTitleInactive}>Validator</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={inlineStyles1.inlineStyle4}>
                        {tab === 0 && (
                            <DelegationList
                                delegationState={delegationState}
                                redelegationState={redelegationState}
                                undelegationState={undelegationState}
                                navigateValidator={navigateValidator}
                            />
                        )}
                        {tab === 1 && (
                            <RestakeList
                                isRefresh={isRefresh}
                                delegationState={delegationState}
                                restakeState={stakingGrantState}
                                handleIsRefresh={handleIsRefresh}
                                navigateValidator={navigateValidator}
                            />
                        )}
                        {tab === 2 && (
                            <ValidatorList isRefresh={isRefresh} handleIsRefresh={handleIsRefresh} navigateValidator={navigateValidator} />
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flex: 1
    },
    tabBox: {
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BgColor,
        borderBottomWidth: 1,
        borderBottomColor: DisableColor,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    tab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3
    },
    tabTitleActive: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        fontWeight: 'bold',
        paddingTop: 3
    },
    tabTitleInactive: {
        fontFamily: Lato,
        fontSize: 16,
        color: InputPlaceholderColor,
        paddingTop: 3
    }
});

export default StakingLists;
