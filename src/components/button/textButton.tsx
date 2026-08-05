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

    const inlineStyles1 = {
        inlineStyle1: { flexDirection: 'row' },
        inlineStyle2: { backgroundColor: backgroundColor },
        inlineStyle3: { flexDirection: 'row' },
        inlineStyle4: { backgroundColor: backgroundColor }
    } as const;

    return (
        <>
            {opacity ? (
                <TouchableOpacity disabled={!active} style={inlineStyles1.inlineStyle1} onPress={() => handleOnPress()}>
                    <Text style={[styles.title, styles.button, inlineStyles1.inlineStyle2]}>{title}</Text>
                </TouchableOpacity>
            ) : (
                <Pressable disabled={!active} style={inlineStyles1.inlineStyle3} onPress={() => handleOnPress()}>
                    <Text style={[styles.title, styles.button, inlineStyles1.inlineStyle4]}>{title}</Text>
                </Pressable>
            )}
        </>
    );
};

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

export default TextButton;
