import React, { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, Lato, PointLightColor, TextCatTitleColor, TextGrayColor } from '@/constants/theme';
import { DAPP_LOADING_NFT, DAPP_NO_NFT } from '@/constants/common';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { fadeIn, fadeOut } from '@/util/animation';
import SquareSkeleton from '@/components/skeleton/squareSkeleton';
import { INFTProps } from '@/hooks/dapps/hooks';
import FastImage from 'react-native-fast-image';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.DappDetail>;

interface IProps {
    visible: boolean;
    NFTS: Array<INFTProps> | null;
}

interface INFTItemProps {
    item: INFTProps;
    size: number;
}

const itemCountPerLine = 3;

const NFTsBox = ({ visible, NFTS }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const [containerSize, setContainerSize] = useState(0);
    const [NFTList, setNFTList] = useState<Array<any> | null>(null);
    const [NFTCount, setNFTCount] = useState(0);
    const [NFTsExist, setNFTsExist] = useState(false);

    const handleNFTsData = useCallback(() => {
        if (NFTS !== null) {
            setNFTList(NFTS);
            setNFTCount(NFTS.length);
            setNFTsExist(NFTS.length > 0);
        }
    }, [NFTS]);

    useEffect(() => {
        handleNFTsData();
    }, [NFTS]);

    const moveToNFTDetail = useCallback(
        (id: any) => {
            if (NFTList !== null) {
                let nft = NFTList.find((value: any) => id === value.id);
                navigation.navigate(Screens.NFT, { data: { nft: nft } });
            }
        },
        [NFTList]
    );

    const NFTTable = () => {
        const renderTable = useCallback(() => {
            return (
                <Fragment>
                    <View style={styles.wrapBox} onLayout={(e) => setContainerSize(e.nativeEvent.layout.width)}>
                        {NFTsExist ? (
                            NFTList !== null &&
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
                                <Text style={styles.notice}>{NFTList === null ? DAPP_LOADING_NFT : DAPP_NO_NFT}</Text>
                            </View>
                        )}
                    </View>
                </Fragment>
            );
        }, [NFTsExist, NFTList, containerSize]);
        return renderTable();
    };
    const NFTItem = ({ item, size }: INFTItemProps) => {
        const fadeAnimImage = useRef(new Animated.Value(1)).current;
        const [imageLoading, setImageLoading] = useState(false);

        useEffect(() => {
            if (imageLoading === false) {
                fadeOut(Animated, fadeAnimImage, 500);
            } else {
                fadeIn(Animated, fadeAnimImage, 500);
            }
        }, [imageLoading]);

        const renderItem = useCallback(() => {
            return (
                <TouchableOpacity style={[styles.contentWrap, { width: size }]} onPress={() => moveToNFTDetail(item.id)}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={[styles.contentImageWrap, { width: '100%', height: size - 20 }]}>
                            <FastImage
                                style={styles.contentIamge}
                                resizeMode={'contain'}
                                source={{
                                    uri: item.image,
                                    priority: FastImage.priority.low
                                }}
                                onLoadStart={() => setImageLoading(true)}
                                onLoadEnd={() => setImageLoading(false)}
                            />
                        </View>
                        {/* <Image style={[styles.contentImage, { width: '100%', height: size - 20 }]} source={item.image} /> */}
                        <Text style={[styles.contentTitle, { width: '100%' }]} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Animated.View style={{ position: 'absolute', top: 0, left: 10, opacity: fadeAnimImage }}>
                            <SquareSkeleton size={size - 20} marginBottom={0} borderRadius={2} />
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            );
        }, [fadeAnimImage]);

        return renderItem();
    };

    return (
        <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
            <View style={styles.box}>
                <View style={[styles.header, { display: NFTsExist ? 'flex' : 'none' }]}>
                    <Text style={styles.title}>
                        List
                        <Text style={{ color: PointLightColor }}> {NFTCount}</Text>
                    </Text>
                </View>
                <View style={[styles.infoBox, NFTsExist === false && { height: '100%' }]}>{visible && <NFTTable />}</View>
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
    contentImageWrap: {
        overflow: 'hidden',
        backgroundColor: BoxColor,
        borderRadius: 2
    },
    contentIamge: {
        width: '100%',
        height: '100%'
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

export default memo(NFTsBox);
