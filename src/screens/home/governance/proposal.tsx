import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, StyleSheet, View } from "react-native";
import Container from "../../../components/parts/containers/conatainer";
import ViewContainer from "../../../components/parts/containers/viewContainer";
import { useProposalData } from "../../../hooks/governance/hooks";
import TitleSection from "../../../organims/governance/proposal/titleSection";
import InfoSection from "../../../organims/governance/proposal/infoSection";
import VotingSection from "../../../organims/governance/proposal/votingSection";
import { PROPOSAL_STATUS, PROPOSAL_STATUS_VOTING_PERIOD } from "../../../constants/common";
import Voting from "../../../organims/governance/proposal/voting";
import DepositSection from "../../../organims/governance/proposal/depositSection";
import { convertTime } from "../../../util/common";
import { Screens, StackParamList } from "../../../navigators/stackNavigators";

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
    const [infoData, setInfoData] = useState<any>(null);
    const [voteData, setVoteData] = useState<any>(null);
    const [depositData, setDepositData] = useState<any>(null);
    
    const handleBack = () => {
        navigation.goBack();
    }

    const convertDepositPeriod = (period:number, submitTime:string) => {
        const periodToDay = period / 86400000000000;
        const date = new Date(submitTime);
        date.setDate(date.getDate() + periodToDay);
        
        return convertTime(date.toString());;
    }

    const handleTransaction = () => {
        console.log('TRANSACTION');
        
        navigation.navigate(Screens.Transaction);
    }

    useEffect(() => {
        if(proposalState){
            setTitleData({
                id: proposalState.proposalId,
                title: proposalState.title,
                status: proposalState.status,
            });

            setInfoData({
                type: proposalState.proposalType,
                submitTime: proposalState.submitTime,
                description: proposalState.description,
                classified: proposalState.classified,
            });

            setVoteData({
                votingStartTime: proposalState.votingStartTime,
                votingEndTime: proposalState.votingEndTime,
                quorum: proposalState.quorum,
                currentTurnout: proposalState.currentTurnout,
                stakingPool: proposalState.stakingPool,
                proposalTally: proposalState.proposalTally,
            });

            setDepositData({
                depositPeriod: convertDepositPeriod(proposalState.depositPeriod, proposalState.submitTime),
                minDeposit: proposalState.minDeposit,
                proposalDeposit: proposalState.proposalDeposit,
            })
        }
    }, [proposalState])

    return (
        <Container
            titleOn={false}
            backEvent={handleBack}>
                <ViewContainer>
                    <>
                    {titleData && <TitleSection data={titleData} />}
                    <View style={styles.divier} />
                    <ScrollView>
                        {infoData && <InfoSection data={infoData} />}
                        <View style={styles.divier} />
                        {voteData && <VotingSection data={voteData} />}
                        {(titleData && PROPOSAL_STATUS[titleData.status] !== PROPOSAL_STATUS_VOTING_PERIOD) && <Voting transactionHandler={handleTransaction}/>}
                        <View style={styles.divier} />
                        {depositData && <DepositSection data={depositData} />}
                    </ScrollView>
                    </>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    divier: {
        height: 1,
        backgroundColor: "#aaa",
        marginVertical: 10,
        marginHorizontal: 20,
    },
})

export default React.memo(ProposalScreen);