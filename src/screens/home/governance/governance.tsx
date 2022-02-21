import React, { useCallback, useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BgColor } from "@/constants/theme";
import ProposalList from "@/organims/governance/proposalList";
import { useGovernanceList } from "@/hooks/governance/hooks";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import { AppContext } from "@/util/context";
import { CONTEXT_ACTIONS_TYPE } from "@/constants/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

const GovernanceScreen: React.FunctionComponent = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const { dispatchEvent } = useContext(AppContext);
    const { governanceState, getGovernanceComplete, handleGovernanceListPolling } = useGovernanceList();

    const handleMoveToDetail = (proposalId:number) => {
        navigation.navigate(Screens.Proposal, {proposalId: proposalId});
    }

    const refreshStates = () => {
        handleGovernanceListPolling && handleGovernanceListPolling();
    }

    useEffect(() => {
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], !getGovernanceComplete);
    }, [getGovernanceComplete])
    

    useFocusEffect(
        useCallback(() => {
            dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
            refreshStates();
            setTimeout(() => {
                dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
            }, 1000);
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


export default React.memo(GovernanceScreen);