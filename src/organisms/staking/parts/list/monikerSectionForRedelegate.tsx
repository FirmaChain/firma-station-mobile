import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DarkGrayColor, Lato, TextColor, TextDarkGrayColor, TextDisableColor } from '@/constants/theme';
import { ForwardArrow, ForwardArrowWithTail } from '@/components/icon/icon';
import { IRedelegationInfo } from '@/hooks/staking/hooks';
import { VALIDATOR_PROFILE } from '@/constants/images';

interface IProps {
    validators: IRedelegationInfo;
    navigateValidator: Function;
}

const MonikerSectionForRedelegate = ({ validators, navigateValidator }: IProps) => {
    const [srcAvatarError, setSrcAvatarError] = useState(false);
    const [dstAvatarError, setDstAvatarError] = useState(false);
    return (
        <View style={[styles.vdWrapperH, { alignItems: 'center' }]}>
            <TouchableOpacity style={styles.monikerWrapperH} onPress={() => navigateValidator(validators.srcAddress)}>
                <Image
                    style={styles.avatar}
                    onError={() => {
                        setSrcAvatarError(true);
                    }}
                    source={
                        srcAvatarError || validators.srcAvatarURL === null || validators.srcAvatarURL === ''
                            ? VALIDATOR_PROFILE
                            : { uri: validators.srcAvatarURL }
                    }
                />
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.moniker}>
                    {validators.srcMoniker}
                </Text>
            </TouchableOpacity>
            <View style={{ paddingRight: 5 }}>
                <ForwardArrowWithTail size={20} color={TextDarkGrayColor} />
            </View>
            <TouchableOpacity style={styles.monikerWrapperH} onPress={() => navigateValidator(validators.dstAddress)}>
                <Image
                    style={styles.avatar}
                    onError={() => {
                        setDstAvatarError(true);
                    }}
                    source={
                        dstAvatarError || validators.dstAvatarURL === null || validators.dstAvatarURL === ''
                            ? VALIDATOR_PROFILE
                            : { uri: validators.dstAvatarURL }
                    }
                />
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.moniker}>
                    {validators.dstMoniker}
                </Text>
            </TouchableOpacity>
            <ForwardArrow size={24} color={DarkGrayColor} />
        </View>
    );
};

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    vdWrapper: {
        flex: 1,
        alignItems: 'flex-start'
    },
    desc: {
        fontFamily: Lato,
        fontSize: 12,
        color: TextDisableColor
    },
    monikerWrapperH: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 5,
        paddingVertical: 6
    },
    avatar: {
        flex: 1,
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

export default MonikerSectionForRedelegate;
