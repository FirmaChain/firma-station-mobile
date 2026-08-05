import { DisableColor, Lato, TextColor } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
    name: string;
    address: string;
}

const DappWalletInfoBox = ({ name, address }: IProps) => {
    return (
        <View style={styles.infoBox}>
            <View style={[styles.boxV, styles.inlineStyle1]}>
                <View style={styles.inlineStyle2}>
                    <Text style={[styles.address, styles.inlineStyle3]}>{'Wallet : '}</Text>
                    <Text style={[styles.address, styles.inlineStyle4]} numberOfLines={1} ellipsizeMode="middle">
                        {name}
                    </Text>
                </View>
                <View style={styles.inlineStyle5}>
                    <Text style={[styles.address, styles.inlineStyle6]}>{'Address : '}</Text>
                    <Text style={[styles.address, styles.inlineStyle7]} numberOfLines={1} ellipsizeMode="middle">
                        {address}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { alignItems: 'flex-start' },
    inlineStyle2: { flexDirection: 'row', paddingBottom: 8 },
    inlineStyle3: { flex: 1 },
    inlineStyle4: { flex: 3 },
    inlineStyle5: { flexDirection: 'row' },
    inlineStyle6: { flex: 1 },
    inlineStyle7: { flex: 3 },
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
