import { CHAIN_NETWORK } from '@/../config';
import { EXPLORER_URL } from '@/constants/common';
import { FIRMA_LOGO } from '@/constants/images';
import { Lato, PointLightColor, TextAddressColor, TextCatTitleColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { convertTime } from '@/util/common';
import React, { useEffect, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    data: any;
    handleExplorer: (url: string) => void;
}

const InfoBox = ({ data, handleExplorer }: IProps) => {
    const { storage } = useAppSelector((state) => state);

    const chainID = useMemo(() => {
        return `(${CHAIN_NETWORK[storage.network].FIRMACHAIN_CONFIG.chainID})`;
    }, []);

    return (
        <View>
            <View style={styles.box}>
                <Text style={styles.title}>Chain</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 4, paddingLeft: 2 }}>
                    <Image source={FIRMA_LOGO} style={{ width: 15, height: 15, borderRadius: 50, marginRight: 3 }} />
                    <Text style={[styles.value, { flex: 0 }]}>
                        {'FIRMACHAIN '}
                        <Text style={[styles.value, { flex: 0, fontSize: 14, color: TextDarkGrayColor }]}>{chainID}</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>No.</Text>
                <Text style={styles.value}>{data.id}</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Time</Text>
                <Text style={styles.value}>{convertTime(data.timestamp, true)}</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>From</Text>
                <TouchableOpacity style={[{ flex: 4 }]} onPress={() => handleExplorer(EXPLORER_URL() + '/accounts/' + data.from)}>
                    <Text style={[styles.value, { color: TextAddressColor }]} numberOfLines={1} ellipsizeMode={'middle'}>
                        {data.from}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Hash</Text>
                <TouchableOpacity style={[{ flex: 4 }]} onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + data.hash)}>
                    <Text style={[styles.value, { color: TextAddressColor }]} numberOfLines={1} ellipsizeMode={'middle'}>
                        {data.hash}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    title: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextDarkGrayColor
    },
    value: {
        flex: 4,
        paddingLeft: 2,
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        textAlign: 'left'
    },
    linkWrapper: {
        backgroundColor: TextAddressColor + '20',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4
    }
});

export default InfoBox;
