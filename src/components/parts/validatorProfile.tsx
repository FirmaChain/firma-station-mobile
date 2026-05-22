import { useState } from 'react';
import ProfileIcon from '@/assets/icons/material/profile.svg';
import { TextColor } from '@/constants/theme';
import FastImage from '@d11/react-native-fast-image';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const ValidatorProfile = ({ uri, size, customStyle }: { uri: string; size: number; customStyle?: StyleProp<ViewStyle> }) => {
    const [error, setError] = useState(false);
    return (
        <View style={[style.container, { width: size, height: size }, customStyle]}>
            {error && <ProfileIcon width={size} height={size} color={TextColor} style={style.placeholder} />}
            <FastImage
                source={{ uri: uri?.trim(), priority: FastImage.priority.low }}
                style={{ width: size, height: size, borderRadius: size }}
                onError={() => setError(true)}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        overflow: 'hidden',
        inset: 0,
        position: 'relative',
        display: 'flex'
    },
    placeholder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        inset: 0
    }
});

export default ValidatorProfile;
