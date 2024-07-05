import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BgColor, DarkGrayColor, DisableColor, GrayColor, Lato, TextGrayColor, WhiteColor } from '@/constants/theme';
import { DownArrow, ForwardArrow } from '../icon/icon';
import TextSkeleton from './textSkeleton';
import CircleSkeleton from './circleSkeleton';

interface IProps {
    visible: boolean;
}

const StakingSkeleton = ({ visible }: IProps) => {
    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.tabBox}>
                <View style={[styles.tab, { borderBottomColor: WhiteColor }]}></View>
                <View style={[styles.tab, { borderBottomColor: 'transparent' }]}></View>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1 }}>
                        <Text style={styles.title}>List</Text>
                        <View style={{ width: 30 }}>
                            <TextSkeleton height={18} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.sortButton}>
                            <View style={{ width: 50, paddingHorizontal: 4 }}>
                                <TextSkeleton height={18} />
                            </View>
                            <DownArrow size={12} color={GrayColor} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.item}>
                <View style={styles.wrapperHorizontal}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 2, paddingRight: 20 }}>
                        <CircleSkeleton size={32} marginBottom={0} />
                        <View style={{ width: '90%', paddingLeft: 10 }}>
                            <TextSkeleton height={20} />
                        </View>
                    </View>
                    <ForwardArrow size={24} color={DarkGrayColor} />
                </View>
                <View style={[styles.wrapperHorizontal, { paddingTop: 12, width: '100%' }]}>
                    <View style={{ width: 100 }}>
                        <TextSkeleton height={18} />
                    </View>
                    <View style={{ width: 120 }}>
                        <TextSkeleton height={18} />
                    </View>
                </View>
                <View style={[styles.wrapperHorizontal, { paddingTop: 12, width: '100%' }]}>
                    <View style={{ width: 100 }}>
                        <TextSkeleton height={18} />
                    </View>
                    <View style={{ width: 120 }}>
                        <TextSkeleton height={18} />
                    </View>
                </View>
                <View style={{ paddingBottom: 26 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        paddingVertical: 15,
        paddingHorizontal: 20
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
