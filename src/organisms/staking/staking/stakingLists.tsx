import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { useDelegationData } from '@/hooks/staking/hooks';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { useIsFocused } from '@react-navigation/native';
import DelegationList from '../parts/delegation/delegationList';
import ValidatorList from '../parts/validator/validatorList';
import StakingSkeleton from '@/components/skeleton/stakingSkeleton';
import RestakeList from '../parts/restake/restakeList';
import { wait } from '@/util/common';

interface IProps {
    isRefresh: boolean;
    handleIsRefresh: (refresh: boolean) => void;
    navigateValidator: (address: string) => void;
}

const StakingLists = ({ isRefresh, handleIsRefresh, navigateValidator }: IProps) => {
    const isFocused = useIsFocused();
    const { common } = useAppSelector((state) => state);
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

    const VisibleLoading = useMemo(() => {
        return dataLoading;
    }, [dataLoading]);

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
                CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            }
        },
        [tab, isFocused, delegationExist]
    );

    const handleTab = async (index: number) => {
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
        let exist = delegationState.length > 0 || redelegationState.length > 0 || undelegationState.length > 0;
        handleDelegationExist(exist);
    }, [delegationState, redelegationState, undelegationState]);

    return (
        <View style={styles.listContainer}>
            <View style={styles.tabBox}>
                {delegationExist && (
                    <React.Fragment>
                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: tab === 0 ? WhiteColor : 'transparent' }]}
                            onPress={() => handleTab(0)}
                        >
                            <Text style={tab === 0 ? styles.tabTitleActive : styles.tabTitleInactive}>My Stake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, { borderBottomColor: tab === 1 ? WhiteColor : 'transparent' }]}
                            onPress={() => handleTab(1)}
                        >
                            <Text style={tab === 1 ? styles.tabTitleActive : styles.tabTitleInactive}>Restake</Text>
                        </TouchableOpacity>
                    </React.Fragment>
                )}
                <TouchableOpacity
                    style={[styles.tab, { borderBottomColor: tab === 2 ? WhiteColor : 'transparent' }]}
                    onPress={() => handleTab(2)}
                >
                    <Text style={tab === 2 ? styles.tabTitleActive : styles.tabTitleInactive}>Validator</Text>
                </TouchableOpacity>
                {delegationExist === false && <View style={[styles.tab, { borderBottomColor: 'transparent' }]}></View>}
            </View>
            <View style={{ display: VisibleLoading ? 'none' : 'flex' }}>
                <DelegationList
                    visible={tab === 0}
                    delegationState={delegationState}
                    redelegationState={redelegationState}
                    undelegationState={undelegationState}
                    navigateValidator={navigateValidator}
                />
                <RestakeList
                    visible={tab === 1}
                    isRefresh={isRefresh}
                    delegationState={delegationState}
                    restakeState={stakingGrantState}
                    handleIsRefresh={handleIsRefresh}
                    navigateValidator={navigateValidator}
                />
                <ValidatorList
                    visible={tab === 2}
                    isRefresh={isRefresh}
                    handleIsRefresh={handleIsRefresh}
                    navigateValidator={navigateValidator}
                />
            </View>
            <StakingSkeleton visible={VisibleLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        height: '100%',
        paddingVertical: 15,
        backgroundColor: BoxColor
    },
    tabBox: {
        height: 58,
        marginHorizontal: 20,
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
