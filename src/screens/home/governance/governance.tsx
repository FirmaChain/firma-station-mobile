import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import { BgColor } from "@/constants/theme";
import { useGovernanceList } from "@/hooks/governance/hooks";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import ProposalList from "@/organims/governance/proposalList";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

interface Props {
    navigation: ScreenNavgationProps;
}

const GovernanceScreen: React.FunctionComponent<Props> = (props) => {
    const {navigation} = props;

    const { governanceState } = useGovernanceList();

    const handleMoveToDetail = (proposalId:number) => {
        navigation.navigate(Screens.Proposal, {proposalId: proposalId});
    }

    return (
        <View style={styles.container}>
            <RefreshScrollView>
                <ProposalList proposals={governanceState.list} handleDetail={handleMoveToDetail}/>
            </RefreshScrollView>
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