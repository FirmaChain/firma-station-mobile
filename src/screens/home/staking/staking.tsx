import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StakingValues, useValidatorDescription } from "@hooks/staking/hooks";
import { BgColor, BoxColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from "@constants/theme";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import ValidatorList from "@/organims/staking/validatorList";
import DelegationList from "@/organims/staking/delegationList";
import BalancesBox from "@/organims/staking/parts/balanceBox";
import RewardBox from "@/organims/staking/parts/rewardBox";
import { useNavigation } from "@react-navigation/native";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

interface Props {
    state: any
}

const StakingScreen: React.FunctionComponent<Props> = (props) => {
    const navigation:ScreenNavgationProps = useNavigation();
    
    const {state} = props;
    const {stakingState,
        validatorsState,} = state;

    const [tab, setTab] = useState(0);
    const [delegations, setDelegations]:Array<any> = useState();
    
    const [stakingValues, setStakingValues] = useState<StakingValues>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    useEffect(() => {
        setDelegations(useValidatorDescription(stakingState.delegateList, validatorsState.validators));

        setStakingValues({
            available: stakingState.available,
            delegated: stakingState.delegated,
            undelegate: stakingState.undelegate,
            stakingReward: stakingState.stakingReward,
        });
    }, [state]);

    const handleMoveToValidator = (address:string) => {
        navigation.navigate(Screens.Validator, {
            validatorAddress: address,
            delegations: delegations,
        });
    }

    const handleWithdrawAll = () => {

    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.box}>
                    <RewardBox reward={stakingValues.stakingReward} transactionHandler={handleWithdrawAll}/>
                    <BalancesBox stakingValues={stakingValues}/>
                </View>

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
                {tab === 0 && <DelegationList delegations={delegations} navigateValidator={handleMoveToValidator}/>}
                {tab === 1 && <ValidatorList validators={validatorsState.validators} navigateValidator={handleMoveToValidator}/>}
            </ScrollView>
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
        marginBottom: 36,
        borderRadius: 4,
    },
    tabBox: {
        height: 58,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: BoxColor,
        borderBottomWidth: 1,
        borderBottomColor: DisableColor,
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