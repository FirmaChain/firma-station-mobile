import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BgColor } from "@/constants/theme";
import ProposalList from "@/organims/governance/proposalList";
import { useGovernanceList } from "@/hooks/governance/hooks";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

const GovernanceScreen: React.FunctionComponent = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { governanceState, handleGovernanceListPolling } = useGovernanceList();

    const handleMoveToDetail = (proposalId:number) => {
        navigation.navigate(Screens.Proposal, {proposalId: proposalId});
    }

    useFocusEffect(
        useCallback(() => {
            handleGovernanceListPolling && handleGovernanceListPolling(true);
            return () => {
                handleGovernanceListPolling && handleGovernanceListPolling(false);
            }
        }, [])
    )

    return (
        <View style={styles.container}>
            <ProposalList proposals={governanceState.list} handleDetail={handleMoveToDetail}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
    },
    refreshScrollView :{
        flex: 1,
    }
})


export default React.memo(GovernanceScreen);