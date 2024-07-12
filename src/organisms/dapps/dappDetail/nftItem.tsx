import SquareSkeleton from '@/components/skeleton/squareSkeleton';
import { BoxColor, Lato, TextCatTitleColor } from '@/constants/theme';
import { INFTProps } from '@/hooks/dapps/hooks';
import { fadeIn, fadeOut } from '@/util/animation';
import React, { useState, useRef, useEffect, memo } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

interface IProps {
    item: INFTProps;
    size: number;
    moveToNFTDetail: (id: string) => void;
}

const NFTItem = ({ item, size, moveToNFTDetail }: IProps) => {

    return (
        <TouchableOpacity style={[styles.contentWrap, { width: size }]} onPress={() => moveToNFTDetail(item.id)}>
            <View style={{ paddingHorizontal: 10 }}>
                <View style={[styles.contentImageWrap, { width: '100%', height: size - 20 }]}>
                    <FastImage
                        style={styles.contentImage}
                        resizeMode="contain"
                        source={{
                            uri: item.image,
                            priority: FastImage.priority.low,
                        }}
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
