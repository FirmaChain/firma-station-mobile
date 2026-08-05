import { BoxColor, Lato, TextCatTitleColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ForwardArrow } from '@/components/icon/icon';

interface IProps {
    handleAssets: () => void;
}

const AssetsBox = ({ handleAssets }: IProps) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.box, styles.inlineStyle1]} onPress={handleAssets}>
                <View style={[styles.wrapperH, styles.inlineStyle2]}>
                    <Text style={styles.title}>Assets</Text>
                    <ForwardArrow size={20} color={TextCatTitleColor} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { paddingHorizontal: 0 },
    inlineStyle2: { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
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
    }
});

export default AssetsBox;
