import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { BgColor, DividerColor } from '@/constants/theme';
import { View } from 'react-native';

interface IProps {
    size: number;
    marginBottom: number;
    bgColor?: string;
}

const SquareSkeleton = ({ size, marginBottom, bgColor = BgColor }: IProps) => {
    return (
        <View style={{ width: size, height: size, marginBottom: marginBottom }}>
            <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={bgColor}>
                <Rect x="0" y="0" rx="8" ry="8" width={'100%'} height={'100%'} />
            </ContentLoader>
        </View>
    );
};

export default SquareSkeleton;
