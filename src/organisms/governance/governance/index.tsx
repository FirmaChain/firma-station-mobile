import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions } from '@/redux/actions';
import { IProposalItemState, useGovernanceList } from '@/hooks/governance/hooks';
import { BgColor } from '@/constants/theme';
import RefreshScrollView from '@/components/parts/refreshScrollView';
import ProposalList from './proposalList';
import { wait } from '@/util/common';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

const Governance = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { common, storage } = useAppSelector((state) => state);

    const { governanceState, handleGovernanceListPolling } = useGovernanceList();

    const [proposalList, setProposalList] = useState<Array<IProposalItemState>>([]);

    const proposalVolumes = useMemo(() => {
        if (storage.contentVolume?.proposals === undefined) return 0;
        return storage.contentVolume.proposals;
    }, [storage.contentVolume]);

    const handleMoveToDetail = (proposalId: number) => {
        navigation.navigate(Screens.Proposal, { proposalId: proposalId });
    };

    const refreshStates = async () => {
        try {
            await handleGovernanceListPolling();
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    };

    useEffect(() => {
        if (governanceState.list.length >= proposalVolumes) {
            wait(800).then(() => {
                setProposalList(governanceState.list);
            });
        }
    }, [proposalVolumes, governanceState]);

    useEffect(() => {
        if (common.dataLoadStatus > 0) {
            let count = 0;
            let intervalId = setInterval(() => {
                if (common.dataLoadStatus > 0 && common.dataLoadStatus < 2) {
                    count = count + 1;
                } else {
                    clearInterval(intervalId);
                }
                if (count >= 6) {
                    count = 0;
                    refreshStates();
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [common.dataLoadStatus]);

    useEffect(() => {
        if (isFocused && common.isNetworkChanged === false) {
            refreshStates();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            {common.connect && common.isNetworkChanged === false && (
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
