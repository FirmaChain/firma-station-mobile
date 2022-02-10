import React, { useEffect, useMemo, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, StyleSheet } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { useProposalData } from "@/hooks/governance/hooks";
import TitleSection from "@/organims/governance/proposal/titleSection";
import DescriptionSection from "@/organims/governance/proposal/descriptionSection";
import { convertTime } from "@/util/common";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { BgColor, Lato } from "@/constants/theme";
import VotingSection from "@/organims/governance/proposal/votingSection";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Proposal>;

export type ProposalParams = {
    proposalId: number;
}

interface ProposalScreenProps {
    route: {params: ProposalParams};
    navigation: ScreenNavgationProps;
}

const ProposalScreen: React.FunctionComponent<ProposalScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {proposalId} = params;

    const { proposalState } = useProposalData(proposalId);

    const [titleData, setTitleData] = useState<any>(null);
    const [descData, setDescData] = useState<any>(null);
    const [voteData, setVoteData] = useState<any>(null);

    const handleBack = () => {
        navigation.goBack();
    }

    const convertDepositPeriod = (period:number, submitTime:string) => {
        const periodToDay = period / 86400000000000;
        const date = new Date(submitTime);
        date.setDate(date.getDate() + periodToDay);
        
        return convertTime(date.toString(), true);;
    }

    useEffect(() => {
        if(proposalState){
            setTitleData({
                id: proposalState.proposalId,
                title: proposalState.title,
                status: proposalState.status,
            });

            setDescData({
                status: proposalState.status,
                type: proposalState.proposalType,
                submitTime: proposalState.submitTime,
                description: proposalState.description,
                classified: proposalState.classified,
                votingStartTime: proposalState.votingStartTime,
                votingEndTime: proposalState.votingEndTime,
                depositPeriod: convertDepositPeriod(proposalState.depositPeriod, proposalState.submitTime),
                minDeposit: proposalState.minDeposit,
                proposalDeposit: proposalState.proposalDeposit,
            });

            setVoteData({
                votingStartTime: proposalState.votingStartTime,
                votingEndTime: proposalState.votingEndTime,
                quorum: proposalState.quorum,
                currentTurnout: proposalState.currentTurnout,
                stakingPool: proposalState.stakingPool,
                proposalTally: proposalState.proposalTally,
            });
        }
    }, [proposalState])

    return (
        <Container
            title="Proposal"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <ScrollView>
                    <TitleSection data={titleData} />
                    <DescriptionSection data={descData} />
                    <VotingSection data={voteData} />
                </ScrollView>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    boxH: {
        flexDirection: "row",
    },
    boxV: {

    },
    status: {
        fontFamily: Lato,
        fontWeight: "bold",
        fontSize: 11,
        borderRadius: 10,
        textAlign: "center",
        overflow: "hidden",
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    divier: {
        height: 1,
        backgroundColor: "#aaa",
        marginVertical: 10,
        marginHorizontal: 20,
    },

})

export default React.memo(ProposalScreen);