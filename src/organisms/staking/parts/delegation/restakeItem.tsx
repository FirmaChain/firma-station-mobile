import React, { memo, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { convertAmount, convertDelegateAmount } from '@/util/common';
import { BgColor, TextColor, TextDisableColor } from '@/constants/theme';
import { RESTAKE_STATUS } from '@/constants/common';
import DataSection from '../list/dataSection';
import MonikerSection from '../list/monikerSection';

interface IProps {
    data: any;
    navigate: (address: string) => void;
}

const RestakeItem = ({ data, navigate }: IProps) => {
    const status = useMemo(() => {
        if (data.delegated === 0) {
            return RESTAKE_STATUS['NO_DELEGATION'];
        } else {
            if (data.isActive) {
                return RESTAKE_STATUS['ACTIVE'];
            } else {
                return RESTAKE_STATUS['INACTIVE'];
            }
        }
    }, [data]);

    const latestRestake = useMemo(() => {
        if (data.latestReward === 0)
            return {
                color: TextColor + '65',
                value: 'Not yet'
            };
        return { color: TextDisableColor, value: convertAmount(data.latestReward, true, 6) + ' FCT' };
    }, [data]);

    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item]}>
                <MonikerSection validator={data} />
                <DataSection title="Delegated" data={convertDelegateAmount(data.delegated) + ' FCT'} />
                <DataSection title="Reward" data={convertAmount(data.stakingReward, true, 6) + ' FCT'} />
                <DataSection title="Latest Restake" color={latestRestake.color} data={latestRestake.value} />
                <DataSection title="Grant Status" data={status.title} color={status.color} label={true} />
                <View style={{ paddingBottom: 22 }} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingTop: 22,
        backgroundColor: BgColor
    }
});

export default memo(RestakeItem);
