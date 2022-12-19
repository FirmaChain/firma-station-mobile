import React, { useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { IValidatorData } from '@/hooks/staking/hooks';
import { useAppSelector } from '@/redux/hooks';
import { convertAmount } from '@/util/common';
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
import { CHAIN_SYMBOL } from '@/constants/common';

interface IProps {
    data: IValidatorData | undefined;
}

const cols = 2;
const marginHorizontal = 0;
const marginVertical = 4;
const width = Dimensions.get('window').width / cols - marginHorizontal * (cols + 1);

const PercentageBox = ({ data }: IProps) => {
    const { storage } = useAppSelector((state) => state);
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
    }, [storage.network, data]);

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
            return `${convertAmount(amount, false)} ${_CHAIN_SYMBOL}`;
        },
        [PercentageData]
    );

    return (
        <View style={[styles.container]}>
            <View style={[styles.box, { paddingHorizontal: 20, paddingVertical: 18, marginBottom: 16 }]}>
                <View style={[styles.wrapperH, { flex: 1, justifyContent: 'space-around' }]}>
                    <Text style={styles.title}>APR</Text>
                    <Text style={[styles.data, { color: DataExist ? TextColor : TextDisableColor }]}>{APR} %</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.wrapperH, { flex: 1, justifyContent: 'space-around' }]}>
                    <Text style={styles.title}>APY</Text>
                    <Text style={[styles.data, { color: DataExist ? TextColor : TextDisableColor }]}>{APY} %</Text>
                </View>
            </View>

            <View style={[styles.box, { paddingVertical: 24 }]}>
                <View style={styles.wrapBox}>
                    {PercentageData.map((grid, index) => {
                        return (
                            <View key={index} style={[styles.wrapperH, index < PercentageData.length - 1 && { paddingBottom: 34 }]}>
                                {grid.row.map((item: any, index: number) => {
                                    return (
                                        <View key={index} style={[styles.wrapperH, { flex: 1, alignItems: 'center' }]}>
                                            <View style={[styles.wrapperV, { alignItems: 'center', flex: 1 }]}>
                                                <Text style={[styles.title, { fontSize: 14, paddingBottom: 10, color: TextDarkGrayColor }]}>
                                                    {item.title}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.data,
                                                        { fontSize: 22, paddingBottom: 6, color: DataExist ? TextColor : TextDisableColor }
                                                    ]}
                                                >
                                                    {handlePercentage(item.data)}
                                                </Text>
                                                {item.amount === undefined ? null : (
                                                    <Text style={[styles.desc, { color: DataExist ? TextGrayColor : TextDisableColor }]}>
                                                        {handleAmount(item.amount)}
                                                    </Text>
                                                )}
                                            </View>
                                            {index < grid.row.length - 1 && <View style={[styles.divider, { height: 54 }]} />}
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
        fontWeight: 'normal',
        fontSize: 13,
        color: TextGrayColor
    },
    borderBox: {
        width: width,
        marginTop: marginVertical,
        marginBottom: marginVertical,
        marginLeft: marginHorizontal,
        marginRight: marginHorizontal,
        alignItems: 'center'
    }
});

export default PercentageBox;
