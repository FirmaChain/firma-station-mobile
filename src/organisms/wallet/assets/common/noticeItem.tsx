import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BgColor, Lato, TextCatTitleColor } from '@/constants/theme';

interface IProps {
    notification: string;
}

const NoticeItem = ({ notification }: IProps) => {
    return (
        <View style={styles.notice}>
            <Text style={styles.noticeText}>{notification}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    notice: {
        backgroundColor: BgColor,
        paddingTop: 60,
        borderTopEndRadius: 0,
        borderTopStartRadius: 0,
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noticeText: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor,
        textAlign: 'center',
        lineHeight: 20
    }
});

export default memo(NoticeItem);
