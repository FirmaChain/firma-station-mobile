import React from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { BgColor } from "@/constants/theme";
import ProposalList from "@/organims/governance/proposalList";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

interface Props {
    state: any
}

const GovernanceScreen: React.FunctionComponent<Props> = (props) => {
    const navigation:ScreenNavgationProps = useNavigation();
    const {state} = props;
    const {governanceState} = state;


    const handleMoveToDetail = (proposalId:number) => {
        navigation.navigate(Screens.Proposal, {proposalId: proposalId});
    }

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