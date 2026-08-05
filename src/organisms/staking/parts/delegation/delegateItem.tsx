import React, { memo } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { convertAmount, convertDelegateAmount } from '@/util/common';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { IStakeInfo } from '@/hooks/staking/hooks';

import DataSection from '../list/dataSection';
import MonikerSection from '../list/monikerSection';

interface IProps {
    data: IStakeInfo;
    navigate: (address: string) => void;
}

const DelegateItem = ({ data, navigate }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={styles.item}>
                <MonikerSection validator={data} />
                <DataSection title="Delegated" data={`${convertDelegateAmount(data.amount)} ${_CHAIN_SYMBOL}`} />
                <DataSection title="Reward" data={`${convertAmount({ value: data.reward, point: 6 })} ${_CHAIN_SYMBOL}`} />
                <View style={styles.inlineStyle1} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingBottom: 22 },
    item: {
        paddingTop: 22,
        backgroundColor: BgColor
    }
});

export default memo(DelegateItem);
