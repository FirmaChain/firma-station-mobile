import { Fragment } from 'react';
import { BoxColor, DividerColor, Lato, TextDarkGrayColor } from '@/constants/theme';
import { getGMT } from '@/util/common';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { StyleSheet, Text, View } from 'react-native';

const RecentHistorySkeleton = () => {
    const skeleton = () => {
        return (
            <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={BoxColor} style={styles.inlineStyle1}>
                <Rect x="0" y="0" rx="4" ry="4" width="100%" height={14} />
            </ContentLoader>
        );
    };

    return (
        <Fragment>
            <View style={[styles.wrapperH, styles.wrapper, styles.inlineStyle2]}>
                <View style={[styles.historyWrapper, styles.inlineStyle3]}>
                    <Text style={[styles.contentTitle, styles.inlineStyle4]}>Block</Text>
                    {skeleton()}
                </View>
                <View style={[styles.historyWrapper, styles.inlineStyle5]}>
                    <Text style={[styles.contentTitle, styles.inlineStyle6]}>Type</Text>
                    {skeleton()}
                </View>
            </View>
            <View style={[styles.wrapperH, styles.wrapper, styles.inlineStyle7]}>
                <View style={[styles.historyWrapper, styles.inlineStyle8]}>
                    <Text style={[styles.contentTitle, styles.inlineStyle9]}>Result</Text>

                    {skeleton()}
                </View>
                <View style={[styles.historyWrapper, styles.inlineStyle10]}>
                    <Text style={[styles.contentTitle, styles.inlineStyle11]}>{'Time (' + getGMT() + ')'}</Text>
                    {skeleton()}
                </View>
            </View>

            <View style={[styles.wrapper, styles.inlineStyle12]}>
                <View style={styles.historyWrapper}>
                    <Text style={[styles.contentTitle, styles.inlineStyle13]}>Hash</Text>
                    {skeleton()}
                </View>
            </View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { marginTop: 6, paddingVertical: 5 },
    inlineStyle2: { justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 18, flex: 3 },
    inlineStyle3: { flex: 1 },
    inlineStyle4: { fontSize: 14 },
    inlineStyle5: { flex: 1.5 },
    inlineStyle6: { fontSize: 14 },
    inlineStyle7: { justifyContent: 'flex-start', alignItems: 'flex-start', flex: 3 },
    inlineStyle8: { flex: 1 },
    inlineStyle9: { fontSize: 14 },
    inlineStyle10: { flex: 1.5 },
    inlineStyle11: { fontSize: 14 },
    inlineStyle12: { paddingBottom: 0 },
    inlineStyle13: { fontSize: 14 },
    historyWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    wrapperH: {
        flexDirection: 'row'
    },
    wrapper: {
        paddingBottom: 20
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '400',
        color: TextDarkGrayColor
    }
});

export default RecentHistorySkeleton;
