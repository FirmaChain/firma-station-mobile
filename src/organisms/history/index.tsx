import React, { useEffect, useState } from 'react';
import { FlatList, Linking, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { IHistoryState, useHistoryData } from '@/hooks/wallet/hooks';
import { BgColor, Lato, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import { HISTORY_NOT_EXIST } from '@/constants/common';
import { GUIDE_URI } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import HistoryList from './historyList';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.History>;

const History = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { historyExist, historyList, handleHistoryOffset, handleHisotyPolling } = useHistoryData();

    const [isLoaded, setIsLoaded] = useState(false);
    const [historyRefresh, setHistoryRefresh] = useState(false);
    const [loadedHistoryList, setLoadedHistoryList] = useState<Array<IHistoryState>>([]);

    const historyOffsetHandler = (reset: boolean) => {
        handleHistoryOffset && handleHistoryOffset(reset);
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

    useEffect(() => {
        if (historyList !== undefined) {
            if (historyRefresh) {
                setLoadedHistoryList(historyList.list);
            } else {
                let loaded = loadedHistoryList;
                let concatList = loaded.concat(historyList.list);
                let list = concatList.filter((arr, index, callback) => index === callback.findIndex((val) => val.block === arr.block));
                setLoadedHistoryList(list);
            }
        }
    }, [historyList, historyRefresh]);

    useEffect(() => {
        if (historyExist) {
            if (isLoaded) {
                CommonActions.handleLoadingProgress(false);
            } else {
                CommonActions.handleLoadingProgress(true);
                if (loadedHistoryList.length > 0) {
                    setIsLoaded(true);
                }
            }
        }
    }, [historyExist, loadedHistoryList, isLoaded]);

    return (
        <Container title="History" handleGuide={() => handleMoveToWeb('history')} backEvent={handleBack}>
            <View style={[styles.listBox, { justifyContent: historyList.list.length > 0 ? 'space-between' : 'center' }]}>
                {loadedHistoryList && (
                    <View style={styles.container}>
                        {historyExist ? (
                            <FlatList
                                data={loadedHistoryList}
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
                                    return <HistoryList item={item} handleExplorer={handleMoveToWeb} />;
                                }}
                            />
                        ) : (
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={[styles.notice, { display: isLoaded ? 'flex' : 'none' }]}>{HISTORY_NOT_EXIST}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingVertical: 20
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
