import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BoxColor, Lato, TextCatTitleColor } from '@/constants/theme';
import { ForwardArrow } from '@/components/icon/icon';

interface IProps {
    handleAssets: () => void;
}

const AssetsBox = ({ handleAssets }: IProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.box, { paddingHorizontal: 0 }]} onPress={handleAssets}>
                <View style={[styles.wrapperH, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }]}>
                    <Text style={styles.title}>Assets</Text>
                    <ForwardArrow size={20} color={TextCatTitleColor} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        paddingHorizontal: 20,
        marginVertical: 16
    },
    box: {
        borderRadius: 8,
        backgroundColor: BoxColor,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 30
    },
    wrapperH: {
        flexDirection: 'row'
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: 'bold',
        color: TextCatTitleColor
    },
});

export default AssetsBox;
