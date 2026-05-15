import { DisableColor, Lato, TextButtonColor, TextColor } from '@/constants/theme';
import { Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface IProps {
    title: string;
    bgColor?: string;
    active?: boolean;
    opacity?: boolean;
    onPressEvent: () => void;
}

const TextButton = ({ title, bgColor = TextButtonColor, active = true, opacity = true, onPressEvent }: IProps) => {
    const backgroundColor = active ? (bgColor ? bgColor : TextButtonColor) : DisableColor;

    const handleOnPress = () => onPressEvent();

    return (
        <>
            {opacity ? (
                <TouchableOpacity disabled={!active} style={{ flexDirection: 'row' }} onPress={() => handleOnPress()}>
                    <Text style={[styles.title, styles.button, { backgroundColor: backgroundColor }]}>{title}</Text>
                </TouchableOpacity>
            ) : (
                <Pressable disabled={!active} style={{ flexDirection: 'row' }} onPress={() => handleOnPress()}>
                    <Text style={[styles.title, styles.button, { backgroundColor: backgroundColor }]}>{title}</Text>
                </Pressable>
            )}
        </>
    );
};

export default TextButton;

const styles = StyleSheet.create({
    title: {
        color: TextColor,
        fontFamily: Lato,
        fontSize: 14
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: 'hidden'
    }
});
