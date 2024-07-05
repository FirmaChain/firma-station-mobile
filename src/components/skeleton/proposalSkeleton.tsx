import React from 'react';
import { StyleSheet } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { BoxColor, DividerColor } from '@/constants/theme';

interface IProps {
    volumes: number;
}

const ProposalSkeleton = ({ volumes }: IProps) => {
    let skeleton = Array.from({ length: volumes });
    return (
        <React.Fragment>
            {skeleton.map((item, index) => {
                return (
                    <ContentLoader
                        key={index}
                        speed={0.8}
                        animate={true}
                        foregroundColor={DividerColor}
                        backgroundColor={BoxColor}
                        style={styles.item}
                    >
                        <Rect x="0" y="0" rx="4" ry="4" width="100%" height={'100%'} />
                    </ContentLoader>
                );
            })}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    item: {
        height: 130,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 26,
        backgroundColor: BoxColor,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12
    }
});

export default ProposalSkeleton;
