import React, { Fragment, useCallback, useMemo } from 'react';
import { GUIDE_URI } from '@/../config';
import { DATA_RELOAD_INTERVAL, EXPLORER_URL, PROPOSAL_STATUS_VOTING_PERIOD, TRANSACTION_TYPE } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking } from 'react-native';

import { useRefreshPolling, type RefreshLifecycle } from '@/hooks/common/useRefreshPolling';
import { useProposalData } from '@/hooks/governance/hooks';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import RefreshScrollView from '@/components/parts/refreshScrollView';

import DescriptionSection from './descriptionSection';
import TitleSection from './titleSection';
import Voting from './voting';
import VotingSection from './votingSection';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Proposal>;

interface IProps {
    proposalId: number;
}

const Proposal = ({ proposalId }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { address: walletAddress } = useAppSelector((state) => state.wallet);
    const { appState } = useAppSelector((state) => state.common);

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
            address: walletAddress,
            proposalId: proposalId,
            votingOpt: votingOpt,
            gas: gas
        };
        navigation.navigate(Screens.Transaction, { state: transactionState });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const isPollingEligible = useCallback(() => isFocused && appState === 'active', [appState, isFocused]);

    const refreshStates = useCallback(
        async (lifecycle: RefreshLifecycle) => {
            await handleProposalPolling(proposalId, lifecycle);
        },
        [handleProposalPolling, proposalId]
    );

    const refreshNow = useRefreshPolling({
        refresh: refreshStates,
        commit: (_value, lifecycle) => {
            if (!lifecycle.isValid()) return;
        },
        isEligible: isPollingEligible,
        delay: DATA_RELOAD_INTERVAL,
        retryLimit: 3,
        onError: (error) => {
            console.error(error);
        }
    });

    return (
        <Container title="Proposal" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <Fragment>
                    <RefreshScrollView refreshFunc={refreshNow}>
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
