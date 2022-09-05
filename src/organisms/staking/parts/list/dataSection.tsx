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
        <View style={styles.vdWrapperH}>
            <Text style={styles.descTitle}>{title}</Text>
            <Text style={[label ? styles.descLabel : styles.descItem, { color: color }, label && { backgroundColor: color + '30' }]}>
                {data}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    vdWrapperH: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    descTitle: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextDisableColor
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
