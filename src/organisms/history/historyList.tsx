import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ForwardArrow } from '@/components/icon/icon';
import { BoxColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { convertTime } from '@/util/common';
import { EXPLORER_URL } from '@/constants/common';

interface IProps {
    item: any;
    handleExplorer: (uri: string) => void;
}

const HistoryList = ({ item, handleExplorer }: IProps) => {
    return (
        <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + item.hash)}>
            <View style={styles.box}>
                <View style={styles.wrapperH}>
                    <View style={{ flex: 2 }}>
                        <View style={[styles.wrapperH, { alignItems: 'center', paddingBottom: 15 }]}>
                            <Text style={[styles.contentTitle, { fontSize: 10, fontWeight: 'normal' }]}>
                                {convertTime(item.timestamp, true, false)}
                            </Text>
                        </View>
                        <View
                            style={[styles.wrapperH, styles.wrapper, { flex: 4, justifyContent: 'flex-start', alignItems: 'flex-start' }]}
                        >
                            <View style={[styles.historyWrapper, { flex: 1 }]}>
                                <Text style={[styles.contentTitle, { fontSize: 14 }]}>Block</Text>
                                <Text style={[styles.contentItem, { fontSize: 14 }]}>{item.block}</Text>
                            </View>
                            <View style={[styles.historyWrapper, { flex: 2, paddingHorizontal: 10 }]}>
                                <Text style={[styles.contentTitle, { fontSize: 14 }]}>Type</Text>
                                <Text
                                    style={[
                                        styles.contentItem,
                                        {
                                            fontSize: 14,
                                            paddingHorizontal: 5,
                                            color: item.type.tagTheme,
                                            backgroundColor: item.type.tagTheme + '26',
                                            borderRadius: 6,
                                            overflow: 'hidden'
                                        }
                                    ]}
                                >
                                    {item.type.tagDisplay}
                                </Text>
                            </View>
                            <View style={[styles.historyWrapper, { flex: 1 }]}>
                                <Text style={[styles.contentTitle, { fontSize: 14 }]}>Result</Text>
                                <Text style={[styles.contentItem, { fontSize: 14 }]}>{item.success}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <ForwardArrow size={20} color={TextCatTitleColor} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
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
