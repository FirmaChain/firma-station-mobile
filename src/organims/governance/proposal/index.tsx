import React from "react";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useProposalData } from "@/hooks/governance/hooks";
import { BgColor } from "@/constants/theme";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import DescriptionSection from "./descriptionSection";
import TitleSection from "./titleSection";
import VotingSection from "./votingSection";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Proposal>;

interface Props {
    proposalId: number;
}

const Proposal = ({proposalId}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { proposalState, handleProposalPolling } = useProposalData(proposalId);

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Proposal"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <RefreshScrollView
                    refreshFunc={handleProposalPolling}>
                    <>
                    {proposalState && <TitleSection data={proposalState.titleState} />}
                    {proposalState && <DescriptionSection data={proposalState.descState} />}
                    {proposalState && <VotingSection data={proposalState.voteState} />}
                    </>
                </RefreshScrollView>
            </ViewContainer>
        </Container>
    )
}

export default Proposal;

