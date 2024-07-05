import React, { Fragment, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Lato, TextColor, TextDarkGrayColor } from '@/constants/theme';
import { convertNumber } from '@/util/common';

interface IProps {
    title: string;
    descExist: boolean;
    desc?: string;
    iconURL: string;
}

const DappTitleBox = ({ title, descExist, desc = '', iconURL }: IProps) => {
    const [iconHeight, setIconHeight] = useState(0);

    useEffect(() => {
        if (iconURL !== '') {
            Image.getSize(
                iconURL,
                (width, height) => {
                    let ratio = convertNumber(height / width);
                    setIconHeight(115 * ratio);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }, [iconURL]);

    return (
        <Fragment>
            {iconURL !== '' && (
                <View style={styles.logoBox}>
                    <Image style={{ width: 115, height: iconHeight, resizeMode: 'contain', borderRadius: 10 }} source={{ uri: iconURL }} />
                </View>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={[styles.desc, { display: descExist ? 'flex' : 'none' }]}>{desc}</Text>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    logoBox: {
        paddingVertical: 20
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
