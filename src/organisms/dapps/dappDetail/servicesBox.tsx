import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DAPP_NO_SERVICE } from '@/constants/common';
import { BgColor, BoxColor, Lato, PointLightColor, TextCatTitleColor, TextGrayColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { fadeIn } from '@/util/animation';
import { ServiceMetaData } from '@/util/connectClient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Animated, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import SquareSkeleton from '@/components/skeleton/squareSkeleton';

interface IProps {
    visible: boolean;
    identity: string;
    data: Array<ServiceMetaData>;
}
type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

const itemCountPerLine = 3;

const ServicesBox = ({ visible, identity, data }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const fadeAnimImage = useRef(new Animated.Value(0)).current;

    const { dappServicesVolume } = useAppSelector((state) => state.storage);

    const [containerSize, setContainerSize] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const itemsSkeleton = useMemo(() => {
        if (dappServicesVolume[identity] === undefined) return [];
        const array = Array.from({ length: Number(dappServicesVolume[identity]) });
        return array;
    }, [dappServicesVolume[identity]]);

    const serviceList = useMemo(() => {
        return data;
    }, [data]);

    const itemLength = useMemo(() => {
        return serviceList.length;
    }, [serviceList]);

    const servicesExist = useMemo(() => {
        return itemLength > 0;
    }, [itemLength]);

    const handleMoveToWeb = useCallback((url: string, isExternal: boolean) => {
        if (isExternal) {
            Linking.openURL(url);
        } else {
            navigation.navigate(Screens.WebScreen, { uri: url });
        }
    }, []);

    const ServiceItem = useCallback(
        // FIXME: Service entries are supplied by external DApp metadata without a stable schema.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ item, size }: any) => {
            const inlineStyles1 = {
                inlineStyle1: { width: size },
                inlineStyle2: { paddingHorizontal: 10, opacity: fadeAnimImage },
                inlineStyle3: { width: '100%', height: size - 20 },
                inlineStyle4: { width: '100%' }
            } as const;

            return (
                <TouchableOpacity
                    style={[styles.contentWrap, inlineStyles1.inlineStyle1]}
                    onPress={() => handleMoveToWeb(item.url, item.isExternalBrowser)}
                >
                    <Animated.View style={inlineStyles1.inlineStyle2}>
                        <Image style={[styles.contentImage, inlineStyles1.inlineStyle3]} source={{ uri: item.icon }} />
                        {/* <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={item.icon} /> */}
                        <Text style={[styles.contentTitle, inlineStyles1.inlineStyle4]} numberOfLines={2}>
                            {item.name}
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            );
        },
        [handleMoveToWeb]
    );

    useEffect(() => {
        if (itemLength >= dappServicesVolume[identity] || servicesExist) {
            setIsLoaded(true);
            fadeIn(Animated, fadeAnimImage, 500);
        } else {
            setIsLoaded(false);
        }
    }, [servicesExist, itemLength]);

    const inlineStyles2 = {
        inlineStyle1: { display: visible ? 'flex' : 'none' },
        inlineStyle2: { display: servicesExist ? 'flex' : 'none' },
        inlineStyle3: { color: PointLightColor },
        inlineStyle4: {
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 30
        }
    } as const;

    return (
        <View style={[styles.container, inlineStyles2.inlineStyle1]}>
            <View style={styles.box}>
                <View style={[styles.header, inlineStyles2.inlineStyle2]}>
                    <Text style={styles.title}>
                        List
                        <Text style={inlineStyles2.inlineStyle3}> {itemLength}</Text>
                    </Text>
                </View>
                <View style={[styles.infoBox, servicesExist === false && styles.inlineStyle1]}>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {servicesExist ? (
                            isLoaded ? (
                                serviceList.map((value, key) => {
                                    return <ServiceItem key={key} item={value} size={(containerSize - 20) / itemCountPerLine} />;
                                })
                            ) : (
                                itemsSkeleton.map((value, index) => {
                                    const size = (containerSize - 20) / itemCountPerLine;
                                    const inlineStyles3 = {
                                        inlineStyle1: { width: size, marginBottom: 20, paddingHorizontal: 10 }
                                    } as const;

                                    return (
                                        <View key={index} style={inlineStyles3.inlineStyle1}>
                                            <SquareSkeleton size={size - 20} marginBottom={5} bgColor={BoxColor} />
                                        </View>
                                    );
                                })
                            )
                        ) : (
                            <View style={inlineStyles2.inlineStyle4}>
                                <Text style={styles.notice}>{DAPP_NO_SERVICE}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { height: '100%' },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: BgColor,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    box: {
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    infoBox: {
        width: '100%'
    },
    header: {
        height: 48,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    notice: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    wrapBox: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    contentWrap: {
        marginBottom: 20
    },
    contentImage: {
        resizeMode: 'contain',
        overflow: 'hidden',
        borderRadius: 8
    },
    contentTitle: {
        fontFamily: Lato,
        fontSize: 14,
        textAlign: 'center',
        color: TextCatTitleColor,
        padding: 5,
        marginTop: 5,
        overflow: 'hidden'
    }
});

export default ServicesBox;
