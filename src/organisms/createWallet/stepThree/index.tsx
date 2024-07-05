import React, { useCallback, useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useAppSelector } from '@/redux/hooks';
import { BgColor } from '@/constants/theme';
import { wait } from '@/util/common';
import { setPasswordViaBioAuth, setRecoverType, setUseBioAuth, setWalletWithBioAuth } from '@/util/wallet';
import { GUIDE_URI } from '@/../config';
import Toast from 'react-native-toast-message';
import Button from '@/components/button/button';
import BioAuthModal from '@/components/modal/bioAuthModal';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import MnemonicQuiz from './mnemonicQuiz';
import { getAddressFromRecoverValue } from '@/util/firma';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CreateStepThree>;

interface IProps {
    walletInfo: any;
}

const StepThree = ({ walletInfo }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { wallet, common, storage } = useAppSelector((state) => state);

    const [confirm, setConfirm] = useState(false);
    const [openBioAuthModal, setOpenBioAuthModal] = useState(false);
    const handleOpenBioAuthModal = (open: boolean) => {
        setOpenBioAuthModal(open);
    };

    const handleConfirm = (result: boolean) => {
        setConfirm(result);
    };

    const onCompleteCreateWallet = async () => {
        setConfirm(false);
        try {
            const useBioAuth = await setWalletWithBioAuth(walletInfo.name, walletInfo.password, walletInfo.mnemonic);
            const address = await getAddressFromRecoverValue(walletInfo.mnemonic);
            await setRecoverType(storage.recoverType, walletInfo.mnemonic, address);
            if (useBioAuth) {
                handleOpenBioAuthModal(true);
            } else {
                navigation.reset({ routes: [{ name: Screens.Home }] });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const MoveToHomeScreen = async (result: boolean) => {
        try {
            if (result) {
                await setPasswordViaBioAuth(walletInfo.password);
                await setUseBioAuth(walletInfo.name);
                handleOpenBioAuthModal(false);
                wait(100).then(() => {
                    navigation.reset({ routes: [{ name: Screens.Home }] });
                });
            } else {
                handleOpenBioAuthModal(false);
                wait(100).then(() => {
                    navigation.reset({ routes: [{ name: Screens.Home }] });
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["newWallet"]});
        Linking.openURL(GUIDE_URI['newWallet']);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (common.appState !== 'active') {
            if (common.isBioAuthInProgress === false) {
                handleOpenBioAuthModal(false);
            }
        } else {
            if (wallet.name !== '') {
                if (common.lockStation === false) {
                    handleOpenBioAuthModal(true);
                } else {
                    handleOpenBioAuthModal(false);
                }
            }
        }
    }, [common.lockStation, common.appState]);

    return (
        <Container title="Confirm seed phrase" step={3} handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <>
                    <View style={styles.contentBox}>
                        <MnemonicQuiz mnemonic={walletInfo.mnemonic} handleConfirm={handleConfirm} />
                    </View>
                    <View style={styles.buttonBox}>
                        <Button title="Confirm and finish" active={confirm} onPressEvent={onCompleteCreateWallet} />
                    </View>
                    <BioAuthModal
                        walletName={walletInfo.name}
                        visible={openBioAuthModal}
                        handleOpen={handleOpenBioAuthModal}
                        handleResult={MoveToHomeScreen}
                    />
                </>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    contentBox: {
        marginVertical: 20
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    }
});

export default StepThree;
