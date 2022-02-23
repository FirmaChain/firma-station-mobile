import { convertCurrent, convertToFctNumberForInput } from "@/util/common";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { InputBgColor, InputPlaceholderColor, Lato, PointColor, PointLightColor, TextColor, TextGrayColor, TextWarnColor, WhiteColor } from "../../constants/theme";

const InputSetVerticalForAmount: React.FC<{
    title: string;
    placeholder: string;
    accent?: boolean;
    limitValue: number;
    forcedValue?: string;
    resetValues?: boolean;
    onChangeEvent: Function;
}> = ({title, placeholder, accent = false, limitValue, forcedValue = '', resetValues = false, onChangeEvent}) => {
    const [val, setVal] = useState('');
    const [focus, setFocus] = useState(false);

    const handleInputChange = (value: string) => {
        setVal(value);
        onChangeEvent && onChangeEvent(Number(value));
    }

    useEffect(() => {
        if(resetValues) handleInputChange('0');
    }, [resetValues])

    useEffect(() => {
        if(forcedValue !== '' && accent) handleInputChange(convertToFctNumberForInput(forcedValue).toString());
    }, [forcedValue, accent])

    useEffect(() => {
        if(Number(val) > convertToFctNumberForInput(limitValue)){
            setVal(convertToFctNumberForInput(limitValue).toString());
        }
    }, [val])

    useEffect(() => {
        if(convertToFctNumberForInput(limitValue) < Number(val)){
            setVal(convertToFctNumberForInput(limitValue).toString());
        }
    }, [limitValue])

    return (
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <TextInput
                style={[styles.input, accent? {borderColor: PointLightColor} : {borderColor: focus? WhiteColor : 'transparent'}]}
                placeholder={placeholder}
                placeholderTextColor={InputPlaceholderColor}
                keyboardType={"numeric"}
                autoCapitalize = 'none'
                editable={forcedValue === ''}
                value={val.toString()}
                selectionColor={WhiteColor}
                onFocus={()=>setFocus(true)}
                onBlur={()=>setFocus(false)}
                onChangeText={text => handleInputChange(text)}/>
        </View>
    )
}

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
        color: TextGrayColor,
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    }
})
