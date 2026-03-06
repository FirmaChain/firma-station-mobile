import React, { useEffect, useMemo, useState } from 'react';
import { DATA_RELOAD_INTERVAL } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';

import { useInterval } from '@/hooks/common/hooks';
import { IProposalItemState, useGovernanceList } from '@/hooks/governance/hooks';
import RefreshScrollView from '@/components/parts/refreshScrollView';

import ProposalList from './proposalList';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

const Governance = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { dataLoadStatus, isNetworkChanged, connect } = useAppSelector((state) => state.common);
    const { contentVolume } = useAppSelector((state) => state.storage);

    const { governanceState, handleGovernanceListPolling } = useGovernanceList();

    const [proposalList, setProposalList] = useState<Array<IProposalItemState>>([]);

    const proposalVolumes = useMemo(() => {
        if (contentVolume?.proposals === undefined) return null;
        return contentVolume.proposals;
    }, [contentVolume]);

    const handleMoveToDetail = (proposalId: number) => {
        navigation.navigate(Screens.Proposal, { proposalId: proposalId });
    };

    const refreshStates = async () => {
        try {
            await handleGovernanceListPolling();
        } catch (error) {
            CommonActions.handleDataLoadStatus(dataLoadStatus + 1);
            console.log(error);
        }
    };

    useEffect(() => {
        if (proposalVolumes) {
            if (governanceState.list.length >= proposalVolumes) {
                wait(800).then(() => {
                    setProposalList(governanceState.list);
                });
            }
        }
    }, [proposalVolumes, governanceState]);

    useInterval(
        () => {
            refreshStates();
        },
        dataLoadStatus > 0 ? DATA_RELOAD_INTERVAL : null,
        true
    );

    useEffect(() => {
        if (isFocused && isNetworkChanged === false) {
            refreshStates();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            {connect && isNetworkChanged === false && (
                <View style={styles.listBox}>
                    <RefreshScrollView refreshFunc={refreshStates}>
                        <ProposalList volumes={proposalVolumes} proposals={proposalList} handleDetail={handleMoveToDetail} />
                    </RefreshScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor
    },
    listBox: {
        flex: 1,
        justifyContent: 'center'
    }
});

export default Governance;
