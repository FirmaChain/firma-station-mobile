import { BoxColor, Lato, TextColor } from '@/constants/theme';
import { ScreenWidth } from '@/util/getScreenSize';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    mnemonicItems: string[];
    onPressEvent: (index: number) => void;
}

const MnemonicItems = ({ mnemonicItems, onPressEvent }: IProps) => {
    return (
        <View style={styles.conatainer}>
            {mnemonicItems.map((item, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => onPressEvent(index)}>
                        <Text style={[styles.item, { width: ScreenWidth() / 3 - 20 }]}>{item}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default MnemonicItems;

const styles = StyleSheet.create({
    conatainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        marginVertical: 5,
        paddingVertical: 13,
        borderRadius: 4,
        fontFamily: Lato,
        backgroundColor: BoxColor,
        color: TextColor,
        textAlign: 'center',
        fontSize: 16,
        overflow: 'hidden'
    }
});
