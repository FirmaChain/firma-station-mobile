import React, { Fragment } from 'react';
import { Lato, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';

interface IProps {
    title: string;
    descExist: boolean;
    desc?: string;
    iconURL: string;
}

const DappTitleBox = ({ title, descExist, desc = '', iconURL }: IProps) => {
    const inlineStyles1 = {
        inlineStyle1: { display: descExist ? 'flex' : 'none' }
    } as const;

    return (
        <Fragment>
            {iconURL !== '' && (
                <View style={styles.logoBox}>
                    <Image style={styles.logo} source={{ uri: iconURL }} />
                </View>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.desc, inlineStyles1.inlineStyle1]}>{desc}</Text>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    logoBox: {
        paddingVertical: 20
    },
    logo: {
        width: 115,
        height: 115,
        resizeMode: 'contain',
        borderRadius: 10
    },
    title: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: '400',
        color: TextColor,
        paddingBottom: 20
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor
    }
});

export default DappTitleBox;
