import { DisableColor, Lato, TextColor } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    name: string;
    address: string;
}

const DappWalletInfoBox = ({ name, address }: IProps) => {
    return (
        <View style={styles.infoBox}>
            <View style={[styles.boxV, { alignItems: 'flex-start' }]}>
                <View style={{ flexDirection: 'row', paddingBottom: 8 }}>
                    <Text style={[styles.address, { flex: 1 }]}>{'Wallet : '}</Text>
                    <Text style={[styles.address, { flex: 3 }]} numberOfLines={1} ellipsizeMode="middle">
                        {name}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.address, { flex: 1 }]}>{'Address : '}</Text>
                    <Text style={[styles.address, { flex: 3 }]} numberOfLines={1} ellipsizeMode="middle">
                        {address}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoBox: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: DisableColor
    },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    },
    address: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    }
});

export default DappWalletInfoBox;
