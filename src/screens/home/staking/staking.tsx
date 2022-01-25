import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import RefreshScrollView from "@components/parts/refreshScrollView";
import { StakeInfo, StakingValues, useStakingData, useValidatorData, useValidatorDescription } from "@hooks/staking/hooks";
import { BgColor, BoxColor, DisableColor, InputPlaceholderColor, Lato, TextColor, WhiteColor } from "@constants/theme";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import ValidatorList from "../../../organims/staking/validatorList";
import DelegationList from "../../../organims/staking/delegationList";
import BalancesBox from "../../../organims/staking/parts/balanceBox";
import RewardBox from "../../../organims/staking/parts/rewardBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

export type StakingParams = {
    address: string;
    walletName: string;
}

interface Props {
    route: {params: StakingParams};
    navigation: ScreenNavgationProps;
}

const StakingScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {address, walletName} = params;

    const { validatorsState } = useValidatorData();
    const { stakingState, setRefresh } = useStakingData(address);

    const [tab, setTab] = useState(0);
    
    const [stakingValues, setStakingValues] = useState<StakingValues>({
        available: 0,
        delegated: 0,
        undelegate: 0,
        stakingReward: 0,
    });

    useEffect(() => {
        useValidatorDescription(stakingState.delegateList, validatorsState.validators);

        setStakingValues({
            available: stakingState.available,
            delegated: stakingState.delegated,
            undelegate: stakingState.undelegate,
            stakingReward: stakingState.stakingReward,
        });
    }, [stakingState]);

    const handleMoveToValidator = (validator:any) => {
        navigation.navigate(Screens.Validator, 
            {
                validator: validator, 
                address: address, 
                walletName: walletName
            });
    }

    const handleMoveToValidatorFromDelegation = (address:string) => {
        const validator = validatorsState.validators.find((value) => value.validatorAddress === address);
        handleMoveToValidator(validator);
    }

    const handleRefresh = () => {
        setRefresh(true);
    }

    const handleTransaction = () => {

    }

    return (
        <View style={styles.container}>
            <RefreshScrollView
                refreshFunc={handleRefresh}>
                <ScrollView>
                    <View style={styles.box}>
                        <RewardBox reward={stakingValues.stakingReward} transactionHandler={handleTransaction}/>
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
                    {tab === 0 && <DelegationList delegations={useValidatorDescription(stakingState.delegateList, validatorsState.validators)} navigateValidator={handleMoveToValidatorFromDelegation}/>}
                    {tab === 1 && <ValidatorList validators={validatorsState.validators} navigateValidator={handleMoveToValidator}/>}
                </ScrollView>
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


export default React.memo(StakingScreen);