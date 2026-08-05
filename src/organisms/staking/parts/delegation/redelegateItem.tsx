import React, { memo } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { convertAmount, convertTime } from '@/util/common';
import { StyleSheet, View } from 'react-native';

import { IRedelegationInfo } from '@/hooks/staking/hooks';

import DataSection from '../list/dataSection';
import MonikerSectionForRedelegate from '../list/monikerSectionForRedelegate';

interface IProps {
    data: IRedelegationInfo;
    navigate: (address: string) => void;
}

const RedelegateItem = ({ data, navigate }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    return (
        <View style={styles.item}>
            <MonikerSectionForRedelegate validators={data} navigateValidator={navigate} />
            <DataSection title="Amount" data={`${convertAmount({ value: data.balance })} ${_CHAIN_SYMBOL}`} />
            <DataSection title="Linked Until" data={convertTime(data.completionTime, true)} />
            <View style={styles.inlineStyle1} />
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingBottom: 22 },
    item: {
        paddingTop: 22,
        backgroundColor: BgColor
    }
});

export default memo(RedelegateItem);
