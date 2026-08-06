import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD, TRANSACTION_AUTH_TEXT, UNLOCK_AUTH_TEXT } from '@/constants/common';
import { BgColor, DisableColor, Lato, PointColor, TextCatTitleColor, WhiteColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { easeInAndOutAnim } from '@/util/animation';
import { confirmViaBioAuth } from '@/util/bioAuth';
import { wait } from '@/util/common';
import { ScreenHeight } from '@/util/getScreenSize';
import { decrypt, keyEncrypt } from '@/util/keystore';
import { getChain } from '@/util/secureKeyChain';
import { WalletNameValidationCheck } from '@/util/validationCheck';
import { getPasswordViaBioAuth, getUseBioAuth } from '@/util/wallet';
import { debounce } from 'es-toolkit';
import { Animated, Keyboard, KeyboardEvent, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import ArrowButton from '../button/arrowButton';
import { ForwardArrow, LockIcon, SendIcon, SquareIcon } from '../icon/icon';
import InputSetVertical from '../input/inputSetVertical';
import CustomModal from './customModal';

interface IProps {
    type: string;
    open: boolean;
    setOpenModal: (value: boolean) => void;
    validationHandler: (password: string) => void;
    handleShow?: () => void;
}

const ValidationModal = ({ type, open, setOpenModal, validationHandler }: IProps) => {
    const { name: walletName } = useAppSelector((state) => state.wallet);
    const { appState, isBioAuthInProgress } = useAppSelector((state) => state.common);

    const insets = useSafeAreaInsets();

    const screenHeight = ScreenHeight();
    const [contentPosition, setContentPosition] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [password, setPassword] = useState('');
    const [active, setActive] = useState(false);
    const [dimActive, setDimActive] = useState(true);
    const [useBio, setUseBio] = useState(false);
    const validationRequestIdRef = useRef(0);

    const [backbuttonLock, setBackbuttonLock] = useState(true);

    const contentPaddingBottom = useMemo(() => {
        if (contentPosition !== 0 && keyboardHeight !== 0) {
            if (screenHeight - (contentPosition + keyboardHeight) < 0) {
                return Math.abs(screenHeight - (contentPosition + keyboardHeight));
            }
        }

        return 0;
    }, [contentPosition, keyboardHeight, screenHeight]);

    const titleText = useMemo(() => {
        if (type === 'transaction') return TRANSACTION_AUTH_TEXT;
        return UNLOCK_AUTH_TEXT;
    }, [type]);

    const renderIcon = () => {
        switch (type) {
            case 'transaction':
                return <SendIcon size={80} color={WhiteColor} />;
            case 'lock':
                return <LockIcon size={80} color={WhiteColor} />;
        }
    };

    const getUseBioAuthState = async () => {
        const result = await getUseBioAuth(walletName);
        setDimActive(result);
        setUseBio(result);
        handleBackbuttonLockByUseBio(result);
    };

    const handleBackbuttonLockByUseBio = (useBio: boolean) => {
        if (useBio) {
            wait(600).then(() => {
                handleValidation(useBio);
                wait(100).then(() => {
                    if (type === 'transaction') {
                        setBackbuttonLock(false);
                    }
                });
            });
        } else {
            if (type === 'transaction') {
                setBackbuttonLock(false);
            }
        }
    };

    const handleModal = (open: boolean) => {
        setOpenModal(open);
    };

    const validatePassword = useMemo(
        () =>
            debounce(async (val: string, requestId: number) => {
                try {
                    const nameCheck = await WalletNameValidationCheck(walletName);
                    if (!nameCheck) {
                        return;
                    }

                    const key: string = keyEncrypt(walletName, val);
                    try {
                        const result = await getChain(walletName);
                        if (requestId !== validationRequestIdRef.current) {
                            return;
                        }

                        if (result) {
                            const w = decrypt(result.password, key);
                            setActive(w !== '');
                        }
                    } catch (error) {
                        if (requestId !== validationRequestIdRef.current) {
                            return;
                        }

                        console.error(error);
                        setActive(false);
                    }
                } catch (error) {
                    if (requestId !== validationRequestIdRef.current) {
                        return;
                    }

                    console.error(error);
                    setActive(false);
                }
            }, 250),
        [walletName]
    );

    const handleInputChange = (val: string) => {
        setPassword(val);
        setActive(false);

        if (val.length < 10) {
            validationRequestIdRef.current += 1;
            return;
        }

        const requestId = ++validationRequestIdRef.current;
        validatePassword(val, requestId);
    };

    let isProcessing = false;
    const handleValidation = async (viaBioAuth: boolean) => {
        try {
            if (isProcessing === true) return;
            isProcessing = true;

            let passwordFromBio = '';
            if (viaBioAuth) {
                const auth = await confirmViaBioAuth();
                if (auth) {
                    passwordFromBio = await getPasswordViaBioAuth();
                } else {
                    easeInAndOutAnim();
                    isProcessing = false;
                    setDimActive(false);
                    return;
                }
            }
            const validatedPassword = active ? password : '';
            const result = viaBioAuth ? passwordFromBio : validatedPassword;
            isProcessing = false;
            validationHandler(result);
            if (type === 'transaction') {
                handleModal(false);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
            handleModal(false);
        }
    };

    const onKeyboardDidShow = (event: KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
    };

    const onKeyboardDidHide = () => {
        setKeyboardHeight(0);
    };

    const initValues = () => {
        setPassword('');
        setDimActive(true);
        setActive(false);
        setUseBio(false);
        setBackbuttonLock(true);
    };

    useEffect(() => {
        if (open) {
            getUseBioAuthState();
        } else {
            initValues();
        }
    }, [open]);

    useEffect(() => {
        validationRequestIdRef.current += 1;
        validatePassword.cancel();
        setPassword('');
        setActive(false);
    }, [walletName, validatePassword]);

    useEffect(() => {
        if (appState === 'background') {
            if (type === 'transaction') {
                handleModal(false);
            }
        }

        if (appState === 'active' && isBioAuthInProgress === false) {
            if (type === 'lock') {
                handleValidation(useBio);
            }
        }
    }, [appState]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);
        return () => {
            validationRequestIdRef.current += 1;
            validatePassword.cancel();
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const inlineStyles1 = {
        inlineStyle1: { paddingTop: insets.top },
        inlineStyle2: {
            top: insets.top + 2,
            display: type === 'transaction' ? (backbuttonLock ? 'none' : 'flex') : 'none'
        },
        inlineStyle3: { paddingBottom: contentPaddingBottom },
        inlineStyle4: { alignItems: 'center' },
        inlineStyle5: { fontWeight: '700' },
        inlineStyle6: { height: dimActive ? 0 : 'auto' },
        inlineStyle7: { flex: 1 }
    } as const;

    return (
        <CustomModal
            visible={open}
            fade={true}
            bgColor={BgColor}
            lockBackButton={backbuttonLock}
            keyboardAvoiding={false}
            handleOpen={handleModal}
        >
            <Pressable
                style={[styles.container, inlineStyles1.inlineStyle1]}
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <View style={[styles.backArrowButton, inlineStyles1.inlineStyle2]}>
                    <ArrowButton onPressEvent={() => handleModal(false)} />
                </View>
                <Animated.View
                    style={[styles.textBox, inlineStyles1.inlineStyle3]}
                    onLayout={(event) => {
                        const { y, height } = event.nativeEvent.layout;
                        if (dimActive === false) {
                            setContentPosition(y + height);
                        } else {
                            setContentPosition(0);
                        }
                    }}
                >
                    <View style={inlineStyles1.inlineStyle4}>
                        {renderIcon()}
                        <Text style={[styles.title, inlineStyles1.inlineStyle5]}>{titleText}</Text>
                        <View style={[styles.passwordBox, inlineStyles1.inlineStyle6]}>
                            {dimActive === false && (
                                <>
                                    <View style={inlineStyles1.inlineStyle7}>
                                        <InputSetVertical
                                            title={'Password'}
                                            value={''}
                                            validation={true}
                                            secure={true}
                                            placeholder={PLACEHOLDER_FOR_PASSWORD}
                                            onChangeEvent={handleInputChange}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={styles.confirmButton}
                                        disabled={active === false}
                                        onPress={() => handleValidation(false)}
                                    >
                                        <SquareIcon size={58} color={active ? PointColor : DisableColor} />
                                        <View style={styles.buttonArrow}>
                                            <ForwardArrow size={25} color={active ? WhiteColor : BgColor} />
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BgColor
        // paddingTop: insets. || 0,
        // position: 'relative'
    },
    textBox: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: Lato,
        fontSize: 18,
        textAlign: 'center',
        color: TextCatTitleColor,
        marginTop: 35,
        marginBottom: 20
    },
    passwordBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    backArrowButton: {
        position: 'absolute',
        left: 0
    },
    confirmButton: {
        marginLeft: 2,
        marginBottom: 6
    },
    buttonArrow: {
        position: 'absolute',
        width: 25,
        height: 25,
        top: 16.5,
        left: 16.5
    }
});

export default ValidationModal;
