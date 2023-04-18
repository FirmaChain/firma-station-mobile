import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import InputSetVertical from '@/components/input/inputSetVertical';
import {
    PLACEHOLDER_FOR_PASSWORD,
    PLACEHOLDER_FOR_PASSWORD_CONFIRM,
    PLACEHOLDER_FOR_WALLET_NAME,
    WARNING_PASSWORD_IS_TOO_SHORT,
    WARNING_PASSWORD_NOT_MATCH,
    WARNING_WALLET_NAME_IS_TOO_SHORT
} from '@/constants/common';
import { PasswordValidationCheck, WalletNameValidationCheck } from '@/util/validationCheck';

interface IProps {
    walletInfo: (name: string, password: string, validation: boolean) => void;
}

const InputBox = ({ walletInfo }: IProps) => {
    const [walletName, setWalletName] = useState('');
    const [password, setPassword] = useState('');

    const [nameMessage, setNameMessage] = useState('');
    const [nameValidation, setNameValidation] = useState(false);

    const [pwMessage, setPwMessage] = useState('');
    const [pwValidation, setPwValidation] = useState(false);

    const [confirm, setConfirm] = useState(false);
    const [cMessage, setCMessage] = useState('');

    const walletNameText = {
        title: 'Wallet name',
        placeholder: PLACEHOLDER_FOR_WALLET_NAME
    };
    const passwordText = {
        title: 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    };
    const confirmPasswordText = {
        title: 'Confirm password',
        placeholder: PLACEHOLDER_FOR_PASSWORD_CONFIRM
    };

    const onChangeWalletName = async (value: string) => {
        let result = value.length >= 5 && value.length <= 20;
        let nameCheck = await WalletNameValidationCheck(value);

        let msg = result && !nameCheck ? '' : nameCheck ? `"${value}" is already exists` : WARNING_WALLET_NAME_IS_TOO_SHORT;
        if (value.length === 0) msg = '';
        setWalletName(value);
        setNameValidation(result && !nameCheck);
        setNameMessage(msg);
    };

    const onChangePassword = (value: string) => {
        const result = PasswordValidationCheck(value);
        var msg = result ? '' : WARNING_PASSWORD_IS_TOO_SHORT;
        if (value.length === 0) msg = '';
        setPassword(value);
        setPwValidation(result);
        setPwMessage(msg);
    };

    const onChangeConfirmPassword = (value: string) => {
        var result = value === password;
        var msg = result ? '' : WARNING_PASSWORD_NOT_MATCH;
        if (value.length === 0) {
            msg = '';
            result = false;
        }
        setConfirm(result);
        setCMessage(msg);
    };

    useEffect(() => {
        if (nameValidation && pwValidation && confirm) {
            walletInfo(walletName, password, true);
        } else {
            walletInfo(walletName, password, false);
        }
    }, [nameValidation, pwValidation, confirm]);

    return (
        <ScrollView>
            <InputSetVertical
                title={walletNameText.title}
                value={''}
                message={nameMessage}
                validation={nameValidation}
                placeholder={walletNameText.placeholder}
                onChangeEvent={onChangeWalletName}
            />
            <InputSetVertical
                title={passwordText.title}
                value={''}
                message={pwMessage}
                validation={pwValidation}
                placeholder={passwordText.placeholder}
                secure={true}
                onChangeEvent={onChangePassword}
            />
            <InputSetVertical
                title={confirmPasswordText.title}
                value={''}
                message={cMessage}
                validation={confirm}
                placeholder={confirmPasswordText.placeholder}
                secure={true}
                onChangeEvent={onChangeConfirmPassword}
            />
        </ScrollView>
    );
};

export default InputBox;
