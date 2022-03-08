import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { useGovernanceList } from "@/hooks/governance/hooks";
import { BgColor } from "@/constants/theme";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import ProposalList from "./proposalList";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

const Governance = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const { governanceState, handleGovernanceListPolling } = useGovernanceList();

    const handleMoveToDetail = (proposalId:number) => {
        navigation.navigate(Screens.Proposal, {proposalId: proposalId});
    }

    const refreshStates = async() => {
        CommonActions.handleLoadingProgress(true);
        await handleGovernanceListPolling();
        CommonActions.handleLoadingProgress(false);
    }

    useFocusEffect(
        useCallback(() => {
            refreshStates();
        }, [])
    )

    return (
        <View style={styles.container}>
            <View style={styles.listBox}>
                <RefreshScrollView
                    refreshFunc={refreshStates}>
                    <ProposalList proposals={governanceState.list} handleDetail={handleMoveToDetail}/>
                </RefreshScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor,
    },
    listBox: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 32,
        marginBottom: 20,
        justifyContent: "center",
    }
})


export default Governance;