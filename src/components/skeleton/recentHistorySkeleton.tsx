import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BoxColor, DividerColor, Lato, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { getGMT } from '@/util/common';
import ContentLoader, { Rect } from 'react-content-loader/native';

const RecentHistorySkeleton = () => {
    const skeleton = () => {
        return (
            <ContentLoader
                speed={0.8}
                animate={true}
                foregroundColor={DividerColor}
                backgroundColor={BoxColor}
                style={{ marginTop: 6, paddingVertical: 5 }}
            >
                <Rect x="0" y="0" rx="4" ry="4" width="100%" height={14} />
            </ContentLoader>
        );
    };

    return (
        <React.Fragment>
            <View
                style={[
                    styles.wrapperH,
                    styles.wrapper,
                    { justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 18, flex: 3 }
                ]}
            >
                <View style={[styles.historyWrapper, { flex: 1 }]}>
                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>Block</Text>
                    {skeleton()}
                </View>
                <View style={[styles.historyWrapper, { flex: 1.5 }]}>
                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>Type</Text>
                    {skeleton()}
                </View>
            </View>
            <View style={[styles.wrapperH, styles.wrapper, { justifyContent: 'flex-start', alignItems: 'flex-start', flex: 3 }]}>
                <View style={[styles.historyWrapper, { flex: 1 }]}>
                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>Result</Text>

                    {skeleton()}
                </View>
                <View style={[styles.historyWrapper, { flex: 1.5 }]}>
                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>{'Time (' + getGMT() + ')'}</Text>
                    {skeleton()}
                </View>
            </View>

            <View style={[styles.wrapper, { paddingBottom: 0 }]}>
                <View style={[styles.historyWrapper]}>
                    <Text style={[styles.contentTitle, { fontSize: 14 }]}>Hash</Text>
                    {skeleton()}
                </View>
            </View>
        </React.Fragment>
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

export default RecentHistorySkeleton;
