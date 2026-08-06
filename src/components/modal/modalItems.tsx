import React, { useState } from 'react';
import { BgColor, BoxDarkColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radio } from '../icon/icon';

interface IProps {
    initVal: number;
    data: string[];
    subData?: string[];
    onPressEvent: (index: number) => void;
}

const ModalItems = ({ initVal, data, subData, onPressEvent }: IProps) => {
    const [selected, setSelected] = useState(initVal);

    const handleSelect = (index: number) => {
        onPressEvent(index);
        setSelected(index);
    };

    return (
        <ScrollView style={styles.modalContainer}>
            {data.map((item, index) => {
                return (
                    <Pressable key={index} style={styles.modalContentBox} onPress={() => handleSelect(index)}>
                        <View style={styles.itemWrapper}>
                            <Text style={styles.itemTitle}>{item}</Text>
                            {subData && <Text style={styles.itemSubTitle}>{subData[index]}</Text>}
                        </View>
                        <Radio size={20} color={WhiteColor} active={index === selected} />
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        marginBottom: Platform.select({ android: 0, ios: 25 }),
        maxHeight: 500,
        backgroundColor: BoxDarkColor
    },
    modalContentBox: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 1,
        backgroundColor: BgColor
    },
    itemWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start'
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        fontWeight: '400',
        color: TextColor
    },
    itemSubTitle: {
        fontFamily: Lato,
        fontSize: 11,
        fontWeight: '400',
        color: TextColor,
        opacity: 0.5,
        paddingLeft: 5,
        paddingBottom: 1
    }
});

export default ModalItems;
