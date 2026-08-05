import { BgColor, DarkGrayColor, DisableColor, GrayColor, Lato, TextGrayColor, WhiteColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

import { DownArrow, ForwardArrow } from '../icon/icon';
import CircleSkeleton from './circleSkeleton';
import TextSkeleton from './textSkeleton';

const StakingSkeleton = () => {
    return (
        <View style={[styles.container, styles.inlineStyle1]}>
            <View style={styles.tabBox}>
                <View style={[styles.tab, styles.inlineStyle2]}></View>
                <View style={[styles.tab, styles.inlineStyle3]}></View>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <View style={styles.inlineStyle4}>
                        <Text style={styles.title}>List</Text>
                        <View style={styles.inlineStyle5}>
                            <TextSkeleton height={18} />
                        </View>
                    </View>
                    <View style={styles.inlineStyle6}>
                        <View style={styles.sortButton}>
                            <View style={styles.inlineStyle7}>
                                <TextSkeleton height={18} />
                            </View>
                            <DownArrow size={12} color={GrayColor} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.item}>
                <View style={styles.wrapperHorizontal}>
                    <View style={styles.inlineStyle8}>
                        <CircleSkeleton size={32} marginBottom={0} />
                        <View style={styles.inlineStyle9}>
                            <TextSkeleton height={20} />
                        </View>
                    </View>
                    <ForwardArrow size={24} color={DarkGrayColor} />
                </View>
                <View style={[styles.wrapperHorizontal, styles.inlineStyle10]}>
                    <View style={styles.inlineStyle11}>
                        <TextSkeleton height={18} />
                    </View>
                    <View style={styles.inlineStyle12}>
                        <TextSkeleton height={18} />
                    </View>
                </View>
                <View style={[styles.wrapperHorizontal, styles.inlineStyle13]}>
                    <View style={styles.inlineStyle14}>
                        <TextSkeleton height={18} />
                    </View>
                    <View style={styles.inlineStyle15}>
                        <TextSkeleton height={18} />
                    </View>
                </View>
                <View style={styles.inlineStyle16} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { display: 'flex' },
    inlineStyle2: { borderBottomColor: WhiteColor },
    inlineStyle3: { borderBottomColor: 'transparent' },
    inlineStyle4: { flexDirection: 'row', justifyContent: 'flex-start', flex: 1 },
    inlineStyle5: { width: 30 },
    inlineStyle6: { flexDirection: 'row', alignItems: 'center' },
    inlineStyle7: { width: 50, paddingHorizontal: 4 },
    inlineStyle8: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 2,
        paddingRight: 20
    },
    inlineStyle9: { width: '90%', paddingLeft: 10 },
    inlineStyle10: { paddingTop: 12, width: '100%' },
    inlineStyle11: { width: 100 },
    inlineStyle12: { width: 120 },
    inlineStyle13: { paddingTop: 12, width: '100%' },
    inlineStyle14: { width: 100 },
    inlineStyle15: { width: 120 },
    inlineStyle16: { paddingBottom: 26 },
    container: {
        // width: '100%',
        // overflow: 'hidden',
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // paddingVertical: 15,
        // paddingHorizontal: 20,
    },
    tabBox: {
        width: '100%',
        height: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BgColor,
        borderBottomWidth: 1,
        borderBottomColor: DisableColor,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    tab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3
    },
    contentContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        paddingBottom: 20,
        backgroundColor: BgColor
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        backgroundColor: BgColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
        paddingRight: 5
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    item: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 20,
        backgroundColor: BgColor,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    wrapperHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default StakingSkeleton;
