import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { HISTORY_NOT_EXIST } from '@/constants/common';
import { BgColor, Lato, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlatList, Linking, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { IHistoryState, useHistoryData } from '@/hooks/wallet/hooks';
import Container from '@/components/parts/containers/conatainer';

import HistoryList from './historyList';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.History>;

const History = () => {
    const { historyVolume } = useAppSelector((state) => state.storage);
    const { address: walletAddress } = useAppSelector((state) => state.wallet);

    const navigation: ScreenNavgationProps = useNavigation();
    const { historyList, handleHistoryOffset, handleHisotyPolling } = useHistoryData();

    const [isLoading, setIsLoading] = useState(true);
    const [historyRefresh, setHistoryRefresh] = useState(false);
    const [loadedHistoryList, setLoadedHistoryList] = useState<Array<IHistoryState>>([]);

    const historyHashMap = useRef(new Map<string, boolean>());

    const itemsSkeleton = useMemo(() => {
        if (historyVolume === undefined) return null;
        if (historyVolume[walletAddress] === undefined) return null;
        const length = historyVolume[walletAddress] > 15 ? 15 : historyVolume[walletAddress];
        const array = Array.from({ length: length });
        return array;
    }, [historyVolume[walletAddress]]);

    const historyOffsetHandler = (reset: boolean) => {
        if (reset) {
            handleHistoryOffset(reset);
        } else {
            if (loadedHistoryList.length >= 30) handleHistoryOffset(reset);
        }
    };

    const refreshStates = () => {
        if (handleHisotyPolling !== undefined) {
            setHistoryRefresh(true);
            handleHisotyPolling();
            setHistoryRefresh(false);
        }
    };

    const handleMoveToWeb = (uri: string) => {
        if (uri === 'history') {
            Linking.openURL(GUIDE_URI[uri]);
        } else {
            navigation.navigate(Screens.WebScreen, { uri: uri });
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    //? Fix: prevent duplicate data on refresh
    useEffect(() => {
        if (historyList !== undefined && historyList.list.length > 0) {
            if (loadedHistoryList.length === 0) {
                historyHashMap.current.clear();
                historyList.list.forEach((item) => historyHashMap.current.set(item.hash, true));
                setLoadedHistoryList(historyList.list);
            } else {
                const newItems = historyList.list.filter((item) => !historyHashMap.current.has(item.hash));
                newItems.forEach((item) => historyHashMap.current.set(item.hash, true));
                setLoadedHistoryList((prev) => [...prev, ...newItems]);
            }
        }
    }, [historyList]);

    useEffect(() => {
        if (itemsSkeleton) {
            if (itemsSkeleton.length > 0 && loadedHistoryList.length > 0) {
                setIsLoading(false);
            }

            if (itemsSkeleton.length === 0) {
                setIsLoading(false);
            }
        }
    }, [itemsSkeleton, loadedHistoryList, isLoading]);

    useEffect(() => {
        refreshStates();
    }, []);

    return (
        <Container title="History" handleGuide={() => handleMoveToWeb('history')} backEvent={handleBack}>
            <View style={[styles.listBox, { justifyContent: historyList.list.length > 0 ? 'space-between' : 'center' }]}>
                <View style={styles.container}>
                    {itemsSkeleton && (
                        <React.Fragment>
                            {itemsSkeleton.length > 0 ? (
                                <FlatList
                                    data={isLoading ? itemsSkeleton : loadedHistoryList}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            tintColor={WhiteColor}
                                            progressBackgroundColor={'transparent'}
                                            refreshing={historyRefresh}
                                            onRefresh={refreshStates}
                                        />
                                    }
                                    onEndReached={() => historyOffsetHandler(false)}
                                    onEndReachedThreshold={0.6}
                                    renderItem={({ item }) => {
                                        return <HistoryList item={item} loading={isLoading} handleExplorer={handleMoveToWeb} />;
                                    }}
                                />
                            ) : (
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={[styles.notice, { display: isLoading ? 'none' : 'flex' }]}>{HISTORY_NOT_EXIST}</Text>
                                </View>
                            )}
                        </React.Fragment>
                    )}
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingVertical: 20,
        overflow: 'hidden'
    },
    notice: {
        textAlign: 'center',
        fontFamily: Lato,
        fontSize: 18,
        color: TextDarkGrayColor,
        opacity: 0.8
    },
    listBox: {
        flex: 1,
        backgroundColor: BgColor
    }
});

export default History;
