import React, { useEffect, useMemo, useState } from 'react';
import {
    BoxDarkColor,
    CW20BackgroundColor,
    CW20Color,
    CW721BackgroundColor,
    CW721Color,
    Lato,
    TextCatTitleColor,
    TextColor,
    TextGrayColor
} from '@/constants/theme';
import { easeInAndOutCustomAnim } from '@/util/animation';
import { Image, NativeSyntheticEvent, StyleSheet, Text, TextLayoutEventData, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Rect, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

import { DownEmptyArrow, UpEmptyArrow } from '@/components/icon/icon';

interface IProps {
    data: any;
}

const DescriptionBox = ({ data }: IProps) => {
    const [maxLines, setMaxLines] = useState(999);
    const [descLines, setDescLines] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);
    const [moreButtonWidth, setMoreButtonWidth] = useState(0);

    const CW20Contract = useMemo(() => {
        if (data.cw20ContractAddress === null || data.cw20ContractAddress === '' || data.cw20ContractAddress === '0x') return '';
        return data.cw20ContractAddress;
    }, [data.cw20ContractAddress]);

    const CW721Contract = useMemo(() => {
        if (data.cw721ContractAddress === null || data.cw721ContractAddress === '' || data.cw721ContractAddress === '0x') return '';
        return data.cw721ContractAddress;
    }, [data.cw721ContractAddress]);

    const isCWContract = useMemo(() => {
        return !(CW20Contract === '' && CW721Contract === '');
    }, [CW20Contract, CW721Contract]);

    const NUM_OF_LINES = isCWContract ? 2 : 3;

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
                <Image style={styles.contentImage} source={{ uri: data.icon }} />
            </View>
            <View style={[styles.boxV, { flex: 1 }]}>
                <View style={[styles.boxH, { paddingBottom: 6, display: isCWContract ? 'flex' : 'none' }]}>
                    <Text
                        style={[
                            styles.label,
                            {
                                display: CW20Contract === '' ? 'none' : 'flex',
                                color: CW20Color,
                                backgroundColor: CW20BackgroundColor
                            }
                        ]}
                    >
                        {'CW20'}
                    </Text>
                    <Text
                        style={[
                            styles.label,
                            {
                                display: CW721Contract === '' ? 'none' : 'flex',
                                color: CW721Color,
                                backgroundColor: CW721BackgroundColor,
                                marginLeft: CW20Contract === '' ? 0 : 8
                            }
                        ]}
                    >
                        {'CW721'}
                    </Text>
                </View>
                <View style={[styles.boxH, { paddingBottom: 6 }]}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.contentTitle}>
                        {data.name}
                    </Text>
                </View>
                <View style={{ paddingBottom: openAccordion ? 20 : 0 }}>
                    <Text style={styles.desc} numberOfLines={maxLines} ellipsizeMode={'tail'} onTextLayout={onTextLayout}>
                        {data.description}
                    </Text>
                    <View style={[styles.moreButtonBox, { display: showMore ? 'flex' : 'none' }]}>
                        <TouchableOpacity
                            style={[styles.moreButton, { paddingLeft: 30 }]}
                            onPress={() => handleMaxLines()}
                            onLayout={(event) => setMoreButtonWidth(event.nativeEvent.layout.width)}
                        >
                            <Svg
                                width={moreButtonWidth}
                                height="100%"
                                style={{ position: 'absolute', left: 0, top: 0 }}
                                pointerEvents="none"
                            >
                                <Defs>
                                    <SvgLinearGradient id="dappDetailMoreGradient" x1="0" y1="0" x2="1" y2="0">
                                        <Stop offset="0%" stopColor={BoxDarkColor} stopOpacity={0.56} />
                                        <Stop offset="20%" stopColor={BoxDarkColor} stopOpacity={1} />
                                        <Stop offset="100%" stopColor={BoxDarkColor} stopOpacity={1} />
                                    </SvgLinearGradient>
                                </Defs>
                                <Rect x="0" y="0" width={moreButtonWidth} height="100%" fill="url(#dappDetailMoreGradient)" />
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
    label: {
        fontFamily: Lato,
        fontSize: 12,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 3
    },
    boxV: {
        alignItems: 'flex-start'
    },
    contentImage: {
        width: 86,
        height: 86,
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
        paddingRight: 10
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
});

export default React.memo(DescriptionBox);
