import { Fragment } from 'react';
import { BoxColor, DividerColor } from '@/constants/theme';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { StyleSheet, View } from 'react-native';

interface IProps {
    volumes: number;
}

const ProposalSkeleton = ({ volumes }: IProps) => {
    const skeleton = Array.from({ length: volumes });
    return (
        <Fragment>
            {skeleton.map((_, index) => {
                return (
                    <View style={styles.item} key={index}>
                        <ContentLoader speed={0.8} animate={true} foregroundColor={DividerColor} backgroundColor={BoxColor}>
                            <Rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
                        </ContentLoader>
                    </View>
                );
            })}
        </Fragment>
    );
};

const styles = StyleSheet.create({
    item: {
        height: 130,
        backgroundColor: BoxColor,
        overflow: 'hidden',
        marginBottom: 12,
        borderRadius: 8
    }
});

export default ProposalSkeleton;
