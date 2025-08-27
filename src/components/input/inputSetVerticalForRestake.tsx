import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { InputBgColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, TextGrayColor, WhiteColor } from '@/constants/theme';
import TextButton from '../button/textButton';
import { convertNumber } from '@/util/common';
import { useSelector } from 'react-redux';
import { rootState } from '@/redux/reducers';

interface IProps {
    title: string;
    placeholder: string;
    onChangeEvent: Function;
}

const InputSetVerticalForRestake = ({ title, placeholder, onChangeEvent }: IProps) => {
    const isLoading = useSelector((v: rootState) => v.common.loading);
    const limitValue = 999999999;
    const [val, setVal] = useState('');
    const [focus, setFocus] = useState(false);

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
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
                <TextButton title={'Unlimited'} active={true} onPressEvent={() => handleMaxAmount()} />
            </View>
            <TextInput
                style={[styles.input, { borderColor: focus ? WhiteColor : 'transparent' }]}
                placeholder={placeholder}
                placeholderTextColor={InputPlaceholderColor}
                keyboardType={'numeric'}
                autoCapitalize="none"
                value={val.toString()}
                selectionColor={TextGrayColor}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChangeText={text => handleInputChange(text)}
                editable={!isLoading} // block edit or focus when loading
            />
        </View>
    );
};

export default InputSetVerticalForRestake;

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
