import React, { memo } from 'react';
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
    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item, isLastItem ? styles.itemBoxLast : styles.itemBox]}>
                <MonikerSection validator={{ avatarURL: data.validatorAvatar, moniker: data.validatorMoniker }} />
                <DataSection title="Voting Power" data={data.votingPowerPercent.toString() + '%'} />
                <DataSection title="Commission" data={data.commission.toString() + '%'} />
                <DataSection title="APR/APY" data={convertPercentage(data.APR) + '% / ' + convertPercentage(data.APY) + '%'} />
                <DataSection title="Uptime" data={data.condition.toString() + '%'} />
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
