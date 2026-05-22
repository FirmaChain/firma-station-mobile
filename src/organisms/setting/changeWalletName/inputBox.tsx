import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD, PLACEHOLDER_FOR_WALLET_NAME, WARNING_WALLET_NAME_IS_TOO_SHORT } from '@/constants/common';
import { InputBgColor, Lato, TextGrayColor } from '@/constants/theme';
import { PasswordCheck, WalletNameValidationCheck } from '@/util/validationCheck';
import { debounce } from 'es-toolkit';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import InputSetVertical from '@/components/input/inputSetVertical';

interface IProps {
    walletName: string;
    validate: (valid: boolean) => void;
    newWalletName: (name: string) => void;
    password: (value: string) => void;
    recoverValue: (value: string) => void;
}

const InputBox = ({ walletName, validate, newWalletName, password, recoverValue }: IProps) => {
    const walletNameText = {
        title: 'New wallet name',
        placeholder: PLACEHOLDER_FOR_WALLET_NAME
    };

    const passwordTextObj = {
        title: 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    };

    const [pwValidation, setPwValidation] = useState(false);
    const [nameMessage, setNameMessage] = useState('');
    const [nameValidation, setNameValidation] = useState(false);
    const validationRequestIdRef = useRef(0);

    const validatePassword = useMemo(
        () =>
            debounce(async (value: string, requestId: number) => {
                try {
                    const result = await PasswordCheck(walletName, value);

                    if (requestId !== validationRequestIdRef.current) {
                        return;
                    }

                    if (result) {
                        recoverValue(result);
                        password(value);
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
        [password, recoverValue, walletName]
    );

    const onChangeWalletName = async (value: string) => {
        const result = value.length >= 5 && value.length <= 20;
        const nameCheck = await WalletNameValidationCheck(value);

        let msg = result && !nameCheck ? '' : nameCheck ? `"${value}" is already exists` : WARNING_WALLET_NAME_IS_TOO_SHORT;
        if (value.length === 0) msg = '';
        newWalletName(value);
        setNameValidation(result && !nameCheck);
        setNameMessage(msg);
    };

    const handlePassword = (value: string) => {
        setPwValidation(false);

        if (value.length < 10) {
            validationRequestIdRef.current += 1;
            return;
        }

        const requestId = ++validationRequestIdRef.current;
        validatePassword(value, requestId);
    };

    useEffect(() => {
        validate(pwValidation && nameValidation);
    }, [pwValidation, nameValidation]);

    useEffect(() => {
        return () => {
            validationRequestIdRef.current += 1;
            validatePassword.cancel();
        };
    }, [validatePassword]);

    return (
        <Pressable style={styles.contents} onPress={() => Keyboard.dismiss()}>
            <View style={styles.viewContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Wallet name</Text>
                </View>
                <Text style={styles.walletName}>{walletName}</Text>
            </View>
            <InputSetVertical
                title={walletNameText.title}
                value={''}
                message={nameMessage}
                validation={nameValidation}
                placeholder={walletNameText.placeholder}
                onChangeEvent={onChangeWalletName}
            />
            <InputSetVertical
                title={passwordTextObj.title}
                value={''}
                placeholder={passwordTextObj.placeholder}
                validation={true}
                secure={true}
                onChangeEvent={handlePassword}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        marginBottom: 25
    },
    textContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 8
    },
    text: {
        flex: 1,
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor
    },
    walletName: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextGrayColor,
        padding: 12,
        borderWidth: 0,
        backgroundColor: InputBgColor,
        marginBottom: 5
    },
    contents: {
        flex: 2,
        paddingVertical: 20
    }
});

export default InputBox;
