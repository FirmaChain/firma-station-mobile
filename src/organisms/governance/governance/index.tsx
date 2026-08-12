import React, { useCallback, useMemo, useState } from 'react';
import { PROPOSAL_NOT_REGISTERED } from '@/constants/common';
import { BgColor, TextDarkGrayColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useScreenRefreshPolling } from '@/hooks/common/useScreenRefreshPolling';
import { IProposalItemState, useGovernanceList } from '@/hooks/governance/hooks';
import ProposalSkeleton from '@/components/skeleton/proposalSkeleton';

import ProposalListItem from './proposalListItem';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Governance>;

const Governance = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isNetworkChanged = useAppSelector((state) => state.common.isNetworkChanged);
    const connect = useAppSelector((state) => state.common.connect);
    const contentVolume = useAppSelector((state) => state.storage.contentVolume);

    const { governanceState, handleGovernanceListPolling } = useGovernanceList();
    const [refreshing, setRefreshing] = useState(false);

    const proposalVolumes = useMemo(() => {
        if (contentVolume?.proposals === undefined) return null;
        return contentVolume.proposals;
    }, [contentVolume]);

    const handleMoveToDetail = useCallback(
        (proposalId: number) => {
            navigation.navigate(Screens.Proposal, { proposalId: proposalId });
        },
        [navigation]
    );

    const refreshNow = useScreenRefreshPolling({
        refresh: handleGovernanceListPolling
    });

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await refreshNow();
        } finally {
            setRefreshing(false);
        }
    }, [refreshNow]);

    const listData = governanceState.list;
    const isListReady = proposalVolumes !== null;
    const isEmptyState = isListReady && proposalVolumes === 0;
    const isLoadingList = isListReady && proposalVolumes > 0 && listData.length === 0;

    const keyExtractor = useCallback((item: IProposalItemState) => item.proposalId, []);
    const renderItem = useCallback(
        ({ item }: { item: IProposalItemState }) => {
            return <ProposalListItem proposal={item} handleDetail={handleMoveToDetail} />;
        },
        [handleMoveToDetail]
    );

    const renderEmptyComponent = useCallback(() => {
        if (!isListReady) return null;

        if (isEmptyState) {
            return (
                <View style={styles.emptyBox}>
                    <Text style={styles.notice}>{PROPOSAL_NOT_REGISTERED}</Text>
                </View>
            );
        }

        if (isLoadingList) {
            return <ProposalSkeleton volumes={Math.min(proposalVolumes ?? 0, 6)} />;
        }

        return null;
    }, [isEmptyState, isLoadingList, isListReady, proposalVolumes]);

    return (
        <View style={styles.container}>
            {connect && isNetworkChanged === false && isListReady && (
                <FlatList
                    data={isLoadingList ? [] : listData}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={isEmptyState ? styles.emptyContent : styles.listContent}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                    updateCellsBatchingPeriod={50}
                    windowSize={7}
                    getItemLayout={(_, index) => ({
                        length: 142,
                        offset: 142 * index,
                        index
                    })}
                    ListEmptyComponent={renderEmptyComponent()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BgColor
    },
    listContent: {
        paddingVertical: 16,
        paddingHorizontal: 20
    },
    emptyContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    emptyBox: {
        flex: 1,
        justifyContent: 'center'
    },
    notice: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        color: TextDarkGrayColor,
        opacity: 0.8
    }
});

export default Governance;
