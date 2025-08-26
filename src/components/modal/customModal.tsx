import React, { useEffect } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Modal as FadeModal, KeyboardAvoidingView, View } from 'react-native';
import { useAppSelector } from '@/redux/hooks';
import { BgColor, BoxColor } from '@/constants/theme';
import { useInterval } from '@/hooks/common/hooks';
import CustomToast from '../toast/customToast';
import Modal from 'react-native-modal';

interface IProps {
    visible: boolean;
    fade?: boolean;
    keyboardAvoiing?: boolean;
    lockBackButton?: boolean;
    forceActive?: boolean;
    bgColor?: string;
    handleOpen: (open: boolean) => void;
    children: JSX.Element;
    toastInModal?: boolean;
}

const CustomModal = ({
    visible,
    fade = false,
    keyboardAvoiing = true,
    lockBackButton = false,
    forceActive = false,
    bgColor = BoxColor,
    handleOpen,
    toastInModal = true,
    children,
}: IProps) => {
    const { common } = useAppSelector(state => state);

    const closeModal = () => {
        if (lockBackButton) return;
        handleOpen(false);
    };

    const modalSwitcher = () => {
        if (fade) {
            return (
                <FadeModal animationType="fade" transparent={true} onRequestClose={closeModal} visible={visible}>
                    <KeyboardAvoidingView
                        enabled={keyboardAvoiing}
                        behavior={Platform.select({ android: undefined, ios: 'padding' })}
                        style={{ flex: 1 }}>
                        <Pressable style={styles.modalContainer} onPress={() => closeModal()} />
                        <Pressable style={[styles.modalBox, { backgroundColor: bgColor }]} onPress={() => Keyboard.dismiss()}>
                            {children}
                        </Pressable>
                        {toastInModal && <CustomToast />}
                    </KeyboardAvoidingView>
                </FadeModal>
            );
        } else {
            return (
                <Modal
                    isVisible={visible}
                    backdropColor={'#000000'}
                    backdropOpacity={0.7}
                    avoidKeyboard={true}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                    onModalHide={closeModal}
                    onBackButtonPress={closeModal}
                    style={{ marginHorizontal: 0, marginVertical: 0 }}>
                    <Pressable style={styles.modalContainer} onPress={() => closeModal()} />
                    {toastInModal && <CustomToast />}
                    <Pressable style={[styles.modalBox, { backgroundColor: bgColor }]} onPress={() => Keyboard.dismiss()}>
                        {children}
                    </Pressable>
                </Modal>
            );
        }
    };

    useInterval(
        () => {
            if (forceActive) {
                closeModal();
            }
        },
        common.appState !== 'active' && common.isBioAuthInProgress === false ? 50000 : null,
        true
    );

    useEffect(() => {
        if (forceActive === false) {
            if (common.appState !== 'active' && common.isBioAuthInProgress === false) closeModal();
        }
    }, [common.appPausedTime, common.appState, forceActive]);

    return modalSwitcher();
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 9999,
    },
    modalBox: {
        width: '100%',
        height: 'auto',
        shadowColor: BgColor,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingBottom: Platform.OS === 'ios' ? 30 : 0,
        zIndex: 9999,
    },
});

export default CustomModal;
