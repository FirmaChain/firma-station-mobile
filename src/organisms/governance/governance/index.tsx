import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@/redux/hooks';
import { CommonActions } from '@/redux/actions';
import { useGovernanceList } from '@/hooks/governance/hooks';
import { BgColor } from '@/constants/theme';
import RefreshScrollView from '@/components/parts/refreshScrollView';
import ProposalList from './proposalList';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

const Governance = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();

    const { common } = useAppSelector((state) => state);

    const { governanceState, handleGovernanceListPolling } = useGovernanceList();

    const handleMoveToDetail = (proposalId: number) => {
        navigation.navigate(Screens.Proposal, { proposalId: proposalId });
    };

    const refreshStates = async () => {
        try {
            CommonActions.handleLoadingProgress(true);
            await handleGovernanceListPolling();
            CommonActions.handleLoadingProgress(false);
        } catch (error) {
            CommonActions.handleDataLoadStatus(common.dataLoadStatus + 1);
            console.log(error);
        }
    };

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
                        <ProposalList proposals={governanceState.list} handleDetail={handleMoveToDetail} />
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
