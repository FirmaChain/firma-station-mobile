import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, Lato, PointLightColor, TextCatTitleColor, TextGrayColor } from '@/constants/theme';
import { DAPP_NO_NFT } from '@/constants/common';
import { useNFTTransaction } from '@/hooks/dapps/hooks';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import SquareSkeleton from '@/components/skeleton/squareSkeleton';
import { fadeOut } from '@/util/animation';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

interface IProps {
    visible: boolean;
    NFTS: Array<any>;
}

const itemCountPerLine = 3;

const NFTsBox = ({ visible, NFTS }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const [containerSize, setContainerSize] = useState(0);

    const NFTList = useMemo(() => {
        return NFTS;
    }, [NFTS]);

    const NFTCount = useMemo(() => {
        return NFTList.length;
    }, [NFTList]);

    const nftsExist = useMemo(() => {
        return NFTCount > 0;
    }, [NFTCount]);

    const moveToNFTDetail = (id: any) => {
        let nft = NFTList.find((value: any) => id === value.id);
        navigation.navigate(Screens.NFT, { data: { nft: nft } });
    };

    const NFTItem = useCallback(
        ({ item, size }: any) => {
            const fadeAnimImage = useRef(new Animated.Value(1)).current;
            const [imageLoading, setImageLoading] = useState(false);

            useEffect(() => {
                if (imageLoading === false) {
                    fadeOut(Animated, fadeAnimImage, 500);
                }
            }, [imageLoading]);

            return (
                <TouchableOpacity style={[styles.contentWrap, { width: size }]} onPress={() => moveToNFTDetail(item.id)}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Image
                            style={[styles.contentImage, { width: '100%', height: size - 20 }]}
                            source={{ uri: item.image }}
                            onLoadStart={() => setImageLoading(true)}
                            onLoadEnd={() => setImageLoading(false)}
                        />
                        {/* <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={item.image} /> */}
                        <Text style={[styles.contentTitle, { width: '100%' }]} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Animated.View style={{ position: 'absolute', top: 0, left: 10, opacity: fadeAnimImage }}>
                            <SquareSkeleton size={size - 20} marginBottom={0} />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            );
        },
        [visible]
    );

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.box}>
                <View style={[styles.header, { display: nftsExist ? 'flex' : 'none' }]}>
                    <Text style={styles.title}>
                        List
                        <Text style={{ color: PointLightColor }}> {NFTCount}</Text>
                    </Text>
                </View>
                <View style={[styles.infoBox, nftsExist === false && { height: '100%' }]}>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {nftsExist ? (
                            NFTList.map((value, key) => {
                                return <NFTItem key={key} item={value} size={(containerSize - 20) / itemCountPerLine} />;
                            })
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 30
                                }}
                            >
                                <Text style={styles.notice}>{DAPP_NO_NFT}</Text>
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
        backgroundColor: BoxColor,
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

export default React.memo(NFTsBox);
