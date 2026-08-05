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
    const inlineStyles1 = {
        inlineStyle1: { borderColor: borderColor },
        inlineStyle2: { color: TextDisableColor },
        inlineStyle3: { color: borderTextColor },
        inlineStyle4: { color: TextColor }
    } as const;

    return (
        <TouchableOpacity
            disabled={!active}
            onPress={() => onPressEvent()}
            style={[
                styles.button,
                !active ? styles.disableButton : border ? [styles.borderButton, inlineStyles1.inlineStyle1] : styles.blueButton
            ]}
        >
            <Text
                style={[
                    styles.text,
                    !active ? inlineStyles1.inlineStyle2 : border ? inlineStyles1.inlineStyle3 : inlineStyles1.inlineStyle4
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

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

export default Button;
