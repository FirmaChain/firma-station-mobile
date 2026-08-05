import { BgColor, DividerColor } from '@/constants/theme';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View, type DimensionValue } from 'react-native';

interface IProps {
    width?: DimensionValue;
    height: number;
}

const TextSkeleton = ({ width = '100%', height }: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { width: '100%', height: height, alignItems: 'center' },
        inlineStyle2: { width: width, height: height }
    } as const;

    return (
        <View style={inlineStyles1.inlineStyle1}>
            <ContentLoader
                speed={0.8}
                animate={true}
                foregroundColor={DividerColor}
                backgroundColor={BgColor}
                style={inlineStyles1.inlineStyle2}
            >
                <Rect x="0" y="0" rx="4" ry="4" width={'100%'} height={height} />
            </ContentLoader>
        </View>
    );
};

export default TextSkeleton;
