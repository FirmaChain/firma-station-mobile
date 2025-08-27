import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
    InputBgColor,
    InputPlaceholderColor,
    Lato,
    PointLightColor,
    TextCatTitleColor,
    TextColor,
    TextGrayColor,
    TextWarnColor,
    WhiteColor,
} from '@/constants/theme';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';

interface IProps {
    title: string;
    value: string;
    message?: string;
    numberOnly?: boolean;
    validation?: boolean;
    placeholder: string;
    bgColor?: string;
    secure?: boolean;
    accent?: boolean;
    forcedValue?: string;
    resetValues?: boolean;
    onChangeEvent: (value: string) => void;
}

const InputSetVertical = ({
    title,
    value,
    message,
    numberOnly = false,
    validation,
    placeholder,
    bgColor = InputBgColor,
    secure = false,
    accent = false,
    forcedValue = '',
    resetValues = false,
    onChangeEvent,
}: IProps) => {
    const isLoading = useSelector((v: rootState) => v.common.loading);

    const [val, setVal] = useState(value);
    const [focus, setFocus] = useState(false);

    const handleInputChange = (value: string) => {
        if (value.includes('/')) return;
        setVal(value);
        onChangeEvent(value);
    };

    useEffect(() => {
        handleInputChange(value);
    }, [value]);

    useEffect(() => {
        if (resetValues) handleInputChange('');
    }, [resetValues]);

    useEffect(() => {
        if (forcedValue !== '') handleInputChange(forcedValue);
    }, [forcedValue]);

    return (
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <TextInput
                style={[
                    styles.input,
                    { backgroundColor: bgColor },
                    accent ? { borderColor: PointLightColor } : { borderColor: focus ? WhiteColor : 'transparent' },
                ]}
                placeholder={placeholder}
                placeholderTextColor={bgColor !== InputBgColor ? '#52525c' : InputPlaceholderColor}
                secureTextEntry={secure}
                keyboardType={numberOnly ? 'numeric' : 'default'}
                autoCapitalize="none"
                value={val}
                selectionColor={TextGrayColor}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChangeText={text => handleInputChange(text)}
                editable={!isLoading} // block edit or focus when loading
            />
            {message !== undefined && (
                <View style={styles.messageContainer}>
                    <Text style={[styles.message, { color: validation ? 'green' : TextWarnColor }]}>{message}</Text>
                </View>
            )}
        </View>
    );
};

export default InputSetVertical;

const styles = StyleSheet.create({
    viewContainer: {
        paddingBottom: 8,
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 8,
    },
    messageContainer: {
        height: 17,
        alignItems: 'flex-end',
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
    },
    message: {
        fontSize: 14,
        fontFamily: Lato,
        textAlign: 'right',
    },
    input: {
        color: TextColor,
        paddingHorizontal: 12,
        height: 45,
        borderWidth: 1,
        marginBottom: 5,
    },
});
