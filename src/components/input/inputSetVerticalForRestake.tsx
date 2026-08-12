import React, { useState } from 'react';
import { InputPlaceholderColor } from '@/constants/theme';
import { convertNumber } from '@/util/common';
import { StyleSheet } from 'react-native';

import TextButton from '../button/textButton';
import VerticalInputField from './verticalInputField';

interface IProps {
    title: string;
    placeholder: string;
    onChangeEvent: (value: number) => void;
}

const InputSetVerticalForRestake = ({ title, placeholder, onChangeEvent }: IProps) => {
    const limitValue = 999999999;
    const [val, setVal] = useState('');

    const handleInputChange = (value: string) => {
        const convertValue = convertNumber(value) > limitValue ? limitValue.toString() : convertNumber(value).toFixed(0);
        if (convertValue === '0') {
            setVal('');
        } else {
            setVal(convertValue);
        }
        onChangeEvent(convertNumber(convertValue));
    };

    const handleMaxAmount = () => {
        handleInputChange('0');
    };

    return (
        <VerticalInputField
            title={title}
            value={val}
            placeholder={placeholder}
            placeholderTextColor={InputPlaceholderColor}
            keyboardType="numeric"
            inputStyle={styles.input}
            containerStyle={styles.container}
            rightContent={<TextButton title="Unlimited" active={true} onPressEvent={handleMaxAmount} />}
            onChangeEvent={handleInputChange}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        paddingBottom: 0
    },
    input: {
        padding: 12
    }
});

export default InputSetVerticalForRestake;
