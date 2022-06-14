import React, { useCallback, useEffect, useMemo } from "react";
import { Linking } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useProposalData } from "@/hooks/governance/hooks";
import { PROPOSAL_STATUS_VOTING_PERIOD, TRANSACTION_TYPE } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import { GUIDE_URI } from "@/../config";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import RefreshScrollView from "@/components/parts/refreshScrollView";
import DescriptionSection from "./descriptionSection";
import TitleSection from "./titleSection";
import VotingSection from "./votingSection";
import Voting from "./voting";
import { CommonActions } from "@/redux/actions";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Proposal>;

interface Props {
    proposalId: number;
}

const Proposal = ({proposalId}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation();
    
    const {wallet, common} = useAppSelector(state => state);
    const { proposalState, handleProposalPolling } = useProposalData(proposalId);

    const isVotingPeriod = useMemo(() => {
        if(proposalState){
            return proposalState.titleState.status === PROPOSAL_STATUS_VOTING_PERIOD;
        }
        return false;
    }, [proposalState])

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["governance"]});
        Linking.openURL(GUIDE_URI["governance"]);
    }

    const handleVoting = (password:string, gas:number, votingOpt:number) => {
        const transactionState = {
            type: TRANSACTION_TYPE["VOTING"],
            password: password,
            address : wallet.address,
            proposalId: proposalId,
            votingOpt: votingOpt,
            gas: gas,
        }
        navigation.navigate(Screens.Transaction, {state: transactionState});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    const refreshStates = async() => {
        try {
            CommonActions.handleLoadingProgress(true);
            await handleProposalPolling();
            CommonActions.handleLoadingProgress(false);
            CommonActions.handleDataLoadStatus(0);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    }

    useEffect(() => {
        let count = 0;
        let intervalId = setInterval(() => {
            if(common.dataLoadStatus > 0 && common.dataLoadStatus < 2){
                count = count + 1;
            } else {
                clearInterval(intervalId);
            }
            if(count >= 6){
                count = 0;
                refreshStates();
            }
        }, 1000)

        return () => clearInterval(intervalId);
    }, [common.dataLoadStatus])

    useFocusEffect(
        useCallback(() => {
            refreshStates();
        }, [])
    )

    return (
        <Container
            title="Proposal"
            handleGuide={handleMoveToWeb}
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <>
                <RefreshScrollView
                    refreshFunc={refreshStates}>
                    <>
                    {proposalState && <TitleSection data={proposalState.titleState} />}
                    {proposalState && <DescriptionSection data={proposalState.descState} />}
                    {proposalState && <VotingSection data={proposalState.voteState} isVotingPeriod={isVotingPeriod}/>}
                    </>
                </RefreshScrollView>
                {proposalState && <Voting isVotingPeriod={isVotingPeriod} proposalId={proposalId} transactionHandler={handleVoting}/>}
                </>
            </ViewContainer>
        </Container>
    )
}

export default Proposal;

