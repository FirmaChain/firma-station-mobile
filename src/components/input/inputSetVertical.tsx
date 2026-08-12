import React, { useEffect, useState } from 'react';
import { InputBgColor, InputPlaceholderColor, TextWarnColor } from '@/constants/theme';

import VerticalInputField from './verticalInputField';

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
    onChangeEvent
}: IProps) => {
    const [val, setVal] = useState(value);

    const handleInputChange = (nextValue: string) => {
        if (nextValue.includes('/')) return;
        setVal(nextValue);
        onChangeEvent(nextValue);
    };

    const handleKeyPress = (key: string) => {
        if (!secure) return;
        if (key === 'Escape' || key === 'Esc') {
            handleInputChange('');
        }
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
        <VerticalInputField
            title={title}
            value={val}
            message={message}
            messageColor={validation ? 'green' : TextWarnColor}
            placeholder={placeholder}
            placeholderTextColor={bgColor !== InputBgColor ? '#52525c' : InputPlaceholderColor}
            bgColor={bgColor}
            accent={accent}
            inputHeight={45}
            secureTextEntry={secure}
            keyboardType={numberOnly ? 'numeric' : 'default'}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key)}
            onChangeEvent={handleInputChange}
        />
    );
};

export default InputSetVertical;
