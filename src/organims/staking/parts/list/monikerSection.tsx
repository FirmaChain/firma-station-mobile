import React from 'react';
import { ForwardArrow } from '@/components/icon/icon';
import { DarkGrayColor, Lato, TextColor } from '@/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
    validator: any;
}

const MonikerSection = ({validator}:Props) => {
  return (
    <View style={[styles.vdWrapperH, {alignItems: "center", paddingVertical: 10}]}>
        <View style={styles.moniikerWrapperH}>
            {validator.validatorAvatar?
            <Image
                style={styles.avatar}
                source={{uri: validator.validatorAvatar}}/>
            :
            <Icon style={styles.icon} name="person" size={32} />
            }
            <Text style={styles.moniker}>{validator.validatorMoniker}</Text>
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
