import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { convertAmount, convertDelegateAmount } from '@/util/common';
import { IStakeInfo } from '@/hooks/staking/hooks';
import { BgColor } from '@/constants/theme';
import DataSection from '../list/dataSection';
import MonikerSection from '../list/monikerSection';
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    data: IStakeInfo;
    navigate: (address: string) => void;
}

const DelegateItem = ({ data, navigate }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item]}>
                <MonikerSection validator={data} />
                <DataSection title="Delegated" data={`${convertDelegateAmount(data.amount)} ${_CHAIN_SYMBOL}`} />
                <DataSection title="Reward" data={`${convertAmount({ value: data.reward, point: 6 })} ${_CHAIN_SYMBOL}`} />
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
