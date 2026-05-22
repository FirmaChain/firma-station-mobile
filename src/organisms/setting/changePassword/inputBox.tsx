import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD, PLACEHOLDER_FOR_PASSWORD_CONFIRM, WARNING_PASSWORD_NOT_MATCH } from '@/constants/common';
import { PasswordCheck, PasswordValidationCheck } from '@/util/validationCheck';
import { debounce } from 'es-toolkit';
import { Keyboard, Pressable, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import InputSetVertical from '@/components/input/inputSetVertical';

interface IProps {
    walletName: string;
    validate: (valid: boolean) => void;
    newPassword: (value: string) => void;
    currentPassword: (value: string) => void;
    recoverValue: (value: string) => void;
}

const InputBox = ({ walletName, validate, newPassword, currentPassword, recoverValue }: IProps) => {
    const currentPasswordTextObj = {
        title: 'Current password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    };

    const newPasswordTextObj = {
        title: 'New password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    };

    const confirmPasswordTextObj = {
        title: 'Confirm new password',
        placeholder: PLACEHOLDER_FOR_PASSWORD_CONFIRM
    };

    const [newPW, setNewPW] = useState('');
    const [pwValidation, setPwValidation] = useState(false);
    const [newPwMessage, setNewPwMessage] = useState('');
    const [newPwValidation, setNewPwValidation] = useState(false);
    const [confirmPwMessage, setConfirmPwMessage] = useState('');
    const [confirmPwValidation, setConfirmPwValidation] = useState(false);
    const validationRequestIdRef = useRef(0);

    const validateCurrentPassword = useMemo(
        () =>
            debounce(async (value: string, requestId: number) => {
                try {
                    const result = await PasswordCheck(walletName, value);

                    if (requestId !== validationRequestIdRef.current) {
                        return;
                    }

                    if (result) {
                        recoverValue(result);
                        currentPassword(value);
                        setPwValidation(true);
                    } else {
                        setPwValidation(false);
                    }
                } catch (error) {
                    if (requestId !== validationRequestIdRef.current) {
                        return;
                    }

                    Toast.show({
                        type: 'error',
                        text1: String(error)
                    });
                    setPwValidation(false);
                }
            }, 250),
        [currentPassword, recoverValue, walletName]
    );

    const handleCurrentPassword = (value: string) => {
        setPwValidation(false);

        if (value.length < 10) {
            validationRequestIdRef.current += 1;
            return;
        }

        const requestId = ++validationRequestIdRef.current;
        validateCurrentPassword(value, requestId);
    };

    const handleNewPassword = (value: string) => {
        const result = PasswordValidationCheck(value);
        let msg = result ? '' : PLACEHOLDER_FOR_PASSWORD;
        if (value.length === 0) msg = '';
        setNewPW(value);
        setNewPwValidation(result);
        setNewPwMessage(msg);

        newPassword(value);
    };

    const handleConfirmPassword = (value: string) => {
        let result = value === newPW;
        let msg = result ? '' : WARNING_PASSWORD_NOT_MATCH;
        if (value.length === 0) {
            msg = '';
            result = false;
        }
        setConfirmPwValidation(result);
        setConfirmPwMessage(msg);
    };

    useEffect(() => {
        validate(pwValidation && newPwValidation && confirmPwValidation);
    }, [pwValidation, newPwValidation, confirmPwValidation]);

    useEffect(() => {
        return () => {
            validationRequestIdRef.current += 1;
            validateCurrentPassword.cancel();
        };
    }, [validateCurrentPassword]);

    return (
        <Pressable style={styles.contents} onPress={() => Keyboard.dismiss()}>
            <InputSetVertical
                title={currentPasswordTextObj.title}
                value={''}
                placeholder={currentPasswordTextObj.placeholder}
                validation={true}
                secure={true}
                onChangeEvent={handleCurrentPassword}
            />
            <InputSetVertical
                title={newPasswordTextObj.title}
                placeholder={newPasswordTextObj.placeholder}
                value={newPW}
                message={newPwMessage}
                validation={newPwValidation}
                secure={true}
                onChangeEvent={handleNewPassword}
            />
            <InputSetVertical
                title={confirmPasswordTextObj.title}
                placeholder={confirmPasswordTextObj.placeholder}
                value={''}
                message={confirmPwMessage}
                validation={confirmPwValidation}
                secure={true}
                onChangeEvent={handleConfirmPassword}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    contents: {
        flex: 2,
        paddingVertical: 20
    }
});

export default InputBox;
