import React, { useEffect, useMemo, useRef } from 'react';
import { EXPLORER_URL, HISTORY_NOT_EXIST } from '@/constants/common';
import { BoxColor, Lato, TextAddressColor, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { fadeIn } from '@/util/animation';
import { convertTime, getGMT } from '@/util/common';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ForwardArrow } from '@/components/icon/icon';
import RecentHistorySkeleton from '@/components/skeleton/recentHistorySkeleton';

interface IProps {
    // FIXME: Transaction history is supplied by the external GraphQL API without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentHistory: any;
    historyVolume: number | null;
    handleHistory: () => void;
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
        handleHistory();
    };

    useEffect(() => {
        if (recentHistory !== undefined) {
            fadeIn(Animated, fadeAnimHiostory, 500);
        }
    }, [recentHistory]);

    const inlineStyles1 = {
        inlineStyle1: { justifyContent: 'space-between', alignItems: 'center' },
        inlineStyle2: { justifyContent: 'center', alignItems: 'center', paddingTop: 18 },
        inlineStyle3: { fontSize: 14 },
        inlineStyle4: { opacity: fadeAnimHiostory },
        inlineStyle5: {
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingTop: 18,
            flex: 3
        },
        inlineStyle6: { flex: 1 },
        inlineStyle7: { fontSize: 14 },
        inlineStyle8: { fontSize: 14 },
        inlineStyle9: { flex: 1.5 },
        inlineStyle10: { fontSize: 14 },
        inlineStyle11: {
            fontSize: 14,
            paddingHorizontal: 5,
            color: historyData.type.tagTheme,
            backgroundColor: historyData.type.tagTheme + '26',
            borderRadius: 6,
            overflow: 'hidden'
        },
        inlineStyle12: { justifyContent: 'flex-start', alignItems: 'flex-start', flex: 3 },
        inlineStyle13: { flex: 1 },
        inlineStyle14: { fontSize: 14 },
        inlineStyle15: { fontSize: 14 },
        inlineStyle16: { flex: 1.5 },
        inlineStyle17: { fontSize: 14 },
        inlineStyle18: { fontSize: 14 },
        inlineStyle19: { paddingBottom: 0 },
        inlineStyle20: { fontSize: 14 },
        inlineStyle21: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        inlineStyle22: { fontSize: 14, flex: 1, color: TextAddressColor }
    } as const;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.box} onPress={() => moveToHistory()}>
                <View style={[styles.wrapperH, inlineStyles1.inlineStyle1]}>
                    <Text style={styles.title}>Recent History</Text>
                    {recentHistory !== undefined && <ForwardArrow size={20} color={TextCatTitleColor} />}
                </View>
                {historyVolume !== null ? (
                    historyVolume === 0 ? (
                        <View style={[styles.wrapperH, styles.wrapper, inlineStyles1.inlineStyle2]}>
                            <Text style={[styles.contentItem, inlineStyles1.inlineStyle3]}>{HISTORY_NOT_EXIST}</Text>
                        </View>
                    ) : recentHistory !== undefined ? (
                        <Animated.View style={inlineStyles1.inlineStyle4}>
                            <View style={[styles.wrapperH, styles.wrapper, inlineStyles1.inlineStyle5]}>
                                <View style={[styles.historyWrapper, inlineStyles1.inlineStyle6]}>
                                    <Text style={[styles.contentTitle, inlineStyles1.inlineStyle7]}>Block</Text>
                                    <Text style={[styles.contentItem, inlineStyles1.inlineStyle8]}>{historyData.block}</Text>
                                </View>
                                <View style={[styles.historyWrapper, inlineStyles1.inlineStyle9]}>
                                    <Text style={[styles.contentTitle, inlineStyles1.inlineStyle10]}>Type</Text>
                                    <Text style={[styles.contentItem, inlineStyles1.inlineStyle11]}>{historyData.type.tagDisplay}</Text>
                                </View>
                            </View>
                            <View style={[styles.wrapperH, styles.wrapper, inlineStyles1.inlineStyle12]}>
                                <View style={[styles.historyWrapper, inlineStyles1.inlineStyle13]}>
                                    <Text style={[styles.contentTitle, inlineStyles1.inlineStyle14]}>Result</Text>
                                    <Text style={[styles.contentItem, inlineStyles1.inlineStyle15]}>{historyData.success}</Text>
                                </View>
                                <View style={[styles.historyWrapper, inlineStyles1.inlineStyle16]}>
                                    <Text style={[styles.contentTitle, inlineStyles1.inlineStyle17]}>{'Time (' + getGMT() + ')'}</Text>
                                    <Text style={[styles.contentItem, inlineStyles1.inlineStyle18]}>
                                        {convertTime(historyData.timestamp, false, true)}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + historyData.hash)}>
                                <View style={[styles.wrapper, inlineStyles1.inlineStyle19]}>
                                    <View style={styles.historyWrapper}>
                                        <Text style={[styles.contentTitle, inlineStyles1.inlineStyle20]}>Hash</Text>
                                        <View style={inlineStyles1.inlineStyle21}>
                                            <Text
                                                style={[styles.contentItem, inlineStyles1.inlineStyle22]}
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
        fontWeight: '700',
        color: TextCatTitleColor
    },
    contentItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '400',
        color: TextColor,
        marginTop: 6,
        paddingVertical: 5
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '400',
        color: TextDarkGrayColor
    }
});

export default HistoryBox;
