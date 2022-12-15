import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { InputBgColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from '@/constants/theme';
import { QRCodeScannerIcon } from '../icon/icon';
import { useAppSelector } from '@/redux/hooks';
import { addressCheck } from '@/util/firma';
import { WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import { useIsFocused } from '@react-navigation/native';
import { ModalActions } from '@/redux/actions';
import Clipboard from '@react-native-clipboard/clipboard';
import TextButton from '../button/textButton';
import Toast from 'react-native-toast-message';

interface IProps {
    title: string;
    value: string;
    numberOnly?: boolean;
    placeholder: string;
    secure?: boolean;
    resetValues?: boolean;
    onChangeEvent: Function;
}

const InputSetVerticalForAddress = ({
    title,
    value,
    numberOnly = false,
    placeholder,
    secure = false,
    resetValues = false,
    onChangeEvent
}: IProps) => {
    const isFocused = useIsFocused();
    const { common, modal } = useAppSelector((state) => state);

    const [val, setVal] = useState('');
    const [focus, setFocus] = useState(false);

    const handleModal = (active: boolean) => {
        ModalActions.handleQRScannerModal(active);
        if (active === false) {
            ModalActions.handleResetModal({});
        }
    };

    const handleInputChange = (value: string) => {
        setVal(value);
        onChangeEvent && onChangeEvent(value);
    };

    const handlePaste = async () => {
        const copied = await Clipboard.getString();
        handleInputChange(copied);
    };

    useEffect(() => {
        if (isFocused && modal.modalData) {
            if (modal.modalData.result !== undefined) {
                const isValidAddress = addressCheck(modal.modalData.result);
                if (isValidAddress) {
                    handleInputChange(modal.modalData.result);
                } else {
                    return Toast.show({
                        type: 'error',
                        text1: WRONG_TARGET_ADDRESS_WARN_TEXT
                    });
                }
            }
            ModalActions.handleResetModal({});
        }
    }, [isFocused, modal.modalData]);

    useEffect(() => {
        if (value !== '') {
            handleInputChange(value);
        }
    }, [value]);

    useEffect(() => {
        if (common.appState !== 'active') {
            handleModal(false);
        }
    }, [common.appState]);

    useEffect(() => {
        if (resetValues) handleInputChange('');
    }, [resetValues]);

    return (
        <View style={styles.viewContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{title}</Text>
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => handleModal(true)}>
                    <QRCodeScannerIcon size={25} color={WhiteColor} />
                </TouchableOpacity>
                <TextButton title={'Paste'} onPressEvent={handlePaste} />
            </View>
            <TextInput
                style={[styles.input, { borderColor: focus ? WhiteColor : 'transparent' }]}
                placeholder={placeholder}
                placeholderTextColor={InputPlaceholderColor}
                secureTextEntry={secure}
                keyboardType={numberOnly ? 'numeric' : 'default'}
                autoCapitalize="none"
                value={val}
                selectionColor={WhiteColor}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChangeText={(text) => handleInputChange(text)}
            />
        </View>
    );
};

export default InputSetVerticalForAddress;

const styles = StyleSheet.create({
    viewContainer: {
        marginBottom: 8
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 8
    },
    messageContainer: {
        height: 17,
        alignItems: 'flex-end'
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor
    },
    message: {
        fontSize: 14,
        fontFamily: Lato,
        textAlign: 'right'
    },
    input: {
        color: TextColor,
        padding: 12,
        borderWidth: 1,
        backgroundColor: InputBgColor,
        marginBottom: 5
    },
    modalTextContents: {
        width: '100%',
        paddingBottom: 40
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        color: TextCatTitleColor,
        marginBottom: 15
    },
    desc: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextColor
    },
    QRWrapper: {
        padding: 20,
        width: '100%',
        height: 350,
        alignItems: 'center'
    }
});
