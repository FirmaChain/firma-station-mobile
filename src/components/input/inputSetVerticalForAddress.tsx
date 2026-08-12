import React, { useEffect, useRef, useState } from 'react';
import { IBC_OSMO_ADDRESS_INVALID_TEXT, WRONG_TARGET_ADDRESS_WARN_TEXT } from '@/constants/common';
import { InputPlaceholderColor, TextWarnColor, WhiteColor } from '@/constants/theme';
import { SendType } from '@/organisms/wallet/common/senTypeSelector';
import { ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { easeInAndOutCustomAnim } from '@/util/animation';
import { addressCheck } from '@/util/firma';
import Clipboard from '@react-native-clipboard/clipboard';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import TextButton from '../button/textButton';
import { FavoriteIcon, QRCodeScannerIcon } from '../icon/icon';
import VerticalInputField from './verticalInputField';

interface IProps {
    title: string;
    value: string;
    numberOnly?: boolean;
    placeholder: string;
    secure?: boolean;
    resetValues?: boolean;
    enableFavorite?: boolean;
    enableQrScanner?: boolean;
    onChangeEvent: (value: string) => void;
    type?: SendType;
}

const InputSetVerticalForAddress = ({
    title,
    value,
    numberOnly = false,
    placeholder,
    secure = false,
    resetValues = false,
    enableFavorite = true,
    enableQrScanner = true,
    onChangeEvent,
    type = 'SEND_TOKEN'
}: IProps) => {
    const appState = useAppSelector((state) => state.common.appState);
    const modalData = useAppSelector((state) => state.modal.modalData);
    const qrScannerModal = useAppSelector((state) => state.modal.qrScannerModal);
    // Camera permission prompt can briefly move appState to inactive/background.
    // Ignore only the first transition right after opening QR to avoid immediate close.
    const ignoreNextInactiveRef = useRef(false);
    const ignoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isFocused = useIsFocused();

    const [val, setVal] = useState(value);
    const [validAddress, setValidAddress] = useState(true);

    useEffect(() => {
        if (type === 'SEND_IBC' && val.length > 0) {
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

    const handleInputChange = (nextValue: string) => {
        setVal(nextValue);
        onChangeEvent(nextValue);
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
            ModalActions.handleResetModal();
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

    const inlineStyles = {
        messageContainer: { height: validAddress ? 0 : 20 },
        message: { maxHeight: validAddress ? 0 : 20 },
        favorite: { display: enableFavorite ? 'flex' : 'none' },
        qrScanner: { display: enableQrScanner ? 'flex' : 'none' }
    } as const;

    return (
        <VerticalInputField
            title={title}
            value={val}
            placeholder={placeholder}
            placeholderTextColor={InputPlaceholderColor}
            secureTextEntry={secure}
            keyboardType={numberOnly ? 'numeric' : 'default'}
            inputStyle={styles.input}
            containerStyle={styles.container}
            message={IBC_OSMO_ADDRESS_INVALID_TEXT}
            messageColor={TextWarnColor}
            messageContainerStyle={inlineStyles.messageContainer}
            messageStyle={inlineStyles.message}
            rightContent={
                <>
                    <TouchableOpacity style={[styles.action, inlineStyles.favorite]} onPress={() => setOpenFavoritekModal(true)}>
                        <FavoriteIcon size={28} color={WhiteColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.action, inlineStyles.qrScanner]} onPress={() => handleQRModal(true)}>
                        <QRCodeScannerIcon size={25} color={WhiteColor} />
                    </TouchableOpacity>
                    <TextButton title="Paste" onPressEvent={handlePaste} />
                </>
            }
            onChangeEvent={handleInputChange}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        paddingBottom: 0
    },
    action: {
        marginRight: 15
    },
    input: {
        padding: 12
    }
});

export default InputSetVerticalForAddress;
