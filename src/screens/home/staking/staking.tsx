import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useStakingData, useValidatorData } from "@hooks/staking/hooks";
import { BgColor, BoxColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from "@constants/theme";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import ValidatorList from "@/organims/staking/validatorList";
import DelegationList from "@/organims/staking/delegationList";
import BalancesBox from "@/organims/staking/parts/balanceBox";
import RewardBox from "@/organims/staking/parts/rewardBox";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { FIRMACHAIN_DEFAULT_CONFIG, TRANSACTION_TYPE } from "@/constants/common";
import { getEstimateGasFromAllDelegations } from "@/util/firma";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import AlertModal from "@/components/modal/alertModal";
import { useHistoryData } from "@/hooks/wallet/hooks";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { wait } from "@/util/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

const StakingScreen = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { wallet, staking } = useAppSelector(state => state);
    const isFocused = useIsFocused();

    const { validators, handleValidatorsPolling } = useValidatorData();
    const { stakingState, getStakingState, updateStakingState } = useStakingData();
    const { recentHistory, currentHistoryPolling, refetchCurrentHistory } = useHistoryData();

    const [tab, setTab] = useState(0);
    const [isRefresh, setIsRefresh] = useState(false);
    const [withdrawAllGas, setWithdrawAllGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertDescription, setAlertDescription] = useState('');

    const validatorList = useMemo(() => {
        return validators;
    }, [validators]);

    useEffect(() => {
        if(stakingState.stakingReward > 0) {
            updateStakingState(stakingState.stakingReward);
        }
    }, [stakingState.stakingReward])

    const currentHistoryRefetch = async() => {
        if(refetchCurrentHistory)
            await refetchCurrentHistory();
    }

    const handleCurrentHistoryPolling = (polling:boolean) => {
        if(currentHistoryPolling) {
            currentHistoryRefetch();
            currentHistoryPolling(polling);
        }
    }

    const handleMoveToValidator = (address:string) => {
        navigation.navigate(Screens.Validator, {
            validatorAddress: address,
        });
    }

    const handleModalOpen = (open:boolean) => {
        setIsAlertModalOpen(open);
    }

    const handleWithdrawAll = (password:string) => {
        if(alertDescription !== '') return handleModalOpen(true);
        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW ALL"],
            password: password,
            address : wallet.address,
            gas: withdrawAllGas,
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    useEffect(() => {
        const getGasFromAllDelegations = async() => {
            if(stakingState.stakingReward > 0 && stakingState.available > FIRMACHAIN_DEFAULT_CONFIG.defaultFee){
                await getEstimateGasFromAllDelegations(wallet.name).then(value => {
                    setWithdrawAllGas(value);
                    setAlertDescription('');
                })
                .catch(error => {
                    console.log(error);
                    setAlertDescription(String(error));
                });
            }
        }

        if(isFocused)
            getGasFromAllDelegations();
    }, [stakingState, validators]);

    useEffect(() => {
        if(recentHistory !== undefined){
            refreshStates();
        }
    },[recentHistory])

    const refreshStates = async() => {
        setIsRefresh(true);
        CommonActions.handleLoadingProgress(true);
        if(validatorList.length > 0){
            await handleValidatorsPolling();
        }
        await getStakingState();
        wait(1500).then(() => {
            CommonActions.handleLoadingProgress(false);
        });
        setIsRefresh(false);
    }

    useFocusEffect(
        useCallback(() => {
            handleCurrentHistoryPolling(true);
            return () => {
                handleCurrentHistoryPolling(false);
            }
        }, [])
    )

    return (
        <View style={styles.container}>
            <RefreshScrollView
                refreshFunc={refreshStates}>
                <>
                <View style={styles.box}>
                    <RewardBox gas={withdrawAllGas} reward={staking.stakingReward} transactionHandler={handleWithdrawAll}/>
                    <BalancesBox stakingValues={stakingState}/>
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.tabBox}>
                        <TouchableOpacity 
                            style={[styles.tab, {borderBottomColor: tab === 0? WhiteColor:'transparent'}]}
                            onPress={()=>setTab(0)}>
                            <Text style={tab === 0?styles.tabTitleActive:styles.tabTitleInactive}>My Stakings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.tab, {borderBottomColor: tab === 1? WhiteColor:'transparent'}]}
                            onPress={()=>setTab(1)}>
                            <Text style={tab === 1?styles.tabTitleActive:styles.tabTitleInactive}>Validator</Text>
                        </TouchableOpacity>
                    </View>
                    <DelegationList 
                        visible={tab === 0}
                        isRefresh={isRefresh}
                        navigateValidator={handleMoveToValidator}/>
                    <ValidatorList 
                        visible={tab === 1}
                        validators={validatorList} 
                        navigateValidator={handleMoveToValidator}/>
                    
                    <AlertModal
                        visible={isAlertModalOpen}
                        handleOpen={handleModalOpen}
                        title={"Failed"}
                        desc={alertDescription}
                        confirmTitle={"OK"}
                        type={"ERROR"}/>
                </View>
                </>
            </RefreshScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
        paddingTop: 32,
    },
    box: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 4,
    },
    listContainer: {
        paddingVertical: 15,
        backgroundColor: BoxColor,
    },
    tabBox: {
        height: 58,
        marginHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BgColor,
        borderBottomWidth: 1,
        borderBottomColor: DisableColor,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    tab: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 3,
    },
    tabTitleActive: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        fontWeight: "bold",
        paddingTop: 3,
    },
    tabTitleInactive: {
        fontFamily: Lato,
        fontSize: 16,
        color: InputPlaceholderColor,
        paddingTop: 3,
    }
})


export default React.memo(StakingScreen);