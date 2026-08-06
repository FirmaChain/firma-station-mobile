import React, { useMemo } from 'react';
import { BgColor, DisableButtonColor, Lato, PointColor, TextColor, TextDarkGrayColor, WhiteColor } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    title: string;
    onPressEvent: () => void;
    size?: number;
    height?: number;
    color?: string;
    active?: boolean;
    border?: boolean;
    disableColor?: string;
    disableTextColor?: string;
}

const SmallButton = ({
    title,
    onPressEvent,
    size = 100,
    height = 42,
    color = PointColor,
    active = true,
    border = false,
    disableColor = DisableButtonColor,
    disableTextColor = TextDarkGrayColor
}: IProps) => {
    const handleOnPress = () => {
        if (active) onPressEvent();
    };

    const buttonColor = useMemo(() => {
        if (active) {
            if (border) {
                const bcakgroundColor = color === PointColor && border ? BgColor : color;
                return {
                    background: bcakgroundColor,
                    textColor: TextColor
                };
            } else {
                return {
                    background: color,
                    textColor: TextColor
                };
            }
        } else {
            return {
                background: disableColor,
                textColor: disableTextColor
            };
        }
    }, [active, active, border, color]);

    const inlineStyles1 = {
        inlineStyle1: {
            width: size,
            height,
            borderWidth: border && active ? 1 : 0,
            borderColor: WhiteColor,
            backgroundColor: buttonColor.background
        },
        inlineStyle2: { color: buttonColor.textColor }
    } as const;

    return (
        <View>
            <TouchableOpacity disabled={!active} style={[styles.button, inlineStyles1.inlineStyle1]} onPress={() => handleOnPress()}>
                <Text style={[styles.buttonText, inlineStyles1.inlineStyle2]}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 42,
        overflow: 'hidden',
        borderRadius: 4,
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: Lato,
        color: TextColor,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '400'
    }
});

export default SmallButton;
