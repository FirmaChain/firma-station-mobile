import React, { useEffect, useRef, useState } from 'react';
import { LOGIN_DESCRIPTION } from '@/constants/common';
import { BgColor, Lato, TextCatTitleColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, WalletActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { easeInAndOutAnim, fadeIn, LayoutAnim } from '@/util/animation';
import { confirmViaBioAuth } from '@/util/bioAuth';
import { wait, waitForNextFrame } from '@/util/common';
import { removeAllData } from '@/util/detect';
import { getAddressFromRecoverValue } from '@/util/firma';
import {
    getPasswordViaBioAuth,
    getUseBioAuth,
    getWalletWithAutoLogin,
    removeWalletWithAutoLogin,
    setBioAuth,
    setEncryptPassword,
    setWalletWithAutoLogin
} from '@/util/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '@/components/button/button';
import ViewContainer from '@/components/parts/containers/viewContainer';

import Description from '../welcome/description';
import InputBox from './inputBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

const LoginCheck = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeAnimEnterButton = useRef(new Animated.Value(0)).current;

    const { name: walletName } = useAppSelector((state) => state.wallet);
    const { maintenanceState, connect } = useAppSelector((state) => state.common);

    const Title: string = 'LOGIN';
    const Desc: string = LOGIN_DESCRIPTION;

    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [dimActive, setDimActive] = useState(true);
    const [useBio, setUseBio] = useState(false);
    const [loading, setLoading] = useState(true); // Get wallet information
    const [isLoginProgress, setIsLoginProgress] = useState(false); // Login progress

    const handleLogin = async (recoverValue: string, name: string, password: string) => {
        if (isLoginProgress === true) return;
        setIsLoginProgress(true);
        await waitForNextFrame();

        try {
            const adr = await getAddressFromRecoverValue(recoverValue);
            if (adr) {
                await setWalletWithAutoLogin(
                    JSON.stringify({
                        name: name,
                        address: adr
                    })
                );

                await setEncryptPassword(password);

                WalletActions.handleWalletName(name);
                WalletActions.handleWalletAddress(adr);

                await setBioAuth(name, password);
                CommonActions.handleLoadingProgress(true);
                navigation.reset({ routes: [{ name: Screens.Home }] });
            }
        } catch (error) {
            console.log(error);
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
            setIsLoginProgress(false);
        }
    };

    let isProcessing = false;
    const handleLoginViaBioAuth = async () => {
        if (isProcessing === true) return;
        try {
            isProcessing = true;
            let passwordFromBio = '';

            const auth = await confirmViaBioAuth();
            if (auth) {
                const result = await getPasswordViaBioAuth();
                passwordFromBio = result;
            } else {
                openSelectWallet();
                isProcessing = false;
                return;
            }

            const result = passwordFromBio;
            if (result !== '') {
                isProcessing = false;
                CommonActions.handleLoadingProgress(true);
                navigation.reset({ routes: [{ name: Screens.Home }] });
            }
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const getUseBioAuthState = async () => {
        const useBio = await getUseBioAuth(walletName);
        return useBio;
    };

    const handleDisconnect = async () => {
        await removeWalletWithAutoLogin();
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime('');
        navigation.reset({ routes: [{ name: Screens.Welcome }] });
    };

    const onKeyboardDidShow = () => {
        setIsKeyboardShown(true);
    };

    const onKeyboardDidHide = () => {
        setIsKeyboardShown(false);
    };

    const openSelectWallet = () => {
        LayoutAnim();
        easeInAndOutAnim();
        setDimActive(false);
        fadeIn(Animated, fadeAnim, 950);
    };

    useEffect(() => {
        if (maintenanceState === false) {
            if (connect && loading === false) {
                if (walletName !== '') {
                    getUseBioAuthState().then((res) => {
                        setDimActive(res);
                        setUseBio(res);
                        wait(3000).then(() => fadeIn(Animated, fadeAnimEnterButton, 500));
                        if (res) {
                            handleLoginViaBioAuth();
                        }
                    });
                }
            }
        }
    }, [loading, connect, maintenanceState]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);

        // SplashScreen.hide();

        if (maintenanceState === false) {
            const getWalletForAutoLogin = async () => {
                try {
                    const result = await getWalletWithAutoLogin();

                    if (result !== '') {
                        const parsed = JSON.parse(result);
                        WalletActions.handleWalletName(parsed.name);
                        WalletActions.handleWalletAddress(parsed.address);
                    } else {
                        handleDisconnect();
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            };

            AsyncStorage.getItem('alreadyLaunched').then((value) => {
                if (value == null) {
                    removeAllData().then(() => getWalletForAutoLogin());
                    AsyncStorage.setItem('alreadyLaunched', 'Launched');
                } else {
                    getWalletForAutoLogin();
                }
            });
        }

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, [maintenanceState]);

    return (
        <ViewContainer bgColor={BgColor}>
            <KeyboardAvoidingView enabled={true} behavior={Platform.select({ android: undefined, ios: 'padding' })}>
                {walletName !== '' && (
                    <Pressable onPress={() => Keyboard.dismiss()}>
                        <Animated.View
                            style={[
                                styles.viewContainer,
                                {
                                    justifyContent: dimActive ? 'center' : 'space-between',
                                    paddingBottom: isKeyboardShown ? 20 : 0
                                }
                            ]}
                        >
                            {dimActive === false && (
                                <TouchableOpacity style={styles.disconnect} onPress={() => handleDisconnect()}>
                                    <Text style={styles.disconnectText}>Disconnect</Text>
                                </TouchableOpacity>
                            )}
                            <Description title={Title} desc={Desc} />
                            {dimActive && (
                                <Animated.View style={[styles.enterButtonBox, { opacity: fadeAnimEnterButton }]}>
                                    <Button title="Enter" active={true} onPressEvent={() => openSelectWallet()} />
                                </Animated.View>
                            )}
                            {dimActive === false && (
                                <InputBox
                                    walletName={walletName}
                                    useBio={useBio}
                                    fadeIn={fadeAnim}
                                    loginHandler={handleLogin}
                                    isLoginProgress={isLoginProgress}
                                />
                            )}
                        </Animated.View>
                    </Pressable>
                )}
            </KeyboardAvoidingView>
        </ViewContainer>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    disconnect: {
        height: 25,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20
    },
    disconnectText: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor
    },
    enterButtonBox: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    }
});

export default LoginCheck;
