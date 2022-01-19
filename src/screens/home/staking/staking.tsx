import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useStakingData } from "../../../hooks/staking/useStakingData";
import RefreshScrollView from "../../../components/parts/refreshScrollView";
import ValidatorList from "../../../organims/staking/validatorList";
import { BgColor } from "../../../constants/theme";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import DelegationList from "../../../organims/staking/delegationList";
import BalancesBox from "../../../organims/staking/parts/balanceBox";
import { useOrganizedBalances } from "../../../hooks/wallet/useBalanceData";
import RewardBox from "../../../organims/staking/parts/rewardBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Staking>;

interface Props {
    navigation: ScreenNavgationProps;
}

const StakingScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation} = props;
    
    const { validatorsState } = useStakingData();
    const { organizedBalances, organizedReward } = useOrganizedBalances();

    const handleMoveToValidator = (validator:any) => {
        navigation.navigate(Screens.Validator, {validator: validator});
    }

    return (
        <View style={styles.container}>
            <RefreshScrollView>
                <ScrollView>
                    <BalancesBox balances={organizedBalances}/>
                    <RewardBox reward={organizedReward} />
                    <DelegationList validators={validatorsState.validators} navigateValidator={handleMoveToValidator}/>
                    <ValidatorList validators={validatorsState.validators} navigateValidator={handleMoveToValidator}/>
                </ScrollView>
            </RefreshScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
    },
})


export default React.memo(StakingScreen);