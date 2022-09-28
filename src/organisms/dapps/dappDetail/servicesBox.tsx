import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, Lato, PointLightColor, TextCatTitleColor, TextGrayColor } from '@/constants/theme';
import { DAPP_NO_SERVICE } from '@/constants/common';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import SquareSkeleton from '@/components/skeleton/squareSkeleton';
import { fadeIn } from '@/util/animation';

interface IProps {
    visible: boolean;
    identity: string;
    data: Array<any>;
}
type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

const itemCountPerLine = 3;

const ServicesBox = ({ visible, identity, data }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const fadeAnimImage = useRef(new Animated.Value(0)).current;

    const { storage } = useAppSelector((state) => state);

    const [containerSize, setContainerSize] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const itemsSkeleton = useMemo(() => {
        if (storage.dappServicesVolume[identity] === undefined) return [];
        let array = Array.from({ length: Number(storage.dappServicesVolume[identity]) });
        return array;
    }, [storage.dappServicesVolume[identity]]);

    const itemLength = useMemo(() => {
        return data.length;
    }, data);

    const servicesExist = useMemo(() => {
        return itemLength > 0;
    }, [itemLength]);

    const handleMoveToWeb = useCallback((url: string) => {
        // Linking.openURL(url);
        navigation.navigate(Screens.WebScreen, { uri: url });
    }, []);

    const NFTItem = useCallback(
        ({ item, size }: any) => {
            return (
                <TouchableOpacity style={[styles.contentWrap, { width: size }]} onPress={() => handleMoveToWeb(item.url)}>
                    <Animated.View style={{ paddingHorizontal: 10, opacity: fadeAnimImage }}>
                        <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={{ uri: item.icon }} />
                        {/* <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={item.icon} /> */}
                        <Text style={[styles.contentTitle, { width: '100%' }]} numberOfLines={2}>
                            {item.name}
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            );
        },
        [handleMoveToWeb]
    );

    useEffect(() => {
        if (itemLength >= storage.dappServicesVolume[identity] || servicesExist) {
            setIsLoaded(true);
            fadeIn(Animated, fadeAnimImage, 500);
        } else {
            setIsLoaded(false);
        }
    }, [servicesExist, itemLength]);

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.box}>
                <View style={[styles.header, { display: servicesExist ? 'flex' : 'none' }]}>
                    <Text style={styles.title}>
                        List
                        <Text style={{ color: PointLightColor }}> {itemLength}</Text>
                    </Text>
                </View>
                <View style={[styles.infoBox, servicesExist === false && { height: '100%' }]}>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {servicesExist ? (
                            isLoaded ? (
                                data.map((value, key) => {
                                    return <NFTItem key={key} item={value} size={(containerSize - 20) / itemCountPerLine} />;
                                })
                            ) : (
                                itemsSkeleton.map((value, index) => {
                                    const size = (containerSize - 20) / itemCountPerLine;
                                    return (
                                        <View key={index} style={{ width: size, marginBottom: 20, paddingHorizontal: 10 }}>
                                            <SquareSkeleton size={size - 20} marginBottom={5} bgColor={BoxColor} />
                                        </View>
                                    );
                                })
                            )
                        ) : (
                            <View style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 }}>
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
