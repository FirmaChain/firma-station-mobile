import React, { useEffect, useState } from 'react';
import { BoxDarkColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from '@/constants/theme';
import {
    Animated,
    Image,
    Linking,
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextLayoutEventData,
    TouchableOpacity,
    View
} from 'react-native';
import { DownEmptyArrow, ExternalLink, UpEmptyArrow } from '@/components/icon/icon';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import LinearGradient from 'react-native-linear-gradient';

interface IProps {
    data: any;
}

const NUM_OF_LINES = 3;

const DescriptionBox = ({ data }: IProps) => {
    const [maxLines, setMaxLines] = useState(999);
    const [descLines, setDescLines] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);

    const handleMaxLines = () => {
        setOpenAccordion(!openAccordion);
    };

    const handleMoveToWeb = (url: string) => {
        Linking.openURL(url);
    };

    const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
        if (descLines === 0) {
            setDescLines(event.nativeEvent.lines.length);
        }
    };

    useEffect(() => {
        if (descLines > 0) {
            setShowMore(descLines > NUM_OF_LINES);
            setMaxLines(NUM_OF_LINES);
        }
    }, [descLines]);

    useEffect(() => {
        if (showMore) {
            LayoutAnim();
            easeInAndOutCustomAnim(150);
            if (openAccordion) {
                setMaxLines(999);
            } else {
                setMaxLines(NUM_OF_LINES);
            }
        }
    }, [openAccordion]);

    return (
        <View style={[styles.boxH, { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-start' }]}>
            <View style={{ height: '100%', justifyContent: 'flex-start' }}>
                <Image style={[styles.contentImage]} source={{ uri: data.icon }} />
                {/* <Image style={[styles.contentImage]} source={data.icon} /> */}
            </View>
            <View style={[styles.boxV, { flex: 1 }]}>
                <View style={[styles.boxH, { paddingBottom: 10 }]}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.contentTitle]}>
                        {data.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleMoveToWeb(data.url)}>
                        <ExternalLink size={16} color={TextCatTitleColor} />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: openAccordion ? 20 : 0 }}>
                    <Text style={styles.desc} numberOfLines={maxLines} ellipsizeMode={'tail'} onTextLayout={onTextLayout}>
                        {data.description}
                    </Text>
                    <View style={[styles.moreButtonBox, { width: '100%', display: showMore ? 'flex' : 'none' }]}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[BoxDarkColor + 90, BoxDarkColor, BoxDarkColor, BoxDarkColor, BoxDarkColor]}
                            style={{ paddingLeft: 30 }}
                        >
                            <TouchableOpacity style={styles.moreButton} onPress={() => handleMaxLines()}>
                                {openAccordion ? (
                                    <UpEmptyArrow size={14} color={TextGrayColor} />
                                ) : (
                                    <DownEmptyArrow size={14} color={TextGrayColor} />
                                )}
                                <Text style={[styles.desc, { color: TextGrayColor, textAlign: 'right', paddingLeft: 5, paddingBottom: 3 }]}>
                                    {openAccordion ? 'Less' : 'More'}
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    boxH: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    boxV: {
        alignItems: 'flex-start'
    },
    contentImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        overflow: 'hidden',
        borderRadius: 8,
        marginRight: 10
    },
    contentTitle: {
        fontSize: 18,
        fontFamily: Lato,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: TextColor,
        paddingRight: 10,
        paddingBottom: 2
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left',
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
    },
    icon_arrow: {
        width: 18,
        height: 18
    }
});

export default DescriptionBox;
