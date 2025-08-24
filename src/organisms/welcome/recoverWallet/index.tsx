import React, { useEffect } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CommonActions, ModalActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { mnemonicCheck, privateKeyCheck } from '@/util/firma';
import { CHECK_RECOVER_VALUE, RECOVER_INFO_MESSAGE } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { GUIDE_URI } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import WarnContainer from '@/components/parts/containers/warnContainer';
import RecoverMenus from './recoverMenus';
import Toast from 'react-native-toast-message';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const RecoverWallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const isFocused = useIsFocused();
    const { common, modal } = useAppSelector(state => state);

    const recoverWalletViaQR = async (value: string) => {
        try {
            CommonActions.handleLoadingProgress(true);
            let isMnemonic = await mnemonicCheck(value);
            let isPrivateKey = await privateKeyCheck(value);

            if (isMnemonic === false && isPrivateKey === false) throw CHECK_RECOVER_VALUE;
            CommonActions.handleLoadingProgress(false);
            navigation.navigate(Screens.CreateStepOne, { recoverValue: value });
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: String(error),
            });
        }
    };

    const handleRecoverFromWallet = (type: 'mnemonic' | 'privateKey') => {
        navigation.navigate(Screens.StepRecover, { type: type });
    };

    const handleRecoverViaQR = async (value: boolean) => {
        ModalActions.handleQRScannerModal(value);
    };

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI.recoverWallet);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (isFocused && modal.modalData) {
            recoverWalletViaQR(modal.modalData.result);
            ModalActions.handleResetModal({});
        }
    }, [isFocused, modal.modalData]);

    useEffect(() => {
        if (common.appState !== 'active') {
            handleRecoverViaQR(false);
        }
    }, [common.appState]);

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
        padding: 20,
    },
});

export default RecoverWallet;
