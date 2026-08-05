import { BgColor, DividerColor } from '@/constants/theme';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View, type DimensionValue } from 'react-native';

interface IProps {
    width: DimensionValue;
    height: DimensionValue;
    marginBottom?: number;
    bgColor?: string;
}

const RectangleSkeleton = ({ width, height, marginBottom = 0, bgColor = BgColor }: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { width: width, height: height, marginBottom: marginBottom }
    } as const;

    return (
        <View style={inlineStyles1.inlineStyle1}>
            <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={bgColor}>
                <Rect x="0" y="0" rx="8" ry="8" width={'100%'} height={'100%'} />
            </ContentLoader>
        </View>
    );
};

export default RectangleSkeleton;
