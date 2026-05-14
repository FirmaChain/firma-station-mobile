import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { BgColor, BoxColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { EmitterSubscription, Keyboard, Modal, Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useInterval } from '@/hooks/common/hooks';

import CustomToast from '../toast/customToast';

interface IProps {
    visible: boolean;
    fade?: boolean;
    keyboardAvoiding?: boolean;
    lockBackButton?: boolean;
    forceActive?: boolean;
    bgColor?: string;
    handleOpen: (open: boolean) => void;
    handleShow?: () => void;
    children: ReactNode;
    toastInModal?: boolean;
}

const ANIMATION_DURATION = 220;
const SHEET_HIDDEN_OFFSET = 320;

const CustomModal = ({
    visible,
    fade = false,
    keyboardAvoiding = true,
    lockBackButton = false,
    forceActive = false,
    bgColor = BoxColor,
    handleOpen,
    handleShow,
    toastInModal = true,
    children
}: IProps) => {
    const statusBarHeight = StatusBar.currentHeight || 0;

    const { appState, isBioAuthInProgress, appPausedTime } = useAppSelector((state) => state.common);

    const [mounted, setMounted] = useState(visible);

    const backdropOpacity = useSharedValue(0);
    const sheetOpacity = useSharedValue(0);
    const sheetTranslateY = useSharedValue(fade ? 0 : SHEET_HIDDEN_OFFSET);
    const keyboardOffset = useSharedValue(0);

    const closeModal = useCallback(() => {
        if (lockBackButton) return;

        handleOpen(false);
    }, [handleOpen, lockBackButton]);

    useEffect(() => {
        let showSubscription: EmitterSubscription | undefined;
        let hideSubscription: EmitterSubscription | undefined;

        if (keyboardAvoiding) {
            showSubscription = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (event) => {
                keyboardOffset.value = event.endCoordinates.height;
            });

            hideSubscription = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
                keyboardOffset.value = 0;
            });
        }

        return () => {
            showSubscription?.remove();
            hideSubscription?.remove();
        };
    }, [keyboardAvoiding, keyboardOffset]);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            handleShow?.();

            backdropOpacity.value = withTiming(1, {
                duration: ANIMATION_DURATION
            });

            sheetOpacity.value = withTiming(1, {
                duration: ANIMATION_DURATION
            });

            sheetTranslateY.value = withTiming(0, {
                duration: ANIMATION_DURATION
            });

            return;
        }

        Keyboard.dismiss();

        backdropOpacity.value = withTiming(0, {
            duration: ANIMATION_DURATION
        });

        sheetOpacity.value = withTiming(0, {
            duration: ANIMATION_DURATION
        });

        sheetTranslateY.value = withTiming(fade ? 0 : SHEET_HIDDEN_OFFSET, {
            duration: ANIMATION_DURATION
        });

        keyboardOffset.value = 0;

        const timeoutId = setTimeout(() => {
            setMounted(false);
        }, ANIMATION_DURATION);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [backdropOpacity, fade, handleShow, keyboardOffset, sheetOpacity, sheetTranslateY, visible]);

    useInterval(
        () => {
            if (forceActive) {
                closeModal();
            }
        },
        appState !== 'active' && isBioAuthInProgress === false ? 50000 : null,
        true
    );

    useEffect(() => {
        if (forceActive === false) {
            if (appState !== 'active' && isBioAuthInProgress === false) {
                closeModal();
            }
        }
    }, [appPausedTime, appState, closeModal, forceActive, isBioAuthInProgress]);

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value
    }));

    const sheetAnimatedStyle = useAnimatedStyle(() => ({
        opacity: sheetOpacity.value,
        transform: [
            {
                translateY: sheetTranslateY.value - keyboardOffset.value
            }
        ]
    }));

    if (!mounted) return null;

    return (
        <Modal visible={mounted} transparent animationType="none" onRequestClose={closeModal} statusBarTranslucent>
            <View style={styles.root}>
                {!fade && <Animated.View pointerEvents="none" style={[styles.dimmedBackground, backdropAnimatedStyle]} />}

                <Pressable style={styles.backdrop} onPress={closeModal} />

                {toastInModal && <CustomToast />}

                <Animated.View style={[styles.sheet, sheetAnimatedStyle]}>
                    <Pressable
                        style={[styles.modalBox, { backgroundColor: bgColor, marginTop: statusBarHeight }]}
                        onPress={Keyboard.dismiss}
                    >
                        {children}
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end'
    },

    dimmedBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject
    },

    sheet: {
        width: '100%'
    },

    modalBox: {
        width: '100%',
        height: 'auto',

        // Shadow
        shadowColor: BgColor,
        shadowOffset: {
            width: 0,
            height: -4
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,

        // Android elevation
        elevation: 4,

        justifyContent: 'center',
        alignItems: 'center',

        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,

        paddingBottom: Platform.OS === 'ios' ? 30 : 0
    }
});

export default CustomModal;
