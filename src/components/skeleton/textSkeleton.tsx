import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { BgColor, BoxColor, BoxDarkColor, DividerColor } from '@/constants/theme';
import { View } from 'react-native';

interface IProps {
    width?: number | string;
    height: number;
}

const TextSkeleton = ({ width = '100%', height }: IProps) => {
    return (
        <View style={{ width: '100%', height: height, alignItems: 'center' }}>
            <ContentLoader
                speed={0.8}
                animate={true}
                foregroundColor={DividerColor}
                backgroundColor={BgColor}
                style={{ width: width, height: height }}
            >
                <Rect x="0" y="0" rx="4" ry="4" width={'100%'} height={height} />
            </ContentLoader>
        </View>
    );
};

export default TextSkeleton;
