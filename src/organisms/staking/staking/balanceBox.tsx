import React, { useMemo } from 'react';
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor } from '@/constants/theme';
import { convertAmount, convertNumber, resizeFontSize } from '@/util/common';
import { FirmaUtil } from '@firmachain/firma-js';
import { StyleSheet, Text, View } from 'react-native';

import { IStakingState } from '@/hooks/staking/hooks';

interface IProps {
    stakingValues: IStakingState | null;
}

const BalanceBox = ({ stakingValues }: IProps) => {
    const available = useMemo(() => {
        if (stakingValues === null) return 0;
        return stakingValues.available;
    }, [stakingValues]);

    const delegated = useMemo(() => {
        if (stakingValues === null) return 0;
        return stakingValues.delegated;
    }, [stakingValues]);

    const undelegate = useMemo(() => {
        if (stakingValues === null) return 0;
        return stakingValues.undelegate;
    }, [stakingValues]);

    const StakingValues = [
        { title: 'Available', data: available, ufct: true },
        { title: 'Delegated', data: delegated, ufct: false },
        { title: 'Undelegated', data: undelegate, ufct: false }
    ];

    return (
        <View style={styles.container}>
            <View style={[styles.box, styles.inlineStyle1]}>
                {StakingValues.map((item, index) => {
                    const originSize = 18;
                    const resize = resizeFontSize(
                        item.ufct ? convertNumber(FirmaUtil.getFCTStringFromUFCT(item.data)) : item.data,
                        1000000,
                        originSize
                    );
                    const inlineStyles2 = {
                        inlineStyle1: { flex: 1 },
                        inlineStyle2: { fontSize: resize }
                    } as const;

                    return (
                        <View
                            key={index}
                            style={[styles.box, inlineStyles2.inlineStyle1, index < StakingValues.length - 1 && styles.inlineStyle2]}
                        >
                            <View key={index} style={styles.wrapper}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={[styles.desc, inlineStyles2.inlineStyle2]}>
                                    {convertAmount({ value: item.data, isUfct: item.ufct })}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { flex: 3 },
    inlineStyle2: {
        borderRightColor: DisableColor,
        borderRightWidth: 1
    },
    container: {
        paddingVertical: 20,
        backgroundColor: BoxColor,
        borderRadius: 8
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapper: {
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor,
        textAlign: 'center'
    },
    desc: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        textAlign: 'center'
    }
});

export default BalanceBox;
