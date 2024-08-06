import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { Lato, TextDisableColor } from '@/constants/theme';

interface IProps {
    title: string;
    data: string;
    color?: string;
    label?: boolean;
}

const DataSection = ({ title, data, color = TextDisableColor, label = false }: IProps) => {
    return (
        <View style={[styles.vdWrapperH, { alignItems: label ? 'flex-start' : 'center' }]}>
            <Text style={[styles.descTitle, { paddingTop: label ? 3 : 0 }]}>{title}</Text>
            <Text style={[label ? styles.descLabel : styles.descItem, { color: color }, label && { flexShrink: 1, backgroundColor: color + '30' }]}>
                {data}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    descTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDisableColor,
        minWidth: 80
    },
    descItem: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: '600'
    },
    descLabel: {
        fontFamily: Lato,
        fontSize: 14,
        borderRadius: 10,
        textAlign: 'center',
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingVertical: 3
    }
});

export default DataSection;