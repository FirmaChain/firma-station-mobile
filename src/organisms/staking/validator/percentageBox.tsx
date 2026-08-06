import React, { useCallback, useMemo } from 'react';
import { CHAIN_SYMBOL } from '@/constants/common';
import {
    BoxColor,
    DividerColor,
    Lato,
    PointLightColor,
    TextColor,
    TextDarkGrayColor,
    TextDisableColor,
    TextGrayColor
} from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { convertAmount } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

import { IValidatorData } from '@/hooks/staking/hooks';

interface IProps {
    data: IValidatorData | undefined;
}

// const cols = 2;
// const marginHorizontal = 0;
// const marginVertical = 4;
// const width = Dimensions.get('window').width / cols - marginHorizontal * (cols + 1);

const PercentageBox = ({ data }: IProps) => {
    const { network } = useAppSelector((state) => state.storage);

    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    const DataExist = useMemo(() => {
        return data !== undefined;
    }, [data]);

    const PercentageData = useMemo(() => {
        if (data === undefined)
            return [
                {
                    row: [
                        {
                            title: 'Voting Power',
                            data: 0,
                            amount: 0
                        },
                        {
                            title: 'Self-Delegation',
                            data: 0,
                            amount: 0
                        }
                    ]
                },
                {
                    row: [
                        {
                            title: 'Commission',
                            data: 0
                        },
                        {
                            title: 'Uptime',
                            data: 0
                        }
                    ]
                }
            ];
        return data.state;
    }, [network, data]);

    const APR = useMemo(() => {
        if (data === undefined) return 0;
        return data.APR;
    }, [data]);

    const APY = useMemo(() => {
        if (data === undefined) return 0;
        return data.APY;
    }, [data]);

    const handlePercentage = useCallback(
        (data: string | number) => {
            if (data === '-') return '-';
            return `${data}%`;
        },
        [PercentageData]
    );

    const handleAmount = useCallback(
        (amount: string | number) => {
            return `${convertAmount({ value: amount, isUfct: false })} ${_CHAIN_SYMBOL}`;
        },
        [PercentageData]
    );

    const inlineStyles1 = {
        inlineStyle1: { paddingHorizontal: 20, paddingVertical: 18, marginBottom: 16 },
        inlineStyle2: { flex: 1, justifyContent: 'space-around' },
        inlineStyle3: { color: DataExist ? TextColor : TextDisableColor },
        inlineStyle4: { flex: 1, justifyContent: 'space-around' },
        inlineStyle5: { color: DataExist ? TextColor : TextDisableColor },
        inlineStyle6: { paddingVertical: 24 }
    } as const;

    return (
        <View style={styles.container}>
            <View style={[styles.box, inlineStyles1.inlineStyle1]}>
                <View style={[styles.wrapperH, inlineStyles1.inlineStyle2]}>
                    <Text style={styles.title}>APR</Text>
                    <Text style={[styles.data, inlineStyles1.inlineStyle3]}>{APR} %</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.wrapperH, inlineStyles1.inlineStyle4]}>
                    <Text style={styles.title}>APY</Text>
                    <Text style={[styles.data, inlineStyles1.inlineStyle5]}>{APY} %</Text>
                </View>
            </View>

            <View style={[styles.box, inlineStyles1.inlineStyle6]}>
                <View style={styles.wrapBox}>
                    {PercentageData.map((grid, index) => {
                        return (
                            <View key={index} style={[styles.wrapperH, index < PercentageData.length - 1 && styles.inlineStyle1]}>
                                {grid.row.map((item, index: number) => {
                                    const inlineStyles2 = {
                                        inlineStyle1: { flex: 1, alignItems: 'center' },
                                        inlineStyle2: { alignItems: 'center', flex: 1 },
                                        inlineStyle3: { fontSize: 14, paddingBottom: 10, color: TextDarkGrayColor },
                                        inlineStyle4: {
                                            fontSize: 22,
                                            paddingBottom: 6,
                                            color: DataExist ? TextColor : TextDisableColor
                                        },
                                        inlineStyle5: { color: DataExist ? TextGrayColor : TextDisableColor },
                                        inlineStyle6: { height: 54 }
                                    } as const;

                                    return (
                                        <View key={index} style={[styles.wrapperH, inlineStyles2.inlineStyle1]}>
                                            <View style={[styles.wrapperV, inlineStyles2.inlineStyle2]}>
                                                <Text style={[styles.title, inlineStyles2.inlineStyle3]}>{item.title}</Text>
                                                <Text style={[styles.data, inlineStyles2.inlineStyle4]}>{handlePercentage(item.data)}</Text>
                                                {item.amount === undefined ? null : (
                                                    <Text style={[styles.desc, inlineStyles2.inlineStyle5]}>
                                                        {handleAmount(item.amount)}
                                                    </Text>
                                                )}
                                            </View>
                                            {index < grid.row.length - 1 && <View style={[styles.divider, inlineStyles2.inlineStyle6]} />}
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingBottom: 34 },
    container: {
        paddingHorizontal: 20,
        marginBottom: 16
    },
    box: {
        flexDirection: 'row',
        backgroundColor: BoxColor,
        borderRadius: 8
    },
    wrapBox: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapperH: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapperV: {
        alignItems: 'flex-start'
    },
    divider: {
        width: 1,
        backgroundColor: DividerColor
    },
    title: {
        fontFamily: Lato,
        fontWeight: '600',
        fontSize: 16,
        color: PointLightColor
    },
    data: {
        fontFamily: Lato,
        fontWeight: '600',
        fontSize: 18,
        color: TextColor
    },
    desc: {
        fontFamily: Lato,
        fontWeight: '400',
        fontSize: 13,
        color: TextGrayColor
    }
});

export default PercentageBox;
