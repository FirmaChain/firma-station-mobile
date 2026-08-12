import React, { useEffect, useState } from 'react';
import { InputPlaceholderColor } from '@/constants/theme';
import { convertNumber, convertToFctNumberForInput, handleDecimalPointLimit } from '@/util/common';
import { StyleSheet } from 'react-native';

import TextButton from '../button/textButton';
import VerticalInputField from './verticalInputField';

interface IProps {
    title: string;
    placeholder: string;
    accent?: boolean;
    limitValue: number;
    resetValues?: boolean;
    enableMaxAmount?: boolean;
    handleMaxActive?: (active: boolean) => void;
    onChangeEvent: (value: number) => void;
}

const InputSetVerticalForAmount = ({
    title,
    placeholder,
    accent = false,
    limitValue,
    resetValues = false,
    enableMaxAmount = false,
    handleMaxActive,
    onChangeEvent
}: IProps) => {
    const [val, setVal] = useState('');

    const handleInputChange = (value: string) => {
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (regex.test(value)) {
            let _value = value;
            if (value === '.') {
                _value = '0.';
            }

            if (_value.length > 1 && _value.startsWith('0')) {
                _value = _value.replace(/^0+/, '0');
            }

            const result = handleDecimalPointLimit(_value);

            setVal(result);
            if (handleMaxActive) {
                if (convertNumber(_value) < convertNumber(convertToFctNumberForInput(limitValue))) {
                    handleMaxActive(false);
                }
            }
            onChangeEvent(Number(result));
        }
    };

    const handleMaxAmount = () => {
        if (handleMaxActive) {
            handleMaxActive(true);
        }
        handleInputChange(convertToFctNumberForInput(limitValue));
    };

    useEffect(() => {
        if (resetValues) handleInputChange('0');
    }, [resetValues]);

    useEffect(() => {
        if (convertNumber(val) > convertNumber(convertToFctNumberForInput(limitValue))) {
            handleInputChange(convertToFctNumberForInput(limitValue).toString());
        }
    }, [val, limitValue]);

    return (
        <VerticalInputField
            title={title}
            value={val}
            placeholder={placeholder}
            placeholderTextColor={InputPlaceholderColor}
            keyboardType="numeric"
            accent={accent}
            inputStyle={styles.input}
            editable={limitValue > 0}
            containerStyle={styles.container}
            rightContent={enableMaxAmount ? <TextButton title="Max" active={limitValue > 0} onPressEvent={handleMaxAmount} /> : undefined}
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

export default InputSetVerticalForAmount;
