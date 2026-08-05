import { BgColor, DividerColor } from '@/constants/theme';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { type DimensionValue, View } from 'react-native';

interface IProps {
    width?: DimensionValue;
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
