import { Fragment } from 'react';
import { EXPLORER_URL } from '@/constants/common';
import { BoxColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { convertTime } from '@/util/common';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ForwardArrow } from '@/components/icon/icon';
import RectangleSkeleton from '@/components/skeleton/rectangleSkeleton';

interface IProps {
    // FIXME: Transaction records are supplied by the external GraphQL API without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any;
    loading: boolean;
    handleExplorer: (uri: string) => void;
}

const HistoryList = ({ item, loading, handleExplorer }: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { paddingHorizontal: 20, width: '100%', height: 102, marginBottom: 10 },
        inlineStyle2: { paddingHorizontal: 20 },
        inlineStyle3: { flex: 2 },
        inlineStyle4: { alignItems: 'center', paddingBottom: 15 },
        inlineStyle5: { fontSize: 10, fontWeight: 'normal' },
        inlineStyle6: { flex: 4, justifyContent: 'flex-start', alignItems: 'flex-start' },
        inlineStyle7: { flex: 1 },
        inlineStyle8: { fontSize: 14 },
        inlineStyle9: { fontSize: 14 },
        inlineStyle10: { flex: 2, paddingHorizontal: 10 },
        inlineStyle11: { fontSize: 14 },
        inlineStyle12: {
            fontSize: 14,
            paddingHorizontal: 5,
            color: item.type.tagTheme,
            backgroundColor: item.type.tagTheme + '26',
            borderRadius: 6,
            overflow: 'hidden'
        },
        inlineStyle13: { flex: 1 },
        inlineStyle14: { fontSize: 14 },
        inlineStyle15: { fontSize: 14 },
        inlineStyle16: { justifyContent: 'center' }
    } as const;

    return (
        <Fragment>
            {loading ? (
                <View style={inlineStyles1.inlineStyle1}>
                    <RectangleSkeleton width={'100%'} height={'100%'} bgColor={BoxColor} />
                </View>
            ) : (
                <TouchableOpacity
                    style={inlineStyles1.inlineStyle2}
                    onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + item.hash)}
                >
                    <View style={styles.box}>
                        <View style={styles.wrapperH}>
                            <View style={inlineStyles1.inlineStyle3}>
                                <View style={[styles.wrapperH, inlineStyles1.inlineStyle4]}>
                                    <Text style={[styles.contentTitle, inlineStyles1.inlineStyle5]}>
                                        {convertTime(item.timestamp, true, false)}
                                    </Text>
                                </View>
                                <View style={[styles.wrapperH, styles.wrapper, inlineStyles1.inlineStyle6]}>
                                    <View style={[styles.historyWrapper, inlineStyles1.inlineStyle7]}>
                                        <Text style={[styles.contentTitle, inlineStyles1.inlineStyle8]}>Block</Text>
                                        <Text style={[styles.contentItem, inlineStyles1.inlineStyle9]}>{item.block}</Text>
                                    </View>
                                    <View style={[styles.historyWrapper, inlineStyles1.inlineStyle10]}>
                                        <Text style={[styles.contentTitle, inlineStyles1.inlineStyle11]}>Type</Text>
                                        <Text style={[styles.contentItem, inlineStyles1.inlineStyle12]}>{item.type.tagDisplay}</Text>
                                    </View>
                                    <View style={[styles.historyWrapper, inlineStyles1.inlineStyle13]}>
                                        <Text style={[styles.contentTitle, inlineStyles1.inlineStyle14]}>Result</Text>
                                        <Text style={[styles.contentItem, inlineStyles1.inlineStyle15]}>{item.success}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={inlineStyles1.inlineStyle16}>
                                <ForwardArrow size={20} color={TextCatTitleColor} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        </Fragment>
    );
};

const styles = StyleSheet.create({
    historyWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    box: {
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10
    },
    wrapperH: {
        flexDirection: 'row'
    },
    wrapper: {
        paddingBottom: 5
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
        fontWeight: 'bold',
        color: TextDarkGrayColor
    }
});

export default HistoryList;
