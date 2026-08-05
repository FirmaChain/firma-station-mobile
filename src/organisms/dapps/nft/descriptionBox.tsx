import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    BoxDarkColor,
    CW721BackgroundColor,
    CW721Color,
    Lato,
    TextCatTitleColor,
    TextColor,
    TextDarkGrayColor,
    TextGrayColor
} from '@/constants/theme';
import { easeInAndOutCustomAnim, fadeOut } from '@/util/animation';
import FastImage from '@d11/react-native-fast-image';
import { Animated, StyleSheet, Text, TextLayoutEvent, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { DownEmptyArrow, UpEmptyArrow } from '@/components/icon/icon';
import SquareSkeleton from '@/components/skeleton/squareSkeleton';

interface IProps {
    // FIXME: NFT metadata is supplied by external contracts without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    isCW721: boolean;
}

const NUM_OF_LINES = 3;

const DescriptionBox = ({ data, isCW721 }: IProps) => {
    const fadeAnimImage = useRef(new Animated.Value(1)).current;

    const [maxLines, setMaxLines] = useState(999);
    const [descLines, setDescLines] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleMaxLines = () => {
        setOpenAccordion(!openAccordion);
    };

    const onTextLayout = (event: TextLayoutEvent) => {
        if (descLines === 0) {
            setDescLines(event.nativeEvent.lines.length);
        }
    };

    const handleDescriptionShowMore = useCallback(() => {
        if (descLines > 0) {
            setShowMore(descLines > NUM_OF_LINES);
            setMaxLines(NUM_OF_LINES);
        }
    }, [descLines]);

    useEffect(() => {
        handleDescriptionShowMore();
    }, [descLines]);

    useEffect(() => {
        if (showMore) {
            easeInAndOutCustomAnim(150);
            if (openAccordion) {
                setMaxLines(999);
            } else {
                setMaxLines(NUM_OF_LINES);
            }
        }
    }, [openAccordion]);

    useEffect(() => {
        if (imageLoading === false) {
            fadeOut(Animated, fadeAnimImage, 500);
        }
    }, [imageLoading]);

    return (
        <React.Fragment>
            <View style={{ alignItems: 'center' }}>
                <View style={{ justifyContent: 'flex-start' }}>
                    <FastImage
                        style={styles.contentImage}
                        source={{
                            uri: data.image,
                            priority: FastImage.priority.normal
                        }}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                    <Animated.View style={{ position: 'absolute', top: 0, left: 0, opacity: fadeAnimImage }}>
                        <SquareSkeleton size={200} marginBottom={20} />
                    </Animated.View>
                </View>
                <View style={[styles.box, { display: isCW721 ? 'flex' : 'none', paddingBottom: 5 }]}>
                    <Text style={styles.label}>CW721</Text>
                </View>
                <View style={[styles.box, { paddingBottom: 5 }]}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.contentTitle}>
                        {data.name}
                    </Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.tokenIdTitle}>{`#${data.tokenId}`}</Text>
                </View>
            </View>
            <View style={[styles.descBox, { paddingBottom: openAccordion ? 20 : 0 }]}>
                {data.description !== '' && (
                    <Text style={styles.desc} numberOfLines={maxLines} ellipsizeMode={'tail'} onTextLayout={onTextLayout}>
                        {data.description}
                    </Text>
                )}
                <View style={[styles.moreButtonBox, { width: '100%', display: showMore ? 'flex' : 'none' }]}>
                    <TouchableOpacity style={styles.moreButton} onPress={() => handleMaxLines()}>
                        <Svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
                            <Defs>
                                <SvgLinearGradient id="nftDescriptionMoreGradient" x1="0" y1="0" x2="1" y2="0">
                                    <Stop offset="0%" stopColor={BoxDarkColor} stopOpacity={0.56} />
                                    <Stop offset="20%" stopColor={BoxDarkColor} stopOpacity={1} />
                                    <Stop offset="100%" stopColor={BoxDarkColor} stopOpacity={1} />
                                </SvgLinearGradient>
                            </Defs>
                            <Rect x="0" y="0" width="100%" height="100%" fill="url(#nftDescriptionMoreGradient)" />
                        </Svg>
                        {openAccordion ? (
                            <UpEmptyArrow size={14} color={TextGrayColor} />
                        ) : (
                            <DownEmptyArrow size={14} color={TextGrayColor} />
                        )}
                        <Text style={[styles.desc, { color: TextGrayColor, textAlign: 'right', paddingLeft: 5, paddingBottom: 3 }]}>
                            {openAccordion ? 'Less' : 'More'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    box: {
        alignItems: 'center'
    },
    contentImage: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        overflow: 'hidden',
        borderRadius: 8,
        marginBottom: 20
    },
    contentTitle: {
        width: '100%',
        fontSize: 20,
        fontFamily: Lato,
        fontWeight: 'bold',
        color: TextColor
    },
    tokenIdTitle: {
        width: '100%',
        fontSize: 20,
        fontFamily: Lato,
        color: TextDarkGrayColor
    },
    label: {
        fontFamily: Lato,
        fontSize: 12,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 3,
        color: CW721Color,
        backgroundColor: CW721BackgroundColor
    },
    descBox: {
        alignItems: 'flex-start',
        paddingTop: 25,
        marginBottom: 25
    },
    desc: {
        fontFamily: Lato,
        fontSize: 16,
        lineHeight: 30,
        fontWeight: 'normal',
        color: TextCatTitleColor
    },
    moreButtonBox: {
        position: 'absolute',
        bottom: -5,
        right: 0,
        alignItems: 'flex-end'
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
});

export default DescriptionBox;
