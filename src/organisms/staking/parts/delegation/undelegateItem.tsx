import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { convertAmount, convertTime } from '@/util/common';
import { IUndelegationInfo } from '@/hooks/staking/hooks';
import { BgColor } from '@/constants/theme';
import { CHAIN_SYMBOL } from '@/constants/common';
import DataSection from '../list/dataSection';
import MonikerSection from '../list/monikerSection';

interface IProps {
    data: IUndelegationInfo;
    navigate: (address: string) => void;
}

const UndelegateItem = ({ data, navigate }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    return (
        <TouchableOpacity onPress={() => navigate(data.validatorAddress)}>
            <View style={[styles.item]}>
                <MonikerSection validator={data} />
                <DataSection title="Amount" data={`${convertAmount(data.balance)} ${_CHAIN_SYMBOL}`} />
                <DataSection title="Linked Until" data={convertTime(data.completionTime, true)} />
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

export default memo(UndelegateItem);
