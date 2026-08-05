import { useState } from 'react';
import ProfileIcon from '@/assets/icons/material/profile.svg';
import { TextColor } from '@/constants/theme';
import FastImage from '@d11/react-native-fast-image';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const ValidatorProfile = ({ uri, size, customStyle }: { uri: string; size: number; customStyle?: StyleProp<ViewStyle> }) => {
    const [error, setError] = useState(false);
    const inlineStyles1 = {
        inlineStyle1: { width: size, height: size },
        inlineStyle2: { width: size, height: size, borderRadius: size }
    } as const;

    return (
        <View style={[styles.inlineStyle1, inlineStyles1.inlineStyle1, customStyle]}>
            {error && <ProfileIcon width={size} height={size} color={TextColor} style={styles.inlineStyle2} />}
            <FastImage
                source={{ uri: uri?.trim(), priority: FastImage.priority.low }}
                style={inlineStyles1.inlineStyle2}
                onError={() => setError(true)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: {
        overflow: 'hidden',
        inset: 0,
        position: 'relative',
        display: 'flex'
    },
    inlineStyle2: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        inset: 0
    }
});

export default ValidatorProfile;
