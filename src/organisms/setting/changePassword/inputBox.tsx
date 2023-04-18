import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet } from 'react-native';
import { PLACEHOLDER_FOR_PASSWORD, PLACEHOLDER_FOR_PASSWORD_CONFIRM, WARNING_PASSWORD_NOT_MATCH } from '@/constants/common';
import { PasswordCheck, PasswordValidationCheck } from '@/util/validationCheck';
import InputSetVertical from '@/components/input/inputSetVertical';
import Toast from 'react-native-toast-message';

interface IProps {
    wallet: any;
    validate: (valid: boolean) => void;
    newPassword: (value: string) => void;
    recoverValue: (value: string) => void;
}

const InputBox = ({ wallet, validate, newPassword, recoverValue }: IProps) => {
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

    const handleCurrentPassword = async (value: string) => {
        try {
            let result = await PasswordCheck(wallet.name, value);
            if (result) {
                recoverValue(result);
                setPwValidation(true);
            } else {
                setPwValidation(false);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const handleNewPassword = (value: string) => {
        const result = PasswordValidationCheck(value);
        var msg = result ? '' : PLACEHOLDER_FOR_PASSWORD;
        if (value.length === 0) msg = '';
        setNewPW(value);
        setNewPwValidation(result);
        setNewPwMessage(msg);

        newPassword(value);
    };

    const handleConfirmPassword = (value: string) => {
        var result = value === newPW;
        var msg = result ? '' : WARNING_PASSWORD_NOT_MATCH;
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

    return (
        <Pressable style={styles.contents} onPress={() => Keyboard.dismiss()}>
            <InputSetVertical
                title={currentPasswordTextObj.title}
                value=""
                placeholder={currentPasswordTextObj.placeholder}
                validation={true}
                secure={true}
                onChangeEvent={handleCurrentPassword}
            />
            <InputSetVertical
                title={newPasswordTextObj.title}
                placeholder={newPasswordTextObj.placeholder}
                value={newPwMessage}
                validation={newPwValidation}
                secure={true}
                onChangeEvent={handleNewPassword}
            />
            <InputSetVertical
                title={confirmPasswordTextObj.title}
                placeholder={confirmPasswordTextObj.placeholder}
                value={confirmPwMessage}
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
