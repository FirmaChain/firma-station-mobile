import React, { Fragment, useEffect, useMemo } from 'react';
import { Linking } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions } from '@/redux/actions';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useProposalData } from '@/hooks/governance/hooks';
import { DATA_RELOAD_INTERVAL, EXPLORER_URL, PROPOSAL_STATUS_VOTING_PERIOD, TRANSACTION_TYPE } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { GUIDE_URI } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import RefreshScrollView from '@/components/parts/refreshScrollView';
import DescriptionSection from './descriptionSection';
import TitleSection from './titleSection';
import VotingSection from './votingSection';
import Voting from './voting';
import { useInterval } from '@/hooks/common/hooks';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Proposal>;

interface IProps {
    proposalId: number;
}

const Proposal = ({ proposalId }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { wallet, common } = useAppSelector(state => state);
    const { proposalState, handleProposalPolling } = useProposalData();

    const proposalStates = useMemo(() => {
        return proposalState;
    }, [proposalState]);

    const isVotingPeriod = useMemo(() => {
        if (proposalStates) {
            return proposalStates.titleState.status === PROPOSAL_STATUS_VOTING_PERIOD;
        }
        return false;
    }, [proposalStates]);

    const handleMoveToExplorer = () => {
        navigation.navigate(Screens.WebScreen, { uri: EXPLORER_URL() + '/proposals/' + proposalId });
    };

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["governance"]});
        Linking.openURL(GUIDE_URI['governance']);
    };

    const handleVoting = (password: string, gas: number, votingOpt: number) => {
        const transactionState = {
            type: TRANSACTION_TYPE['VOTING'],
            password: password,
            address: wallet.address,
            proposalId: proposalId,
            votingOpt: votingOpt,
            gas: gas,
        };
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const refreshStates = async () => {
        try {
            await handleProposalPolling(proposalId);
            CommonActions.handleDataLoadStatus(0);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    };

    useInterval(
        () => {
            refreshStates();
        },
        common.dataLoadStatus > 0 ? DATA_RELOAD_INTERVAL : null,
        true
    );

    useEffect(() => {
        if (isFocused) {
            refreshStates();
        }
    }, [isFocused]);

    return (
        <Container title="Proposal" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <Fragment>
                    <RefreshScrollView refreshFunc={refreshStates}>
                        <Fragment>
                            {proposalStates && <TitleSection data={proposalStates.titleState} />}
                            {proposalStates && (
                                <DescriptionSection data={proposalStates.descState} handleMoveToExplorer={handleMoveToExplorer} />
                            )}
                            {proposalStates && <VotingSection data={proposalStates.voteState} isVotingPeriod={isVotingPeriod} />}
                        </Fragment>
                    </RefreshScrollView>
                    {proposalStates && <Voting isVotingPeriod={isVotingPeriod} proposalId={proposalId} transactionHandler={handleVoting} />}
                </Fragment>
            </ViewContainer>
        </Container>
    );
};

export default Proposal;
