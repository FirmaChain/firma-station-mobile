import React, { useEffect, useState } from 'react';
import { Keyboard, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait } from '@/util/common';
import { setPasswordViaBioAuth, setRecoverType, setUseBioAuth, setWalletWithBioAuth } from '@/util/wallet';
import { createNewWallet, getAddressFromRecoverValue, IWallet } from '@/util/firma';
import { CREATE_WALLET_FAILED } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { GUIDE_URI } from '@/../config';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import Button from '@/components/button/button';
import BioAuthModal from '@/components/modal/bioAuthModal';
import InputBox from './inputBox';
import Toast from 'react-native-toast-message';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CreateStepOne>;

interface IProps {
    recoverValue?: any;
}

const StepOne = ({ recoverValue = null }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();
    const { wallet, common, storage } = useAppSelector((state) => state);

    const [walletName, setWalletName] = useState('');
    const [password, setPassword] = useState('');
    const [validation, setValidation] = useState(false);
    const handleWalletInfo = (name: string, password: string, validation: boolean) => {
        setWalletName(name);
        setPassword(password);
        setValidation(validation);
    };

    const [openBioAuthModal, setOpenBioAuthModal] = useState(false);
    const handleOpenBioAuthModal = (open: boolean) => {
        setOpenBioAuthModal(open);
    };

    const onCreateWalletAndMoveToStepTwo = async () => {
        CommonActions.handleLoadingProgress(true);
        try {
            const result = await createNewWallet();
            if (result === undefined) {
                CommonActions.handleLoadingProgress(false);
                return Toast.show({
                    type: 'error',
                    text1: CREATE_WALLET_FAILED
                });
            }
            const wallet: IWallet = {
                name: walletName,
                password: password,
                mnemonic: result.mnemonic
            };
            navigation.navigate(Screens.CreateStepTwo, { wallet: wallet });
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: CREATE_WALLET_FAILED
            });
        }
    };

    const onCompleteRecoverWallet = async () => {
        try {
            const useBioAuth = await setWalletWithBioAuth(walletName, password, recoverValue);

            const address = await getAddressFromRecoverValue(recoverValue);
            await setRecoverType(storage.recoverType, recoverValue, address);
            if (useBioAuth) {
                handleOpenBioAuthModal(true);
            } else {
                navigation.reset({ routes: [{ name: Screens.Home }] });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: CREATE_WALLET_FAILED
            });
        }
    };

    const MoveToHomeScreen = async (result: boolean) => {
        try {
            if (result) {
                await setPasswordViaBioAuth(password);
                await setUseBioAuth(walletName);
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
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[mnemonic?"recoverWallet":"newWallet"]});
        Linking.openURL(GUIDE_URI[recoverValue ? 'recoverWallet' : 'newWallet']);
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
            if (wallet.name !== '' && common.lockStation === false) {
                handleOpenBioAuthModal(true);
            }
        }
    }, [common.lockStation, common.appState]);

    return (
        <Container
            title={recoverValue ? 'Recover Wallet' : 'New Wallet'}
            handleGuide={handleMoveToWeb}
            step={recoverValue ? 0 : 1}
            backEvent={handleBack}
        >
            <ViewContainer bgColor={BgColor}>
                <Pressable style={styles.contentBox} onPress={() => Keyboard.dismiss()}>
                    <InputBox walletInfo={handleWalletInfo} />
                    {recoverValue && (
                        <BioAuthModal
                            walletName={walletName}
                            visible={openBioAuthModal}
                            handleOpen={handleOpenBioAuthModal}
                            handleResult={MoveToHomeScreen}
                        />
                    )}
                    <View style={styles.buttonBox}>
                        <Button
                            title={recoverValue ? 'Recover' : 'Next'}
                            active={validation}
                            onPressEvent={recoverValue ? onCompleteRecoverWallet : onCreateWalletAndMoveToStepTwo}
                        />
                    </View>
                </Pressable>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    contentBox: {
        flex: 3,
        paddingHorizontal: 20,
        marginTop: 30
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});

export default StepOne;
