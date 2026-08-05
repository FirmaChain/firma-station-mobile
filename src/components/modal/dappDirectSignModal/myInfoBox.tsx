import { CHAIN_SYMBOL } from '@/constants/common';
import { AddressTextColor, Lato, TextDarkGrayColor } from '@/constants/theme';
import { convertCurrent } from '@/util/common';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    address: string;
    balance: number;
}

const MyInfoBox = ({ address, balance }: IProps) => {
    const _CHAIN_SYMBOL = CHAIN_SYMBOL();

    return (
        <View style={[styles.boxV, styles.inlineStyle1]}>
            <View style={[styles.boxH, styles.inlineStyle2]}>
                <Text style={styles.catTitle}>{'My Address'}</Text>
                <Text style={[styles.value, styles.inlineStyle3]} numberOfLines={1} ellipsizeMode={'middle'}>
                    {address}
                </Text>
            </View>
            <View style={[styles.boxH, styles.inlineStyle4]}>
                <Text style={styles.catTitle}>{'My Balance'}</Text>
                <Text style={[styles.value, styles.inlineStyle5]}>{`${convertCurrent(balance)} ${_CHAIN_SYMBOL}`}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingTop: 17, paddingBottom: 30 },
    inlineStyle2: { width: '100%', justifyContent: 'space-between', paddingBottom: 12 },
    inlineStyle3: { color: AddressTextColor },
    inlineStyle4: { width: '100%', justifyContent: 'space-between' },
    inlineStyle5: { color: AddressTextColor },
    boxH: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    boxV: {
        width: '100%',
        alignItems: 'flex-start'
    },
    catTitle: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor
    },
    value: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 14,
        color: TextDarkGrayColor,
        textAlign: 'right'
    }
});

export default MyInfoBox;
