import React, { useEffect, useRef } from 'react';
import { GUIDE_URI } from '@/../config';
import { CHECK_RECOVER_VALUE, RECOVER_INFO_MESSAGE } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { waitForNextFrame } from '@/util/common';
import { recoverWallet } from '@/util/firma';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import WarnContainer from '@/components/parts/containers/warnContainer';

import RecoverMenus from './recoverMenus';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const RecoverWallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    // Camera permission prompt can briefly move appState to inactive/background.
    // Ignore only the first transition right after opening QR to avoid immediate close.
    const ignoreNextInactiveRef = useRef(false);
    const ignoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { appState } = useAppSelector((state) => state.common);
    const { modalData, qrScannerModal } = useAppSelector((state) => state.modal);

    const recoverWalletViaQR = async (value: string) => {
        const loadingRequestId = CommonActions.beginLoadingProgress();
        try {
            await waitForNextFrame();

            await recoverWallet(value); // Try to get wallet from QR data

            navigation.navigate(Screens.CreateStepOne, { recoverValue: value });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        } finally {
            CommonActions.endLoadingProgress(loadingRequestId);
        }
    };

    const handleRecoverFromWallet = (type: 'mnemonic' | 'privateKey') => {
        navigation.navigate(Screens.StepRecover, { type: type });
    };

    const handleRecoverViaQR = async (value: boolean) => {
        if (value) {
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
        ModalActions.handleQRScannerModal(value);
    };

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI.recoverWallet);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (isFocused && modalData) {
            recoverWalletViaQR(modalData.result);
            ModalActions.handleResetModal({});
        }
    }, [isFocused, modalData]);

    useEffect(() => {
        if (qrScannerModal && appState !== 'active') {
            // Ignore only one inactive/background right after opening scanner.
            if (ignoreNextInactiveRef.current) {
                ignoreNextInactiveRef.current = false;
                return;
            }
            // Normal behavior: close scanner when app actually moves out of foreground.
            handleRecoverViaQR(false);
        }
    }, [appState, qrScannerModal]);

    useEffect(() => {
        return () => {
            if (ignoreTimeoutRef.current) {
                clearTimeout(ignoreTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Container title="Recover Wallet" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <RecoverMenus recoverFromWallet={handleRecoverFromWallet} recoverViaQR={handleRecoverViaQR} />
                    <WarnContainer text={RECOVER_INFO_MESSAGE} />
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    }
});

export default RecoverWallet;
