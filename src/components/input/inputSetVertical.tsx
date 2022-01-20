import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ContainerColor, InputBgColor, InputPlaceholderColor, Lato, TextColor, TextGrayColor, TextWarnColor, WhiteColor } from "../../constants/theme";

const InputSetVertical: React.FC<{
    title: string;
    message?: string;
    numberOnly?: boolean;
    validation?: boolean;
    placeholder: string;
    secure?: boolean;
    onChangeEvent: Function;
}> = ({title, message, numberOnly = false, validation, placeholder, secure = false, onChangeEvent}) => {
    const [val, setVal] = useState('');
    const [focus, setFocus] = useState(false);

    const handleInputChange = (value: string) => {
        setVal(value);
        onChangeEvent && onChangeEvent(value);
    }
    
    return (
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <TextInput
                style={[styles.input, {borderColor: focus? WhiteColor : 'transparent'}]}
                placeholder={placeholder}
                placeholderTextColor={InputPlaceholderColor}
                secureTextEntry={secure}
                keyboardType={numberOnly? "numeric" : "default"}
                autoCapitalize = 'none'
                value={val}
                selectionColor={WhiteColor}
                onFocus={()=>setFocus(true)}
                onBlur={()=>setFocus(false)}
                onChangeText={text => handleInputChange(text)}/>
            <View style={styles.messageContainer}>
                <Text style={[styles.message, {color: validation? 'green':TextWarnColor}]}>{message}</Text>
            </View>
        </View>
    )
}

export default InputSetVertical;

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
    messageContainer: {
        height: 17,
        alignItems: 'flex-end',
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
    },
    message: {
        fontSize: 14,
        fontFamily: Lato,
        textAlign: 'right',
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 5,
        
    }
})
