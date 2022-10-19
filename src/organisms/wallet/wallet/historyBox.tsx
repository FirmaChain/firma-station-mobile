import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BoxColor, Lato, TextAddressColor, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { ForwardArrow } from '@/components/icon/icon';
import { convertTime, getGMT } from '@/util/common';
import { EXPLORER_URL, HISTORY_NOT_EXIST } from '@/constants/common';
import RecentHistorySkeleton from '@/components/skeleton/recentHistorySkeleton';
import { fadeIn } from '@/util/animation';

interface IProps {
    recentHistory: any;
    historyVolume: number | null;
    handleHistory: Function;
    handleExplorer: (uri: string) => void;
}

const HistoryBox = ({ recentHistory, historyVolume, handleHistory, handleExplorer }: IProps) => {
    const fadeAnimHiostory = useRef(new Animated.Value(0)).current;

    const historyData = useMemo(() => {
        if (recentHistory !== undefined) return recentHistory;
        return {
            hash: '',
            success: '',
            type: '',
            block: 0
        };
    }, [recentHistory]);

    const moveToHistory = () => {
        if (recentHistory === undefined) return;
        handleHistory && handleHistory();
    };

    useEffect(() => {
        if (recentHistory !== undefined) {
            fadeIn(Animated, fadeAnimHiostory, 500);
        }
    }, [recentHistory]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.box} onPress={() => moveToHistory()}>
                <View style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <Text style={styles.title}>Recent History</Text>
                    {recentHistory !== undefined && <ForwardArrow size={20} color={TextCatTitleColor} />}
                </View>
                {historyVolume !== null ? (
                    historyVolume === 0 ? (
                        <View style={[styles.wrapperH, styles.wrapper, { justifyContent: 'center', alignItems: 'center', paddingTop: 18 }]}>
                            <Text style={[styles.contentItem, { fontSize: 14 }]}>{HISTORY_NOT_EXIST}</Text>
                        </View>
                    ) : recentHistory !== undefined ? (
                        <Animated.View style={{ opacity: fadeAnimHiostory }}>
                            <View
                                style={[
                                    styles.wrapperH,
                                    styles.wrapper,
                                    { justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 18, flex: 3 }
                                ]}
                            >
                                <View style={[styles.historyWrapper, { flex: 1 }]}>
                                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>Block</Text>
                                    <Text style={[styles.contentItem, { fontSize: 14 }]}>{historyData.block}</Text>
                                </View>
                                <View style={[styles.historyWrapper, { flex: 1.5 }]}>
                                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>Type</Text>
                                    <Text
                                        style={[
                                            styles.contentItem,
                                            {
                                                fontSize: 14,
                                                paddingHorizontal: 5,
                                                color: historyData.type.tagTheme,
                                                backgroundColor: historyData.type.tagTheme + '26',
                                                borderRadius: 6,
                                                overflow: 'hidden'
                                            }
                                        ]}
                                    >
                                        {historyData.type.tagDisplay}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.wrapperH,
                                    styles.wrapper,
                                    { justifyContent: 'flex-start', alignItems: 'flex-start', flex: 3 }
                                ]}
                            >
                                <View style={[styles.historyWrapper, { flex: 1 }]}>
                                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>Result</Text>
                                    <Text style={[styles.contentItem, { fontSize: 14 }]}>{historyData.success}</Text>
                                </View>
                                <View style={[styles.historyWrapper, { flex: 1.5 }]}>
                                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>{'Time (' + getGMT() + ')'}</Text>
                                    <Text style={[styles.contentItem, { fontSize: 14 }]}>
                                        {convertTime(historyData.timestamp, false, true)}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + historyData.hash)}>
                                <View style={[styles.wrapper, { paddingBottom: 0 }]}>
                                    <View style={[styles.historyWrapper]}>
                                        <Text style={[styles.contentTitle, { fontSize: 14 }]}>Hash</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text
                                                style={[styles.contentItem, { fontSize: 14, flex: 1, color: TextAddressColor }]}
                                                numberOfLines={1}
                                                ellipsizeMode="middle"
                                            >
                                                {historyData.hash}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <RecentHistorySkeleton />
                    )
                ) : (
                    <RecentHistorySkeleton />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    historyWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    box: {
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30
    },
    wrapperH: {
        flexDirection: 'row'
    },
    wrapper: {
        paddingBottom: 20
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: 'bold',
        color: TextCatTitleColor
    },
    contentItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'normal',
        color: TextColor,
        marginTop: 6,
        paddingVertical: 5
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'normal',
        color: TextDarkGrayColor
    }
});

export default HistoryBox;
