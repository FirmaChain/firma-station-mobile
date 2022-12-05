import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { convertAmount, convertDelegateAmount } from '@/util/common';
import { IStakeInfo } from '@/hooks/staking/hooks';
import { BgColor } from '@/constants/theme';
import DataSection from '../list/dataSection';
import MonikerSection from '../list/monikerSection';

interface IProps {
    data: IStakeInfo;
    navigate: (address: string) => void;
}

const DelegateItem = ({ data, navigate }: IProps) => {
    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item]}>
                <MonikerSection validator={data} />
                <DataSection title="Delegated" data={convertDelegateAmount(data.amount) + ' FCT'} />
                <DataSection title="Reward" data={convertAmount(data.reward, true, 6) + ' FCT'} />
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

export default memo(DelegateItem);
