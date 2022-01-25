import React from 'react';
import { ForwardArrow, Person } from '@/components/icon/icon';
import { DarkGrayColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
    validator: {
        avatarURL: string;
        moniker: string;
    };
}

const MonikerSection = ({validator}:Props) => {
  return (
    <View style={[styles.vdWrapperH, {alignItems: "center", paddingVertical: 10}]}>
        <View style={styles.moniikerWrapperH}>
            {validator.avatarURL?
            <Image
                style={styles.avatar}
                source={{uri: validator.avatarURL}}/>
            :
            <View style={styles.icon}>
                <Person size={32} color={WhiteColor}/>
            </View>
            }
            <Text numberOfLines={1} ellipsizeMode='middle' style={styles.moniker}>{validator.moniker}</Text>
        </View>
        <ForwardArrow size={24} color={DarkGrayColor}/>
    </View>
  )
}

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    moniikerWrapperH: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 20,
    },
    avatar: {
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

export default MonikerSection;
