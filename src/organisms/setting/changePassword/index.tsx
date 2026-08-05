import React, { useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { PASSWORD_CHANGE_FAIL, PASSWORD_CHANGE_SUCCESS } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { waitForNextFrame } from '@/util/common';
import {
    getAutoLoginTimestamp,
    getUseBioAuth,
    removeEncryptPasswordByTimestamp,
    removePasswordViaBioAuthByTimestamp,
    setEncryptPassword,
    setPasswordViaBioAuth,
    setRecoverType,
    setWalletWithAutoLogin,
    writeWalletSecretOnly
} from '@/util/wallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Linking, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '@/components/button/button';
import AlertModal from '@/components/modal/alertModal';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

import InputBox from './inputBox';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.ChangePassword>;

const ChangePassword = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { loading } = useAppSelector((state) => state.common);
    const { name: walletName, address: walletAddress } = useAppSelector((state) => state.wallet);
    const { recoverType } = useAppSelector((state) => state.storage);

    const [status, setStatus] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeButton, setActiveButton] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [recoverValue, setRecoverValue] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const handleNewPassword = (password: string) => {
        setNewPassword(password);
    };

    const handleRecoverValue = (value: string) => {
        setRecoverValue(value);
    };

    const handleActiveButton = (active: boolean) => {
        setActiveButton(active);
    };

    const handleModalOpen = (open: boolean) => {
        setIsModalOpen(open);
        if (status === 1) handleBack();
    };

    const changeNewPassword = async () => {
        if (loading) return;
        const loadingRequestId = CommonActions.beginLoadingProgress();
        await waitForNextFrame();

        try {
            await createNewPassword();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        } finally {
            CommonActions.endLoadingProgress(loadingRequestId);
        }
    };

    const createNewPassword = async () => {
        const oldTimestamp = await getAutoLoginTimestamp();
        const useBioAuth = await getUseBioAuth(walletName);
        let newTimestamp = '';

        try {
            await writeWalletSecretOnly(walletName, newPassword, recoverValue);
            await setWalletWithAutoLogin(JSON.stringify({ name: walletName, address: walletAddress }));
            newTimestamp = await getAutoLoginTimestamp();
            await setEncryptPassword(newPassword);

            if (useBioAuth) {
                await setPasswordViaBioAuth(newPassword);
            }

            await setRecoverType(recoverType, recoverValue, walletAddress);

            if (oldTimestamp) {
                await removePasswordViaBioAuthByTimestamp(oldTimestamp);
                await removeEncryptPasswordByTimestamp(oldTimestamp);
            }

            setStatus(1);
            setIsModalOpen(true);
        } catch (error) {
            try {
                if (newTimestamp) {
                    await removePasswordViaBioAuthByTimestamp(newTimestamp);
                    await removeEncryptPasswordByTimestamp(newTimestamp);
                }

                if (oldTimestamp) {
                    await setWalletWithAutoLogin(JSON.stringify({ name: walletName, address: walletAddress }), oldTimestamp);
                }

                if (currentPassword) {
                    await writeWalletSecretOnly(walletName, currentPassword, recoverValue);
                    await setEncryptPassword(currentPassword);

                    if (useBioAuth) {
                        await setPasswordViaBioAuth(currentPassword);
                    }
                }
            } catch (rollbackError) {
                console.error(rollbackError);
            }

            throw error;
        }
    };

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI.changePassword);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container title="Change password" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <InputBox
                        walletName={walletName}
                        validate={handleActiveButton}
                        newPassword={handleNewPassword}
                        currentPassword={setCurrentPassword}
                        recoverValue={handleRecoverValue}
                    />
                    <View style={styles.buttonBox}>
                        <Button title="Change" active={activeButton && !loading} onPressEvent={changeNewPassword} />
                    </View>
                    {isModalOpen && (
                        <AlertModal
                            visible={isModalOpen}
                            handleOpen={handleModalOpen}
                            title={status === 0 ? 'Wrong password' : 'Change password'}
                            desc={status === 0 ? PASSWORD_CHANGE_FAIL : PASSWORD_CHANGE_SUCCESS}
                            confirmTitle={'OK'}
                            type={status === 0 ? 'ERROR' : 'CONFIRM'}
                        />
                    )}
                </View>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 3,
        paddingHorizontal: 20
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});

export default ChangePassword;
