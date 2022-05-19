import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { InputBgColor, InputPlaceholderColor, Lato, PointLightColor, TextCatTitleColor, TextColor, TextWarnColor, WhiteColor } from "@/constants/theme";

interface Props {
    title: string;
    message?: string;
    numberOnly?: boolean;
    validation?: boolean;
    placeholder: string;
    bgColor?: string;
    secure?: boolean;
    accent?: boolean;
    forcedValue?: string;
    resetValues?: boolean;
    onChangeEvent: (value:string) => void;
}

const InputSetVertical = ({title, message, numberOnly = false, validation, placeholder, bgColor = InputBgColor, secure = false, accent = false, forcedValue = '', resetValues = false, onChangeEvent}:Props) => {
    const [val, setVal] = useState('');
    const [focus, setFocus] = useState(false);

    const handleInputChange = (value: string) => {
        setVal(value);
        onChangeEvent(value);
    }

    useEffect(() => {
        if(resetValues) handleInputChange('');
    }, [resetValues])

    useEffect(() => {
        if(forcedValue !== '') handleInputChange(forcedValue);
    }, [forcedValue])

    return (
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <TextInput
                style={[styles.input, {backgroundColor: bgColor}, accent? {borderColor: PointLightColor} : {borderColor: focus? WhiteColor : 'transparent'}]}
                placeholder={placeholder}
                placeholderTextColor={bgColor !== InputBgColor?"#52525c":InputPlaceholderColor}
                secureTextEntry={secure}
                keyboardType={numberOnly? "numeric" : "default"}
                autoCapitalize = 'none'
                value={val}
                selectionColor={WhiteColor}
                onFocus={()=>setFocus(true)}
                onBlur={()=>setFocus(false)}
                onChangeText={text => handleInputChange(text)}/>
            {message !== undefined &&
            <View style={styles.messageContainer}>
                <Text style={[styles.message, {color: validation? 'green':TextWarnColor}]}>{message}</Text>
            </View>
            }
        </View>
    )
}

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
    }
})
