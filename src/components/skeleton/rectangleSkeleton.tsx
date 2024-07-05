import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { BgColor, DividerColor } from '@/constants/theme';
import { View } from 'react-native';

interface IProps {
    width: number | string;
    height: number | string;
    marginBottom?: number;
    bgColor?: string;
}

const RectangleSkeleton = ({ width, height, marginBottom = 0, bgColor = BgColor }: IProps) => {
    return (
        <View style={{ width: width, height: height, marginBottom: marginBottom }}>
            <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={bgColor}>
                <Rect x="0" y="0" rx="8" ry="8" width={'100%'} height={'100%'} />
            </ContentLoader>
        </View>
    );
};

export default RectangleSkeleton;
