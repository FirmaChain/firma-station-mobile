import React from 'react';
import { ICON_CERTIFIED_SITE } from '@/constants/images';
import { BgColor, Lato, TextCatTitleColor } from '@/constants/theme';
import FastImage from '@d11/react-native-fast-image';
import { StyleSheet, Text, View } from 'react-native';

import { URLLockIcon } from '@/components/icon/icon';

interface IProps {
    certifiedState: number;
    url: string;
}

const DappURLBox = ({ certifiedState, url }: IProps) => {
    return (
        <View style={styles.urlBox}>
            {certifiedState === 1 && (
                <View style={{ paddingVertical: 3, paddingHorizontal: 5 }}>
                    <URLLockIcon size={16} color={TextCatTitleColor} />
                </View>
            )}
            {certifiedState === 2 && <FastImage style={{ width: 18, height: 18 }} source={ICON_CERTIFIED_SITE} />}
            <Text style={[styles.url, { paddingBottom: 0, paddingHorizontal: 5 }]} numberOfLines={1} ellipsizeMode={'middle'}>
                {url}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    urlBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: BgColor
    },
    url: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: 'bold',
        color: TextCatTitleColor
    }
});

export default DappURLBox;
