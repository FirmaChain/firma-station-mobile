import React, { useCallback, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { PASSWORD_CHANGE_FAIL, PASSWORD_CHANGE_SUCCESS } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { waitForNextFrame } from '@/util/common';
import { getAddressFromRecoverValue } from '@/util/firma';
import { removePasswordViaBioAuth, removeRecoverType, removeWallet, setBioAuth, setNewWallet, setRecoverType } from '@/util/wallet';
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
            await removeCurrentPassword();
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

    const removeCurrentPassword = useCallback(async () => {
        try {
            await getAddressFromRecoverValue(recoverValue);
            removeRecoverType(recoverType, walletAddress);
            await removeWallet(walletName);
            await removePasswordViaBioAuth();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, [recoverType, walletName, recoverValue]);

    const createNewPassword = async () => {
        try {
            const result = await setNewWallet(walletName, newPassword, recoverValue, false);
            await setRecoverType(recoverType, recoverValue, walletAddress);
            if (result) {
                setStatus(1);
                setIsModalOpen(true);
                setBioAuth(walletName, newPassword);
            }
        } catch (error) {
            console.log(error);
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
