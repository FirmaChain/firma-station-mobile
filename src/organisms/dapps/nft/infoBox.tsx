import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { FIRMA_LOGO, VALIDATOR_PROFILE } from '@/constants/images';
import { Lato, TextAddressColor, TextColor, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import { wait } from '@/util/common';
import { CHAIN_NETWORK } from '@/../config';
import { fadeIn } from '@/util/animation';
import TextSkeleton from '@/components/skeleton/textSkeleton';
import CircleSkeleton from '@/components/skeleton/circleSkeleton';

interface IProps {
    data: any;
}

interface IDataRenderProps {
    title: string;
    imageURI?: string;
    color: string;
    loading: boolean;
}

const InfoBox = ({ data }: IProps) => {
    const { storage } = useAppSelector((state) => state);

    const chainID = useMemo(() => {
        return `(${CHAIN_NETWORK[storage.network].FIRMACHAIN_CONFIG.chainID})`;
    }, []);

    const createdBy = useMemo(() => {
        if (data.createdBy === undefined) return '';
        return data.createdBy;
    }, [data.createdBy]);

    const collection = useMemo(() => {
        if (data.collection === undefined) return { name: '', icon: '' };
        return data.collection;
    }, [data.collection]);

    const InfoDataRender = ({ title, imageURI, color, loading }: IDataRenderProps) => {
        const fadeAnimText = useRef(new Animated.Value(0)).current;
        const [loaded, setLoaded] = useState(false);

        const handleLoadingItem = useCallback(() => {
            if (loaded === false) {
                wait(1000).then(() => {
                    fadeIn(Animated, fadeAnimText, 500);
                    setLoaded(true);
                });
            }
        }, [loaded]);

        useEffect(() => {
            if (loading === false) {
                handleLoadingItem();
            }
        }, [loading]);

        const renderItem = useCallback(() => {
            return (
                <Fragment>
                    {loaded ? (
                        <View style={styles.wrap}>
                            <Animated.Image
                                style={{ width: 15, height: 15, opacity: fadeAnimText, borderRadius: 50 }}
                                source={imageURI === undefined ? VALIDATOR_PROFILE : { uri: imageURI }}
                            />
                            <Animated.Text
                                style={[styles.value, { color: color, opacity: fadeAnimText, flex: 0, paddingLeft: 5, lineHeight: 17 }]}
                                numberOfLines={1}
                                ellipsizeMode={'middle'}
                            >
                                {title}
                            </Animated.Text>
                        </View>
                    ) : (
                        <View style={styles.wrap}>
                            <View style={{ width: 15, height: 15 }}>
                                <CircleSkeleton size={15} marginBottom={0} />
                            </View>
                            <View style={{ width: '90%', height: 16, marginLeft: 10 }}>
                                <TextSkeleton height={16} />
                            </View>
                        </View>
                    )}
                </Fragment>
            );
        }, [loaded]);

        return renderItem();
    };

    return (
        <View style={{ paddingBottom: 10 }}>
            <View style={styles.box}>
                <Text style={styles.title}>No.</Text>
                <Text style={styles.value}>{data.id}</Text>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Blockchain</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 4, paddingLeft: 2 }}>
                    <Image source={FIRMA_LOGO} style={{ width: 15, height: 15, borderRadius: 50, marginRight: 3 }} />
                    <Text style={[styles.value, { flex: 0 }]}>
                        {'FIRMACHAIN '}
                        <Text style={[styles.value, { flex: 0, fontSize: 14, color: TextDarkGrayColor }]}>{chainID}</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Collection</Text>
                <InfoDataRender title={collection.name} imageURI={collection.icon} color={WhiteColor} loading={collection.name === ''} />
            </View>
            <View style={styles.box}>
                <Text style={styles.title}>Created by</Text>
                <InfoDataRender title={createdBy} color={WhiteColor} loading={createdBy === ''} />
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
    wrap: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    title: {
        flex: 1.5,
        fontFamily: Lato,
        fontSize: 16,
        color: TextDarkGrayColor
    },
    value: {
        flex: 3,
        height: 16,
        paddingLeft: 2,
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor,
        textAlign: 'right'
    },
    linkWrapper: {
        backgroundColor: TextAddressColor + '20',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4
    }
});

export default memo(InfoBox);
