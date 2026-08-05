import { BgColor, BoxColor, Lato, TextColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    handleDisconnect: () => void;
}

const Disconnect = ({ handleDisconnect }: IProps) => {
    return (
        <TouchableOpacity onPress={() => handleDisconnect()}>
            <View style={[styles.listItem, styles.inlineStyle1]}>
                <Text style={[styles.itemTitle, styles.inlineStyle2]}>Disconnect</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { justifyContent: 'center' },
    inlineStyle2: { fontWeight: 'bold' },
    listItem: {
        backgroundColor: BoxColor,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: BgColor
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    }
});

export default Disconnect;
