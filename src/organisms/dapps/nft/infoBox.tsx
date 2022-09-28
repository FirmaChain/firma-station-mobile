import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { EXPLORER_URL } from '@/constants/common';
import { FIRMA_LOGO } from '@/constants/images';
import { Lato, TextAddressColor, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { convertTime, wait } from '@/util/common';
import { CHAIN_NETWORK } from '@/../config';
import TextSkeleton from '@/components/skeleton/textSkeleton';
import { fadeIn } from '@/util/animation';

interface IProps {
    data: any;
    handleExplorer: (url: string) => void;
}

interface IDataRenderProps {
    value: string;
    color: string;
    loading: boolean;
}

const InfoBox = ({ data, handleExplorer }: IProps) => {
    const { storage } = useAppSelector((state) => state);

    const fadeAnimText = useRef(new Animated.Value(0)).current;

    const [isLoading, setIsLoading] = useState(true);

    const chainID = useMemo(() => {
        return `(${CHAIN_NETWORK[storage.network].FIRMACHAIN_CONFIG.chainID})`;
    }, []);

    const timestamp = useMemo(() => {
        if (data.timestamp === undefined) return '';
        return convertTime(data.timestamp, true);
    }, [data.timestamp]);

    const fromAddress = useMemo(() => {
        if (data.from === undefined) return '';
        return data.from;
    }, [data.from]);

    const transactionHash = useMemo(() => {
        if (data.hash === undefined) return '';
        return data.hash;
    }, [data.hash]);

    useEffect(() => {
        if (timestamp !== '' && fromAddress !== '' && transactionHash !== '') {
            wait(1000).then(() => {
                fadeIn(Animated, fadeAnimText, 500);
                setIsLoading(false);
            });
        }
    }, [timestamp, fromAddress, transactionHash]);

    const InfoDataRender = ({ value, color, loading }: IDataRenderProps) => {
        if (loading) {
            return (
                <View style={{ flex: 4, width: '100%', height: 16 }}>
                    <TextSkeleton height={16} />
                </View>
            );
        } else {
            return (
                <Animated.Text style={[styles.value, { color: color, opacity: fadeAnimText }]} numberOfLines={1} ellipsizeMode={'middle'}>
                    {value}
                </Animated.Text>
            );
        }
    };

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
                <InfoDataRender value={timestamp} color={TextColor} loading={isLoading} />
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>From</Text>
                <TouchableOpacity style={[{ flex: 4 }]} onPress={() => handleExplorer(EXPLORER_URL() + '/accounts/' + data.from)}>
                    <InfoDataRender value={fromAddress} color={TextAddressColor} loading={isLoading} />
                </TouchableOpacity>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Hash</Text>
                <TouchableOpacity style={[{ flex: 4 }]} onPress={() => handleExplorer(EXPLORER_URL() + '/transactions/' + data.hash)}>
                    <InfoDataRender value={transactionHash} color={TextAddressColor} loading={isLoading} />
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
        height: 16,
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
