import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useValidatorData } from "@hooks/staking/hooks";
import { BgColor, BoxColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from "@constants/theme";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import ValidatorList from "@/organims/staking/validatorList";
import DelegationList from "@/organims/staking/delegationList";
import BalancesBox from "@/organims/staking/parts/balanceBox";
import RewardBox from "@/organims/staking/parts/rewardBox";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "@/util/context";
import { FIRMACHAIN_DEFAULT_CONFIG, TRANSACTION_TYPE } from "@/constants/common";
import { getEstimateGasFromAllDelegations } from "@/util/firma";
import RefreshScrollView from "@/components/parts/refreshScrollView";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

interface Props {
    state: any;
}

const StakingScreen: React.FunctionComponent<Props> = (props) => {
    const {state} = props;
    const navigation:ScreenNavgationProps = useNavigation();
    
    const { wallet } = useContext(AppContext);
    const { validatorsState, handleValidatorsPolling } = useValidatorData();

    const [tab, setTab] = useState(0);
    const [withdrawAllGas, setWithdrawAllGas] = useState(FIRMACHAIN_DEFAULT_CONFIG.defaultGas);

    useEffect(() => {
        const getGasFromAllDelegations = async() => {
            if(state.stakingState.stakingReward > 0){
                 try {
                     let gas = await getEstimateGasFromAllDelegations(wallet.name);
                     setWithdrawAllGas(gas);
                 } catch (error) {
                     console.log(error);
                 }
            }
        }
        getGasFromAllDelegations();
    }, [state.stakingState, validatorsState]);

    const handleMoveToValidator = (address:string) => {
        navigation.navigate(Screens.Validator, {
            validatorAddress: address,
        });
    }

    const handleWithdrawAll = (password:string) => {
        const transactionState = {
            type: TRANSACTION_TYPE["WITHDRAW ALL"],
            password: password,
            address : wallet.address,
            gas: withdrawAllGas,
        }

        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const refreshStates = () => {
        handleValidatorsPolling();
        state.handleDelegationState();
    }

    return (
        <View style={styles.container}>
            <RefreshScrollView
                refreshFunc={refreshStates}>
                <>
                <View style={styles.box}>
                    <RewardBox gas={withdrawAllGas} reward={state.stakingState.stakingReward} transactionHandler={handleWithdrawAll}/>
                    <BalancesBox stakingValues={state.stakingState}/>
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.tabBox}>
                        <TouchableOpacity 
                            style={[styles.tab, {borderBottomColor: tab === 0? WhiteColor:'transparent'}]}
                            onPress={()=>setTab(0)}>
                            <Text style={tab === 0?styles.tabTitleActive:styles.tabTitleInactive}>My Delegations</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.tab, {borderBottomColor: tab === 1? WhiteColor:'transparent'}]}
                            onPress={()=>setTab(1)}>
                            <Text style={tab === 1?styles.tabTitleActive:styles.tabTitleInactive}>Validator</Text>
                        </TouchableOpacity>
                    </View>
                    {tab === 0 && <DelegationList delegations={state.delegationState} navigateValidator={handleMoveToValidator}/>}
                    {tab === 1 && <ValidatorList validators={validatorsState.validators} navigateValidator={handleMoveToValidator}/>}
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


export default StakingScreen;