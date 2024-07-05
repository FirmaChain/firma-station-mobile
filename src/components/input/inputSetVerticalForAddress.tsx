import React, { Fragment, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { addressCheck } from '@/util/firma';
import { FavoriteIcon, QRCodeScannerIcon } from '../icon/icon';
import { InputBgColor, InputPlaceholderColor, Lato, TextCatTitleColor, TextColor, WhiteColor } from '@/constants/theme';
import { WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
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
    enableFavorite?: boolean;
    enableQrScanner?: boolean;
    onChangeEvent: Function;
}

const InputSetVerticalForAddress = ({
    title,
    value,
    numberOnly = false,
    placeholder,
    secure = false,
    resetValues = false,
    enableFavorite: enableFavorite = true,
    enableQrScanner = true,
    onChangeEvent
}: IProps) => {
    const isFocused = useIsFocused();
    const { common, modal } = useAppSelector((state) => state);

    const [focus, setFocus] = useState(false);
    const [val, setVal] = useState(value);

    const setOpenFavoritekModal = (active: boolean) => {
        ModalActions.handleFavoriteModal(active);
    };

    const handleQRModal = (active: boolean) => {
        ModalActions.handleQRScannerModal(active);
    };

    const handleInputChange = (value: string) => {
        setVal(value);
        onChangeEvent(value);
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
        handleInputChange(value);
    }, [value]);

    useEffect(() => {
        if (common.appState !== 'active') {
            handleQRModal(false);
        }
    }, [common.appState]);

    useEffect(() => {
        if (resetValues) handleInputChange('');
    }, [resetValues]);

    return (
        <Fragment>
            <View style={styles.viewContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{title}</Text>
                    <TouchableOpacity
                        style={{ marginRight: 15, display: enableFavorite ? 'flex' : 'none' }}
                        onPress={() => setOpenFavoritekModal(true)}
                    >
                        <FavoriteIcon size={28} color={WhiteColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginRight: 15, display: enableQrScanner ? 'flex' : 'none' }}
                        onPress={() => handleQRModal(true)}
                    >
                        <QRCodeScannerIcon size={25} color={WhiteColor} />
                    </TouchableOpacity>
                    <TextButton title={'Paste'} onPressEvent={handlePaste} />
                </View>
                <TextInput
                    style={[styles.input, { borderColor: focus ? WhiteColor : 'transparent', color: TextColor }]}
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
        </Fragment>
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
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
