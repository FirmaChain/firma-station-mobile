import React, { useMemo } from 'react';
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { convertCurrent, makeDecimalPoint } from '@/util/common';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IStakingState } from '@/hooks/staking/hooks';
import { ForwardArrow } from '@/components/icon/icon';

interface IProps {
    stakingValues: IStakingState | null;
    handleStaking: () => void;
}

const StakingBox = ({ stakingValues, handleStaking }: IProps) => {
    const { stakingReward: stakingRewardState } = useAppSelector((state) => state.staking);

    const delegated = useMemo(() => {
        if (stakingValues === null) return 0;
        return convertCurrent(makeDecimalPoint(stakingValues.delegated));
    }, [stakingValues]);

    const undelegate = useMemo(() => {
        if (stakingValues === null) return 0;
        return convertCurrent(makeDecimalPoint(stakingValues.undelegate));
    }, [stakingValues]);

    const reward = useMemo(() => {
        return convertCurrent(makeDecimalPoint(stakingRewardState));
    }, [stakingRewardState]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.box, styles.inlineStyle1]} onPress={() => handleStaking()}>
                <View style={[styles.wrapperH, styles.inlineStyle2]}>
                    <Text style={styles.title}>Staking</Text>
                    <ForwardArrow size={20} color={TextCatTitleColor} />
                </View>
                <View style={[styles.wrapperH, styles.inlineStyle3]}>
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, styles.inlineStyle4]}>Delegated</Text>
                        <Text style={[styles.balance, styles.inlineStyle5]}>{delegated}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, styles.inlineStyle6]}>Undelegate</Text>
                        <Text style={[styles.balance, styles.inlineStyle7]}>{undelegate}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, styles.inlineStyle8]}>Reward</Text>
                        <Text style={[styles.balance, styles.inlineStyle9]}>{reward}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingHorizontal: 0 },
    inlineStyle2: { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
    inlineStyle3: { justifyContent: 'space-between', alignItems: 'center', paddingTop: 18 },
    inlineStyle4: { fontSize: 14 },
    inlineStyle5: { fontSize: 18 },
    inlineStyle6: { fontSize: 14 },
    inlineStyle7: { fontSize: 18 },
    inlineStyle8: { fontSize: 14 },
    inlineStyle9: { fontSize: 18 },
    container: {
        height: 'auto',
        paddingHorizontal: 20,
        marginBottom: 16
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
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: 'bold',
        color: TextCatTitleColor
    },
    balance: {
        fontFamily: Lato,
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        color: TextColor
    },
    chainName: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: TextDarkGrayColor
    },
    stakingWrapper: {
        flex: 1,
        height: 51,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    dividerV: {
        width: 0.5,
        height: 50,
        backgroundColor: DisableColor
    }
});

export default StakingBox;
