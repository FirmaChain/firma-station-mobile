import React, { useMemo, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { InputBgColor, Lato, TextColor, WhiteColor } from '@/constants/theme';
import Clipboard from '@react-native-clipboard/clipboard';
import TextButton from '@/components/button/textButton';

interface IProps {
    type: 'mnemonic' | 'privateKey';
    handleRecoverValue: (value: string) => void;
}

const InputBox = ({ type, handleRecoverValue }: IProps) => {
    const [focus, setFocus] = useState(false);
    const [recoverValue, setRecoverValue] = useState('');

    const recoverDescription = useMemo(() => {
        if (type === 'mnemonic') return 'Enter seed phrase';
        if (type === 'privateKey') return 'Enter private key';
    }, [type]);

    const handleRecoverValueInput = (value: string) => {
        setRecoverValue(value);
        handleRecoverValue(value);
    };

    const pasteFromClipboard = async () => {
        const copied = await Clipboard.getString();
        handleRecoverValueInput(copied);
    };

    return (
        <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 2 }}>
            <View style={styles.wrapperH}>
                <Text style={styles.title}>{recoverDescription}</Text>
                <TextButton title={'Paste'} onPressEvent={pasteFromClipboard} />
            </View>
            <View
                style={[
                    type === 'mnemonic' ? styles.inputWrapper : styles.inputWrapperForPrivateKey,
                    { borderColor: focus ? WhiteColor : 'transparent' },
                ]}>
                <TextInput
                    multiline={true}
                    style={styles.input}
                    value={recoverValue}
                    selectionColor={WhiteColor}
                    onChangeText={text => handleRecoverValueInput(text)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapperH: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    title: {
        color: TextColor,
        fontFamily: Lato,
        fontSize: 14,
    },
    inputWrapperForPrivateKey: {
        color: TextColor,
        marginVertical: 20,
        paddingHorizontal: 12,
        height: 77,
        backgroundColor: InputBgColor,
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
    },
    inputWrapper: {
        height: 200,
        marginVertical: 20,
        padding: 20,
        backgroundColor: InputBgColor,
        borderWidth: 1,
        borderRadius: 4,
    },
    input: {
        color: TextColor,
        flex: 1,
    },
});

export default InputBox;
