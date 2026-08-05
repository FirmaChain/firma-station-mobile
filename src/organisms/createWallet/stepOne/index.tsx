import React, { useCallback, useEffect, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { CREATE_WALLET_FAILED } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { wait, waitForNextFrame } from '@/util/common';
import { createNewWallet, getAddressFromRecoverValue, IWallet } from '@/util/firma';
import { setPasswordViaBioAuth, setRecoverType, setUseBioAuth, setWalletWithBioAuth } from '@/util/wallet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Keyboard, Linking, Pressable, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '@/components/button/button';
import BioAuthModal from '@/components/modal/bioAuthModal';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

import InputBox from './inputBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CreateStepOne>;

interface IProps {
    // FIXME: Navigation provides recovery data from multiple external wallet formats.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recoverValue?: any;
}

const StepOne = ({ recoverValue = null }: IProps) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { name: savedWalletName } = useAppSelector((state) => state.wallet);
    const { appState, lockStation, isBioAuthInProgress } = useAppSelector((state) => state.common);
    const { recoverType } = useAppSelector((state) => state.storage);

    const [walletName, setWalletName] = useState('');
    const [password, setPassword] = useState('');
    const [validation, setValidation] = useState(false);

    const [inProgress, setInProgress] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setInProgress(false);
        }, [])
    );

    const handleWalletInfo = (name: string, _password: string, _validation: boolean) => {
        setWalletName(name);
        setPassword(_password);
        setValidation(_validation);
    };

    const [openBioAuthModal, setOpenBioAuthModal] = useState(false);
    const handleOpenBioAuthModal = (open: boolean) => {
        setOpenBioAuthModal(open);
    };

    const onCreateWalletAndMoveToStepTwo = async () => {
        if (inProgress) return;
        setInProgress(true);

        const loadingRequestId = CommonActions.beginLoadingProgress();
        await waitForNextFrame();
        try {
            const result = await createNewWallet();
            if (result === undefined) {
                CommonActions.endLoadingProgress(loadingRequestId);
                setInProgress(false);
                return Toast.show({
                    type: 'error',
                    text1: CREATE_WALLET_FAILED
                });
            }
            const newWallet: IWallet = {
                name: walletName,
                password: password,
                mnemonic: result.mnemonic
            };
            navigation.navigate(Screens.CreateStepTwo, { wallet: newWallet, loadingRequestId });
        } catch {
            CommonActions.endLoadingProgress(loadingRequestId);
            Toast.show({
                type: 'error',
                text1: CREATE_WALLET_FAILED
            });
            setInProgress(false);
        }
    };

    const onCompleteRecoverWallet = async () => {
        if (inProgress) return;
        setInProgress(true);

        try {
            const useBioAuth = await setWalletWithBioAuth(walletName, password, recoverValue);

            const address = await getAddressFromRecoverValue(recoverValue);
            await setRecoverType(recoverType, recoverValue, address);
            if (useBioAuth) {
                handleOpenBioAuthModal(true);
            } else {
                navigation.reset({ routes: [{ name: Screens.Home }] });
            }
        } catch {
            Toast.show({
                type: 'error',
                text1: CREATE_WALLET_FAILED
            });
            setInProgress(false);
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
        Linking.openURL(GUIDE_URI[recoverValue ? 'recoverWallet' : 'newWallet']);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        if (appState !== 'active') {
            if (isBioAuthInProgress === false) {
                handleOpenBioAuthModal(false);
            }
        } else {
            if (savedWalletName !== '' && lockStation === false) {
                handleOpenBioAuthModal(true);
            }
        }
    }, [lockStation, appState]);

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
                            active={validation && !inProgress}
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
        justifyContent: 'flex-end'
    }
});

export default StepOne;
