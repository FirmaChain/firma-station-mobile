import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DarkGrayColor, Lato, TextColor, TextDarkGrayColor, TextDisableColor, WhiteColor } from '@/constants/theme';
import { ForwardArrow, ForwardArrowWithTail, Person } from '@/components/icon/icon';
import { RedelegationInfo } from '@/hooks/staking/hooks';

interface Props {
    validators: RedelegationInfo;
    navigateValidator: Function;
}

const MonikerSectionForRedelegate = ({validators, navigateValidator}:Props) => {
  return (
    <View style={[styles.vdWrapperH, {alignItems: "center"}]}>
        <TouchableOpacity style={styles.moniikerWrapperH} onPress={()=>navigateValidator(validators.srcAddress)}>
            {validators.srcAvatarURL?
            <Image
                style={styles.avatar}
                source={{uri: validators.srcAvatarURL}}/>
            :
            <View style={styles.icon}>
                <Person size={32} color={WhiteColor}/>
            </View>
            }
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.moniker}>{validators.srcMoniker}</Text>
        </TouchableOpacity>
        <View style={{paddingRight: 5}}>
            <ForwardArrowWithTail size={20} color={TextDarkGrayColor} />
        </View>
        <TouchableOpacity style={styles.moniikerWrapperH} onPress={()=>navigateValidator(validators.dstAddress)}>
            {validators.dstAvatarURL?
            <Image
                style={styles.avatar}
                source={{uri: validators.dstAvatarURL}}/>
            :
            <View style={styles.icon}>
                <Person size={32} color={WhiteColor}/>
            </View>
            }
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.moniker}>{validators.dstMoniker}</Text>
        </TouchableOpacity>
        <ForwardArrow size={24} color={DarkGrayColor}/>
    </View>
  )
}

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    vdWrapper: {
        flex: 1,
        alignItems: 'flex-start',
    },
    desc: {
        fontFamily: Lato,
        fontSize: 12,
        color: TextDisableColor,
    },
    moniikerWrapperH: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 5,
        paddingVertical: 6,
    },
    avatar: {
        flex: 1,
        width: 32,
        maxWidth: 32,
        height: 32,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 10,
    },
    moniker: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "600",
        color: TextColor,
    },
    icon: {
        marginRight: 10,
    },
});

export default MonikerSectionForRedelegate;
