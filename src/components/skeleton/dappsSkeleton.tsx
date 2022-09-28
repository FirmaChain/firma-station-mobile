import React from 'react';
import { StyleSheet, View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { BoxColor, DividerColor } from '@/constants/theme';

interface IProps {
    volumes: number;
    size: number;
}

const DappsSkeleton = ({ volumes, size }: IProps) => {
    let skeleton = Array.from({ length: volumes });
    return (
        <React.Fragment>
            {skeleton.map((item, index) => {
                return (
                    <View key={index} style={[styles.contentWrap, { width: size }]}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={BoxColor}>
                                <Rect x="0" y="0" rx="8" ry="8" width={'100%'} height={size - 20} />
                                {/* <Rect x="0" y={size - 10} rx="4" ry="4" width={'100%'} height={15} /> */}
                            </ContentLoader>
                        </View>
                    </View>
                );
            })}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    contentWrap: {
        marginBottom: 20
    }
});

export default DappsSkeleton;
