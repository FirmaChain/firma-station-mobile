import React, { useEffect, useMemo, useState } from 'react';
import { BoxDarkColor, CW20BackgroundColor, CW20Color, CW721BackgroundColor, CW721Color, Lato, TextCatTitleColor, TextColor, TextGrayColor } from '@/constants/theme';
import { Image, NativeSyntheticEvent, StyleSheet, Text, TextLayoutEventData, TouchableOpacity, View } from 'react-native';
import { DownEmptyArrow, UpEmptyArrow } from '@/components/icon/icon';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import LinearGradient from 'react-native-linear-gradient';

interface IProps {
    data: any;
}

const DescriptionBox = ({ data }: IProps) => {
    const [maxLines, setMaxLines] = useState(999);
    const [descLines, setDescLines] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false);

    const CW20Contract = useMemo(() => {
        if (data.cw20ContractAddress === null || data.cw20ContractAddress === '' || data.cw20ContractAddress === '0x') return "";
        return data.cw20ContractAddress
    }, [data.cw20ContractAddress])

    const CW721Contract = useMemo(() => {
        if (data.cw721ContractAddress === null || data.cw721ContractAddress === '' || data.cw721ContractAddress === '0x') return "";
        return data.cw721ContractAddress
    }, [data.cw721ContractAddress])

    const isCWContract = useMemo(() => {
        return !Boolean(CW20Contract === '' || CW721Contract === '');
    }, [CW20Contract, CW721Contract])


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
            </View>
            <View style={[styles.boxV, { flex: 1 }]}>
                <View style={[styles.boxH, { paddingBottom: 6, display: isCWContract ? 'flex' : 'none' }]}>
                    <Text style={[styles.label, { display: CW20Contract === "" ? 'none' : 'flex', color: CW20Color, backgroundColor: CW20BackgroundColor }]}>{'CW20'}</Text>
                    <Text style={[styles.label, { display: CW721Contract === "" ? 'none' : 'flex', color: CW721Color, backgroundColor: CW721BackgroundColor, marginLeft: CW20Contract === "" ? 0 : 8 }]}>{'CW721'}</Text>
                </View>
                <View style={[styles.boxH, { paddingBottom: 6 }]}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.contentTitle]}>
                        {data.name}
                    </Text>
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
    label: {
        fontFamily: Lato,
        fontSize: 12,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        fontWeight: '600',
        paddingHorizontal: 6,
        paddingVertical: 3,
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
        paddingRight: 10,
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left',
        color: TextCatTitleColor,
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

export default React.memo(DescriptionBox);
