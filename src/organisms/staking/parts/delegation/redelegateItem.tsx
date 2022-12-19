import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { convertAmount, convertTime } from '@/util/common';
import { IRedelegationInfo } from '@/hooks/staking/hooks';
import { BgColor } from '@/constants/theme';
import DataSection from '../list/dataSection';
import MonikerSectionForRedelegate from '../list/monikerSectionForRedelegate';
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    data: IRedelegationInfo;
    navigate: (address: string) => void;
}

const RedelegateItem = ({ data, navigate }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();
    return (
        <View style={[styles.item]}>
            <MonikerSectionForRedelegate validators={data} navigateValidator={navigate} />
            <DataSection title="Amount" data={`${convertAmount(data.balance)} ${_CHAIN_SYMBOL}`} />
            <DataSection title="Linked Until" data={convertTime(data.completionTime, true)} />
            <View style={{ paddingBottom: 22 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingTop: 22,
        backgroundColor: BgColor
    }
});

export default memo(RedelegateItem);
