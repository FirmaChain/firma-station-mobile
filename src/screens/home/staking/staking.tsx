import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useStakingData } from "../../../hooks/staking/useStakingData";
import RefreshScrollView from "../../../components/parts/refreshScrollView";
import ValidatorList from "../../../organims/staking/validatorList";
import { BgColor, BoxColor } from "../../../constants/theme";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";
import DelegationList from "../../../organims/staking/delegationList";
import BalancesBox from "../../../organims/staking/parts/balanceBox";
import { useOrganizedBalances } from "../../../hooks/wallet/useBalanceData";
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
    
    const { validatorsState } = useStakingData();
    const { organizedBalances, organizedReward } = useOrganizedBalances(address);

    const handleMoveToValidator = (validator:any) => {
        navigation.navigate(Screens.Validator, {validator: validator, address: address, walletName: walletName});
    }

    const handleTransaction = () => {

    }

    return (
        <View style={styles.container}>
            <RefreshScrollView>
                <ScrollView>
                    <View style={styles.box}>
                        <BalancesBox balances={organizedBalances}/>
                        <RewardBox reward={organizedReward} transactionHandler={handleTransaction}/>
                    </View>
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
    box: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 4,
        backgroundColor: BoxColor,
    }
})


export default React.memo(StakingScreen);