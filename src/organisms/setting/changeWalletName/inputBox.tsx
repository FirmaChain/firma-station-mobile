import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { PasswordCheck, WalletNameValidationCheck } from '@/util/validationCheck';
import { InputBgColor, Lato, TextGrayColor } from '@/constants/theme';
import { PLACEHOLDER_FOR_PASSWORD, PLACEHOLDER_FOR_WALLET_NAME, WARNING_WALLET_NAME_IS_TOO_SHORT } from '@/constants/common';
import InputSetVertical from '@/components/input/inputSetVertical';
import Toast from 'react-native-toast-message';

interface IProps {
    wallet: any;
    validate: (valid: boolean) => void;
    newWalletName: (name: string) => void;
    password: (value: string) => void;
    recoverValue: (value: string) => void;
}

const InputBox = ({ wallet, validate, newWalletName, password, recoverValue }: IProps) => {
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

    const onChangeWalletName = async (value: string) => {
        let result = value.length >= 5 && value.length <= 20;
        let nameCheck = await WalletNameValidationCheck(value);

        let msg = result && !nameCheck ? '' : nameCheck ? `"${value}" is already exists` : WARNING_WALLET_NAME_IS_TOO_SHORT;
        if (value.length === 0) msg = '';
        newWalletName(value);
        setNameValidation(result && !nameCheck);
        setNameMessage(msg);
    };

    const handlePassword = async (value: string) => {
        try {
            let result = await PasswordCheck(wallet.name, value);
            if (result) {
                recoverValue(result);
                password(value);
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

    useEffect(() => {
        validate(pwValidation && nameValidation);
    }, [pwValidation, nameValidation]);

    return (
        <Pressable style={styles.contents} onPress={() => Keyboard.dismiss()}>
            <View style={styles.viewContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Wallet name</Text>
                </View>
                <Text style={styles.walletName}>{wallet.name}</Text>
            </View>
            <InputSetVertical
                title={walletNameText.title}
                message={nameMessage}
                validation={nameValidation}
                placeholder={walletNameText.placeholder}
                onChangeEvent={onChangeWalletName}
            />
            <InputSetVertical
                title={passwordTextObj.title}
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
