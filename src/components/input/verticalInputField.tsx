import React, { ReactNode, useState } from 'react';
import {
    InputBgColor,
    InputPlaceholderColor,
    Lato,
    PointLightColor,
    TextCatTitleColor,
    TextColor,
    TextGrayColor,
    TextWarnColor,
    WhiteColor
} from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

type VerticalInputFieldProps = Omit<TextInputProps, 'value' | 'onChangeText' | 'onFocus' | 'onBlur' | 'style'> & {
    title: string;
    value: string;
    onChangeEvent: (value: string) => void;
    rightContent?: ReactNode;
    message?: string;
    messageColor?: string;
    messageStyle?: StyleProp<TextStyle>;
    messageContainerStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    bgColor?: string;
    accent?: boolean;
    inputHeight?: number;
    editable?: boolean;
};

const VerticalInputField = ({
    title,
    value,
    onChangeEvent,
    rightContent,
    message,
    messageColor = TextWarnColor,
    messageStyle,
    messageContainerStyle,
    containerStyle,
    inputStyle,
    bgColor = InputBgColor,
    accent = false,
    inputHeight,
    editable = true,
    placeholderTextColor = InputPlaceholderColor,
    keyboardType = 'default',
    ...inputProps
}: VerticalInputFieldProps) => {
    const isLoading = useAppSelector((state) => state.common.loading);
    const [focus, setFocus] = useState(false);

    const inlineStyles = {
        background: { backgroundColor: bgColor },
        inputHeight: inputHeight === undefined ? undefined : { height: inputHeight },
        focus: { borderColor: focus ? WhiteColor : 'transparent' },
        message: { color: messageColor }
    } as const;

    return (
        <View style={[styles.viewContainer, containerStyle]}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
                {rightContent}
            </View>
            <TextInput
                {...inputProps}
                style={[
                    styles.input,
                    inlineStyles.background,
                    inlineStyles.inputHeight,
                    accent ? styles.accentInput : inlineStyles.focus,
                    inputStyle
                ]}
                placeholderTextColor={placeholderTextColor}
                keyboardType={keyboardType}
                value={value}
                selectionColor={TextGrayColor}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChangeText={onChangeEvent}
                editable={editable && !isLoading}
            />
            {message !== undefined && (
                <View style={[styles.messageContainer, messageContainerStyle]}>
                    <Text style={[styles.message, inlineStyles.message, messageStyle]}>{message}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        paddingBottom: 8
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 8
    },
    messageContainer: {
        height: 17,
        alignItems: 'flex-end'
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor
    },
    message: {
        fontSize: 14,
        fontFamily: Lato,
        textAlign: 'right'
    },
    input: {
        color: TextColor,
        paddingHorizontal: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 5
    },
    accentInput: {
        borderColor: PointLightColor
    }
});

export default VerticalInputField;
