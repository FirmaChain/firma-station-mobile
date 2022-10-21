import React from 'react';
import { View } from 'react-native';
import { BgColor, DividerColor } from '@/constants/theme';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface IProps {
    size: number;
    marginBottom: number;
    bgColor?: string;
}

const CircleSkeleton = ({ size, marginBottom, bgColor = BgColor }: IProps) => {
    return (
        <View style={{ width: size, height: size, marginBottom: marginBottom }}>
            <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={bgColor}>
                <Rect x="0" y="0" rx="50" ry="50" width={'100%'} height={'100%'} />
            </ContentLoader>
        </View>
    );
};

export default CircleSkeleton;
