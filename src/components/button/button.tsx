import { BorderColor, DisableColor, Lato, PointColor, TextColor, TextDisableColor, TextGrayColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface IProps {
    title: string;
    active: boolean;
    border?: boolean;
    borderColor?: string;
    borderTextColor?: string;
    onPressEvent: () => void;
}

const Button = ({ title, active, border = false, borderColor = BorderColor, borderTextColor = TextGrayColor, onPressEvent }: IProps) => {
    return (
        <TouchableOpacity
            disabled={!active}
            onPress={() => onPressEvent()}
            style={[
                styles.button,
                !active ? styles.disableButton : border ? [styles.borderButton, { borderColor: borderColor }] : styles.blueButton
            ]}
        >
            <Text style={[styles.text, !active ? { color: TextDisableColor } : border ? { color: borderTextColor } : { color: TextColor }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        minHeight: 56,
        maxHeight: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    disableButton: {
        backgroundColor: DisableColor
    },
    blueButton: {
        backgroundColor: PointColor
    },
    borderButton: {
        borderWidth: 1
    },
    text: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center'
    }
});
