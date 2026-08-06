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
    // FIXME: DApp descriptions are supplied by external projects without a stable schema.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const inlineStyles1 = {
        inlineStyle1: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-start' },
        inlineStyle2: { height: '100%', justifyContent: 'flex-start' },
        inlineStyle3: { flex: 1 },
        inlineStyle4: { paddingBottom: 6, display: isCWContract ? 'flex' : 'none' },
        inlineStyle5: {
            display: CW20Contract === '' ? 'none' : 'flex',
            color: CW20Color,
            backgroundColor: CW20BackgroundColor
        },
        inlineStyle6: {
            display: CW721Contract === '' ? 'none' : 'flex',
            color: CW721Color,
            backgroundColor: CW721BackgroundColor,
            marginLeft: CW20Contract === '' ? 0 : 8
        },
        inlineStyle7: { paddingBottom: 6 },
        inlineStyle8: { paddingBottom: openAccordion ? 20 : 0 },
        inlineStyle9: { display: showMore ? 'flex' : 'none' },
        inlineStyle10: { paddingLeft: 30 },
        inlineStyle11: { position: 'absolute', left: 0, top: 0 },
        inlineStyle12: { color: TextGrayColor, textAlign: 'right', paddingLeft: 5, paddingBottom: 3 }
    } as const;

    return (
        <View style={[styles.boxH, inlineStyles1.inlineStyle1]}>
            <View style={inlineStyles1.inlineStyle2}>
                <Image style={styles.contentImage} source={{ uri: data.icon }} />
            </View>
            <View style={[styles.boxV, inlineStyles1.inlineStyle3]}>
                <View style={[styles.boxH, inlineStyles1.inlineStyle4]}>
                    <Text style={[styles.label, inlineStyles1.inlineStyle5]}>{'CW20'}</Text>
                    <Text style={[styles.label, inlineStyles1.inlineStyle6]}>{'CW721'}</Text>
                </View>
                <View style={[styles.boxH, inlineStyles1.inlineStyle7]}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.contentTitle}>
                        {data.name}
                    </Text>
                </View>
                <View style={inlineStyles1.inlineStyle8}>
                    <Text style={styles.desc} numberOfLines={maxLines} ellipsizeMode={'tail'} onTextLayout={onTextLayout}>
                        {data.description}
                    </Text>
                    <View style={[styles.moreButtonBox, inlineStyles1.inlineStyle9]}>
                        <TouchableOpacity
                            style={[styles.moreButton, inlineStyles1.inlineStyle10]}
                            onPress={() => handleMaxLines()}
                            onLayout={(event) => setMoreButtonWidth(event.nativeEvent.layout.width)}
                        >
                            <Svg width={moreButtonWidth} height="100%" style={inlineStyles1.inlineStyle11} pointerEvents="none">
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
                            <Text style={[styles.desc, inlineStyles1.inlineStyle12]}>{openAccordion ? 'Less' : 'More'}</Text>
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
        fontWeight: '700',
        textTransform: 'uppercase',
        color: TextColor,
        paddingRight: 10
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '400',
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
    }
});

export default React.memo(DescriptionBox);
