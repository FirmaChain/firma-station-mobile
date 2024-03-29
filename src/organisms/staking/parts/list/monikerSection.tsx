import React, { useState } from 'react';
import { ForwardArrow } from '@/components/icon/icon';
import { DarkGrayColor, Lato, TextColor } from '@/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';
import { VALIDATOR_PROFILE } from '@/constants/images';
import FastImage from 'react-native-fast-image';

interface IProps {
    validator: {
        avatarURL: string;
        moniker: string;
    };
}

const MonikerSection = ({ validator }: IProps) => {
    const [avatarError, setAvatarError] = useState(false);

    return (
        <View style={[styles.vdWrapperH, { alignItems: 'center' }]}>
            <View style={styles.monikerWrapperH}>
                <FastImage
                    style={styles.avatar}
                    onError={() => {
                        setAvatarError(true);
                    }}
                    source={
                        avatarError || validator.avatarURL === null || validator.avatarURL === ''
                            ? VALIDATOR_PROFILE
                            : { uri: validator.avatarURL, priority: FastImage.priority.low }
                    }
                />
                <Text numberOfLines={1} ellipsizeMode="middle" style={styles.moniker}>
                    {validator.moniker}
                </Text>
            </View>
            <ForwardArrow size={24} color={DarkGrayColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    monikerWrapperH: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 20,
        borderRadius: 50
    },
    avatar: {
        width: 32,
        maxWidth: 32,
        height: 32,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 10
    },
    moniker: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: '600',
        color: TextColor
    },
    icon: {
        marginRight: 10
    }
});

export default MonikerSection;
