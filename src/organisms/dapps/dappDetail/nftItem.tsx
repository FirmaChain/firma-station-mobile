import React, { memo } from 'react';
import { BoxColor, Lato, TextCatTitleColor } from '@/constants/theme';
import FastImage, { Source } from '@d11/react-native-fast-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { INFTProps } from '@/hooks/dapps/hooks';

interface IProps {
    item: INFTProps;
    size: number;
    disabled?: boolean;
    moveToNFTDetail: (id: string) => void;
}

const NFTItem = ({ item, size, disabled = false, moveToNFTDetail }: IProps) => {
    const getImageSource = (value: string | Source): Source => {
        return typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))
            ? { uri: value, priority: FastImage.priority.low }
            : (value as Source);
    };

    const inlineStyles1 = {
        inlineStyle1: { width: size },
        inlineStyle2: { paddingHorizontal: 10 },
        inlineStyle3: { width: '100%', height: size - 20 },
        inlineStyle4: { width: '100%' }
    } as const;

    return (
        <TouchableOpacity
            activeOpacity={disabled ? 1 : 0.2}
            style={[styles.contentWrap, inlineStyles1.inlineStyle1]}
            onPress={() => moveToNFTDetail(item.id)}
        >
            <View style={inlineStyles1.inlineStyle2}>
                <View style={[styles.contentImageWrap, inlineStyles1.inlineStyle3]}>
                    <FastImage style={styles.contentImage} resizeMode="contain" source={getImageSource(item.image)} />
                </View>
                <Text style={[styles.contentTitle, inlineStyles1.inlineStyle4]} numberOfLines={1}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const areEqual = (prevProps: IProps, nextProps: IProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.size === nextProps.size &&
        prevProps.moveToNFTDetail === nextProps.moveToNFTDetail
    );
};

const styles = StyleSheet.create({
    contentWrap: {
        marginBottom: 20
    },
    contentImageWrap: {
        overflow: 'hidden',
        backgroundColor: BoxColor,
        borderRadius: 2
    },
    contentImage: {
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

export default memo(NFTItem, areEqual);
