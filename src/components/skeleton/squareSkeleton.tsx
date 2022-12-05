import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { BgColor, DividerColor } from '@/constants/theme';
import { View } from 'react-native';

interface IProps {
    size: number;
    marginBottom: number;
    bgColor?: string;
    borderRadius?: number;
}

const SquareSkeleton = ({ size, marginBottom, bgColor = BgColor, borderRadius = 8 }: IProps) => {
    return (
        <View style={{ width: size, height: size, marginBottom: marginBottom }}>
            <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={bgColor}>
                <Rect x="0" y="0" rx={`${borderRadius}`} ry={`${borderRadius}`} width={'100%'} height={'100%'} />
            </ContentLoader>
        </View>
    );
};

export default SquareSkeleton;
