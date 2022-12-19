import React, { memo, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { BgColor, BorderColor } from '@/constants/theme';
import { convertPercentage } from '@/util/common';
import DataSection from '../list/dataSection';
import MonikerSection from '../list/monikerSection';

interface IProps {
    data: any;
    isLastItem: boolean;
    navigate: (address: string) => void;
}

const ValidatorItem = ({ data, isLastItem, navigate }: IProps) => {
    const uptime = useMemo(() => {
        if (data.condition === '-') return '-';
        return `${data.condition.toString()}%`;
    }, [data.condition]);

    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item, isLastItem ? styles.itemBoxLast : styles.itemBox]}>
                <MonikerSection validator={{ avatarURL: data.validatorAvatar, moniker: data.validatorMoniker }} />
                <DataSection title="Voting Power" data={data.votingPowerPercent.toString() + '%'} />
                <DataSection title="Commission" data={convertPercentage(data.commission) + '%'} />
                <DataSection title="APR/APY" data={`${data.APR}% / ${data.APY}%`} />
                <DataSection title="Uptime" data={uptime} />
                <View style={{ paddingBottom: 22 }} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemBox: {
        borderBottomColor: BorderColor,
        borderBottomWidth: 0.5
    },
    itemBoxLast: {
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        overflow: 'hidden'
    },
    item: {
        paddingTop: 22,
        backgroundColor: BgColor
    }
});

export default memo(ValidatorItem);
