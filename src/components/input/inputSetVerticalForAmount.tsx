import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { convertNumber, convertToFctNumberForInput, handleDecimalPointLimit } from '@/util/common';
import {
    InputBgColor,
    InputPlaceholderColor,
    Lato,
    PointLightColor,
    TextCatTitleColor,
    TextColor,
    TextGrayColor,
    WhiteColor,
} from '@/constants/theme';
import TextButton from '../button/textButton';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';

interface IProps {
    title: string;
    placeholder: string;
    accent?: boolean;
    limitValue: number;
    resetValues?: boolean;
    enableMaxAmount?: boolean;
    handleMaxActive?: (active: boolean) => void;
    onChangeEvent: Function;
}

const InputSetVerticalForAmount = ({
    title,
    placeholder,
    accent = false,
    limitValue,
    resetValues = false,
    enableMaxAmount = false,
    handleMaxActive,
    onChangeEvent,
}: IProps) => {
    const isLoading = useSelector((v: rootState) => v.common.loading);

    const [val, setVal] = useState('');
    const [focus, setFocus] = useState(false);

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
            onChangeEvent && onChangeEvent(Number(result));
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
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
                {enableMaxAmount && <TextButton title={'Max'} active={limitValue > 0} onPressEvent={() => handleMaxAmount()} />}
            </View>
            <TextInput
                style={[styles.input, accent ? { borderColor: PointLightColor } : { borderColor: focus ? WhiteColor : 'transparent' }]}
                placeholder={placeholder}
                placeholderTextColor={InputPlaceholderColor}
                keyboardType={'numeric'}
                autoCapitalize="none"
                value={val.toString()}
                editable={limitValue > 0 && !isLoading} // block edit or focus when loading
                selectionColor={TextGrayColor}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChangeText={text => handleInputChange(text)}
            />
        </View>
    );
};

export default InputSetVerticalForAmount;

const styles = StyleSheet.create({
    viewContainer: {
        marginBottom: 8,
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 8,
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
});
