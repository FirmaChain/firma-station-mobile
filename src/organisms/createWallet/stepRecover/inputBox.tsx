import React, { useMemo, useState } from 'react';
import { InputBgColor, Lato, TextColor, TextGrayColor, WhiteColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import Clipboard from '@react-native-clipboard/clipboard';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import TextButton from '@/components/button/textButton';

interface IProps {
    type: 'mnemonic' | 'privateKey';
    handleRecoverValue: (value: string) => void;
}

const InputBox = ({ type, handleRecoverValue }: IProps) => {
    const { loading: isLoading } = useAppSelector((state) => state.common);

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

    const inlineStyles1 = {
        inlineStyle1: { flex: 2 },
        inlineStyle2: { borderColor: focus ? WhiteColor : 'transparent' }
    } as const;

    return (
        <Pressable onPress={() => Keyboard.dismiss()} style={inlineStyles1.inlineStyle1}>
            <View style={styles.wrapperH}>
                <Text style={styles.title}>{recoverDescription}</Text>
                <TextButton title={'Paste'} onPressEvent={pasteFromClipboard} />
            </View>
            <View style={[type === 'mnemonic' ? styles.inputWrapper : styles.inputWrapperForPrivateKey, inlineStyles1.inlineStyle2]}>
                <TextInput
                    multiline={true}
                    style={styles.input}
                    value={recoverValue}
                    selectionColor={TextGrayColor}
                    onChangeText={(text) => handleRecoverValueInput(text)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    editable={!isLoading}
                />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapperH: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    title: {
        color: TextColor,
        fontFamily: Lato,
        fontSize: 14
    },
    inputWrapperForPrivateKey: {
        color: TextColor,
        marginVertical: 20,
        paddingHorizontal: 12,
        height: 77,
        backgroundColor: InputBgColor,
        borderWidth: 1,
        borderRadius: 4,
        padding: 8
    },
    inputWrapper: {
        height: 200,
        marginVertical: 20,
        padding: 20,
        backgroundColor: InputBgColor,
        borderWidth: 1,
        borderRadius: 4
    },
    input: {
        color: TextColor,
        flex: 1
    }
});

export default InputBox;
