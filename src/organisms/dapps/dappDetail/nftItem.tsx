import SquareSkeleton from '@/components/skeleton/squareSkeleton';
import { BoxColor, Lato, TextCatTitleColor } from '@/constants/theme';
import { INFTProps } from '@/hooks/dapps/hooks';
import { fadeIn, fadeOut } from '@/util/animation';
import React, { useState, useRef, useEffect, memo } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';

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
            : value as Source;
    };

    return (
        <TouchableOpacity activeOpacity={disabled ? 1 : 0.2} style={[styles.contentWrap, { width: size }]} onPress={() => moveToNFTDetail(item.id)}>
            <View style={{ paddingHorizontal: 10 }}>
                <View style={[styles.contentImageWrap, { width: '100%', height: size - 20 }]}>
                    <FastImage
                        style={styles.contentImage}
                        resizeMode="contain"
                        source={getImageSource(item.image)}
                    />
                </View>
                <Text style={[styles.contentTitle, { width: '100%' }]} numberOfLines={1}>
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

export default memo(NFTItem, areEqual);

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
