import React, { Fragment, useEffect, useRef, useState } from 'react';
import { IBC_OSMO_ADDRESS_INVALID_TEXT, WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import {
    InputBgColor,
    InputPlaceholderColor,
    Lato,
    TextCatTitleColor,
    TextColor,
    TextGrayColor,
    TextWarnColor,
    WhiteColor
} from '@/constants/theme';
import { SendType } from '@/organisms/wallet/common/senTypeSelector';
import { ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import { addressCheck } from '@/util/firma';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import TextButton from '../button/textButton';
import { FavoriteIcon, QRCodeScannerIcon } from '../icon/icon';

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
    type?: SendType;
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
    onChangeEvent,
    type = 'SEND_TOKEN'
}: IProps) => {
    const { loading: isLoading, appState } = useAppSelector((state) => state.common);
    const { modalData, qrScannerModal } = useAppSelector((state) => state.modal);
    // Camera permission prompt can briefly move appState to inactive/background.
    // Ignore only the first transition right after opening QR to avoid immediate close.
    const ignoreNextInactiveRef = useRef(false);
    const ignoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isFocused = useIsFocused();

    const [focus, setFocus] = useState(false);
    const [val, setVal] = useState(value);
    const [validAddress, setValidAddress] = useState(true);

    useEffect(() => {
        if (type === 'SEND_IBC' && val.length > 0) {
            LayoutAnim();
            easeInAndOutCustomAnim(150);
            setValidAddress(val.startsWith('osmo1'));
        } else {
            setValidAddress(true);
        }
    }, [type, val]);

    const setOpenFavoritekModal = (active: boolean) => {
        ModalActions.handleFavoriteModal(active);
    };

    const handleQRModal = (active: boolean) => {
        if (active) {
            // Arm one-time ignore flag only when user explicitly opens scanner.
            ignoreNextInactiveRef.current = true;
            if (ignoreTimeoutRef.current) {
                clearTimeout(ignoreTimeoutRef.current);
            }
            // Auto-clear guard in case no appState transition occurs.
            ignoreTimeoutRef.current = setTimeout(() => {
                ignoreNextInactiveRef.current = false;
                ignoreTimeoutRef.current = null;
            }, 2000);
        }
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
        if (isFocused && modalData) {
            if (modalData.result !== undefined) {
                const isValidAddress = addressCheck(modalData.result);
                if (isValidAddress) {
                    handleInputChange(modalData.result);
                } else {
                    return Toast.show({
                        type: 'error',
                        text1: WRONG_TARGET_ADDRESS_WARN_TEXT
                    });
                }
            }
            ModalActions.handleResetModal({});
        }
    }, [isFocused, modalData]);

    useEffect(() => {
        handleInputChange(value);
    }, [value]);

    useEffect(() => {
        if (qrScannerModal && appState !== 'active') {
            // Ignore only one inactive/background right after opening scanner.
            if (ignoreNextInactiveRef.current) {
                ignoreNextInactiveRef.current = false;
                return;
            }
            // Normal behavior: close scanner when app actually moves out of foreground.
            handleQRModal(false);
        }
    }, [appState, qrScannerModal]);

    useEffect(() => {
        return () => {
            if (ignoreTimeoutRef.current) {
                clearTimeout(ignoreTimeoutRef.current);
            }
        };
    }, []);

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
                    selectionColor={TextGrayColor}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChangeText={(text) => handleInputChange(text)}
                    editable={!isLoading} // block edit or focus when loading
                />
                <Text style={[styles.noticeText, { maxHeight: validAddress ? 0 : 20 }]}>{IBC_OSMO_ADDRESS_INVALID_TEXT}</Text>
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
    },
    noticeText: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextWarnColor,
        overflow: 'hidden'
    }
});
