import React, { useEffect, useState } from 'react';
import { BoxDarkColor, Lato, TextCatTitleColor, TextColor, TextGrayColor } from '@/constants/theme';
import { Image, NativeSyntheticEvent, StyleSheet, Text, TextLayoutEventData, TouchableOpacity, View } from 'react-native';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import { DownEmptyArrow, UpEmptyArrow } from '@/components/icon/icon';
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
        <React.Fragment>
            <View style={{ alignItems: 'center' }}>
                <View style={{ justifyContent: 'flex-start' }}>
                    <Image style={styles.contentImage} source={{ uri: data.image }} />
                    {/* <Image style={styles.contentImage} source={data.image} /> */}
                </View>
                <View style={styles.box}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.contentTitle]}>
                        {data.name}
                    </Text>
                </View>
            </View>
            <View style={[styles.descBox, { paddingBottom: openAccordion ? 20 : 0 }]}>
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
    },
    icon_arrow: {
        width: 18,
        height: 18
    }
});

export default DescriptionBox;
