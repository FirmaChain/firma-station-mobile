import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { IStakingState } from '@/hooks/staking/hooks';
import { convertCurrent, makeDecimalPoint } from '@/util/common';
import { BoxColor, DisableColor, Lato, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { ForwardArrow } from '@/components/icon/icon';


interface IProps {
    stakingValues: IStakingState | null;
    handleStaking: () => void;
}

const StakingBox = ({ stakingValues, handleStaking }: IProps) => {
    const { staking } = useAppSelector((state) => state);

    const delegated = useMemo(() => {
        if (stakingValues === null) return 0;
        return convertCurrent(makeDecimalPoint(stakingValues.delegated));
    }, [stakingValues]);

    const undelegate = useMemo(() => {
        if (stakingValues === null) return 0;
        return convertCurrent(makeDecimalPoint(stakingValues.undelegate));
    }, [stakingValues]);

    const reward = useMemo(() => {
        return convertCurrent(makeDecimalPoint(staking.stakingReward));
    }, [staking.stakingReward]);

    return (

        <View style={styles.container}>
            <TouchableOpacity style={[styles.box, { paddingHorizontal: 0 }]} onPress={() => handleStaking()}>
                <View style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }]}>
                    <Text style={styles.title}>Staking</Text>
                    <ForwardArrow size={20} color={TextCatTitleColor} />
                </View>
                <View style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center', paddingTop: 18 }]}>
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, { fontSize: 14 }]}>Delegated</Text>
                        <Text style={[styles.balance, { fontSize: 18 }]}>{delegated}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, { fontSize: 14 }]}>Undelegate</Text>
                        <Text style={[styles.balance, { fontSize: 18 }]}>{undelegate}</Text>
                    </View>
                    <View style={styles.dividerV} />
                    <View style={styles.stakingWrapper}>
                        <Text style={[styles.chainName, { fontSize: 14 }]}>Reward</Text>
                        <Text style={[styles.balance, { fontSize: 18 }]}>{reward}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
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
    },
});

export default StakingBox;