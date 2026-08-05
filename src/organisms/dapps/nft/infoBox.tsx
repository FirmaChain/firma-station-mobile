import React, { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHAIN_NETWORK } from '@/../config';
import FirmaLogo from '@/assets/icons/blockchain/firmachain.svg';
import { Lato, TextColor, TextDarkGrayColor, TextGrayColor, WhiteColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { fadeIn } from '@/util/animation';
import { wait } from '@/util/common';
import { getCW721NFTItemFromId } from '@/util/firma';
import { Animated, StyleSheet, Text, View } from 'react-native';

import ValidatorProfile from '@/components/parts/validatorProfile';
import CircleSkeleton from '@/components/skeleton/circleSkeleton';
import TextSkeleton from '@/components/skeleton/textSkeleton';

interface IProps {
    // FIXME: NFT metadata is supplied by external contracts without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

interface IDataRenderProps {
    title: string;
    imageURI?: string;
    color: string;
    loading: boolean;
}

const InfoBox = ({ data }: IProps) => {
    const { network } = useAppSelector((state) => state.storage);

    const isCW721 = !(data.cw721Contract === '');
    const [owner, setOwner] = useState<string>('');

    const getNFTOwner = useCallback(async () => {
        try {
            if (isCW721 === false) return;
            const nftInfo = await getCW721NFTItemFromId(data.cw721Contract, data.tokenId);
            const _owner = nftInfo === null ? '' : nftInfo.access.owner;
            setOwner(_owner);
        } catch (error) {
            console.log('getNFTOwner : ', error);
        }
    }, [data, isCW721]);

    useEffect(() => {
        getNFTOwner();
    }, [data, isCW721]);

    const chainID = useMemo(() => {
        return `(${CHAIN_NETWORK[network].FIRMACHAIN_CONFIG.chainID})`;
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
            const inlineStyles1 = {
                inlineStyle1: { opacity: fadeAnimText },
                inlineStyle2: { color: color, opacity: fadeAnimText, flex: 0, paddingLeft: 5, lineHeight: 17 },
                inlineStyle3: { width: 15, height: 15 },
                inlineStyle4: { width: '90%', height: 16, marginLeft: 10 }
            } as const;

            return (
                <Fragment>
                    {loaded ? (
                        <View style={styles.wrap}>
                            <Animated.View style={inlineStyles1.inlineStyle1}>
                                <ValidatorProfile uri={imageURI ?? ''} size={15} />
                            </Animated.View>
                            <Animated.Text style={[styles.value, inlineStyles1.inlineStyle2]} numberOfLines={1} ellipsizeMode={'middle'}>
                                {title}
                            </Animated.Text>
                        </View>
                    ) : (
                        <View style={styles.wrap}>
                            <View style={inlineStyles1.inlineStyle3}>
                                <CircleSkeleton size={15} marginBottom={0} />
                            </View>
                            <View style={inlineStyles1.inlineStyle4}>
                                <TextSkeleton height={16} />
                            </View>
                        </View>
                    )}
                </Fragment>
            );
        }, [loaded]);

        return renderItem();
    };

    const inlineStyles2 = {
        inlineStyle1: { paddingBottom: 10 },
        inlineStyle2: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 4,
            paddingLeft: 2
        },
        inlineStyle3: { marginRight: 3 },
        inlineStyle4: { flex: 0 },
        inlineStyle5: { flex: 0, fontSize: 14, color: TextDarkGrayColor },
        inlineStyle6: { maxHeight: collection.name === '' ? 0 : 100 }
    } as const;

    return (
        <View style={inlineStyles2.inlineStyle1}>
            <View style={styles.box}>
                <Text style={styles.title}>Blockchain</Text>
                <View style={inlineStyles2.inlineStyle2}>
                    <FirmaLogo width={15} height={15} color={TextGrayColor} style={inlineStyles2.inlineStyle3} />
                    <Text style={[styles.value, inlineStyles2.inlineStyle4]}>
                        {'FIRMACHAIN '}
                        <Text style={[styles.value, inlineStyles2.inlineStyle5]}>{chainID}</Text>
                    </Text>
                </View>
            </View>
            <View style={[styles.box, inlineStyles2.inlineStyle6]}>
                <Text style={styles.title}>Collection</Text>
                <InfoDataRender
                    title={collection.name === null ? '' : collection.name}
                    imageURI={collection.icon}
                    color={WhiteColor}
                    loading={collection.name === null}
                />
            </View>
            {isCW721 ? (
                <Fragment>
                    <View style={styles.box}>
                        <Text style={styles.title}>Contract</Text>
                        <InfoDataRender title={data.cw721Contract} imageURI={''} color={WhiteColor} loading={data.cw721Contract === ''} />
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.title}>Owned by</Text>
                        <InfoDataRender title={owner} color={WhiteColor} imageURI={''} loading={owner === ''} />
                    </View>
                </Fragment>
            ) : (
                <View style={styles.box}>
                    <Text style={styles.title}>Created by</Text>
                    <InfoDataRender title={createdBy} color={WhiteColor} loading={createdBy === ''} />
                </View>
            )}
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
    }
});

export default memo(InfoBox);
