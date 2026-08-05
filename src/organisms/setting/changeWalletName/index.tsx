import React, { useCallback, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { WALLETNAME_CHANGE_SUCCESS } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, WalletActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { updateArray } from '@/util/common';
import {
    getAutoLoginTimestamp,
    getUseBioAuth,
    getWalletList,
    removeDAppData,
    removeEncryptPasswordByTimestamp,
    removePasswordViaBioAuthByTimestamp,
    removeUseBioAuth,
    removeWallet,
    setBioAuth,
    setEncryptPassword,
    setRecoverType,
    setUseBioAuth,
    setWalletList,
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

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.ChangeWalletName>;

const ChangeWalletName = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { loading } = useAppSelector((state) => state.common);
    const { name: walletName, address: walletAddress } = useAppSelector((state) => state.wallet);
    const { recoverType } = useAppSelector((state) => state.storage);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeButton, setActiveButton] = useState(false);

    const [newWalletName, setNewWalletName] = useState('');
    const [password, setPassword] = useState('');
    const [recoverValue, setRecoverValue] = useState('');

    const handleRecoverValue = (value: string) => {
        setRecoverValue(value);
    };

    const handleActiveButton = (active: boolean) => {
        setActiveButton(active);
    };

    const handleModalOpen = (open: boolean) => {
        setIsModalOpen(open);
        if (open === false) {
            handleBack();
        }
    };

    const changeNewWalletName = async () => {
        if (loading) return;
        const loadingRequestId = CommonActions.beginLoadingProgress();

        try {
            const setWalletResult = await createNewWallet();
            await removeCurrentWallet();
            WalletActions.handleWalletName(newWalletName);
            if (setWalletResult) {
                handleModalOpen(true);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        } finally {
            CommonActions.endLoadingProgress(loadingRequestId);
        }
    };

    const removeCurrentWallet = useCallback(async () => {
        await removeWallet(walletName);
        await removeDAppData(walletName);
    }, [walletName]);

    const createNewWallet = async () => {
        const oldTimestamp = await getAutoLoginTimestamp();
        const oldWalletList = await getWalletList();
        const useBioAuth = await getUseBioAuth(walletName);
        let newTimestamp = '';

        try {
            await writeWalletSecretOnly(newWalletName, password, recoverValue);
            await setWalletWithAutoLogin(JSON.stringify({ name: newWalletName, address: walletAddress }));
            newTimestamp = await getAutoLoginTimestamp();
            await setEncryptPassword(password);

            await setRecoverType(recoverType, recoverValue, walletAddress);
            await handleUseBioAuthForNewWallet();

            const result = oldWalletList;
            const arr = result ? updateArray([...result], walletName, newWalletName) : [];
            if (arr.length < 1 || arr.includes(walletName)) {
                throw new Error('Failed to update wallet list.');
            }
            const newList = arr.join('/');
            await setWalletList(newList);

            if (oldTimestamp) {
                await removePasswordViaBioAuthByTimestamp(oldTimestamp);
                await removeEncryptPasswordByTimestamp(oldTimestamp);
            }

            return true;
        } catch (error) {
            try {
                if (newTimestamp) {
                    await removePasswordViaBioAuthByTimestamp(newTimestamp);
                    await removeEncryptPasswordByTimestamp(newTimestamp);
                }

                if (oldTimestamp) {
                    await setWalletWithAutoLogin(JSON.stringify({ name: walletName, address: walletAddress }), oldTimestamp);
                }

                if (useBioAuth) {
                    await removeUseBioAuth(newWalletName);
                    await setUseBioAuth(walletName);
                    await setBioAuth(walletName, password);
                }

                await removeWallet(newWalletName);

                if (oldWalletList) {
                    await setWalletList(oldWalletList.join('/'));
                } else {
                    await setWalletList('');
                }
            } catch (rollbackError) {
                console.log(rollbackError);
            }

            throw error;
        }
    };

    const handleUseBioAuthForNewWallet = async () => {
        const result = await getUseBioAuth(walletName);
        if (result) {
            await setUseBioAuth(newWalletName);
            await setBioAuth(newWalletName, password);
            await removeUseBioAuth(walletName);
        }
    };

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["changeWalletName"]});
        Linking.openURL(GUIDE_URI['changeWalletName']);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container title="Change wallet name" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.container}>
                    <InputBox
                        walletName={walletName}
                        validate={handleActiveButton}
                        newWalletName={setNewWalletName}
                        password={setPassword}
                        recoverValue={handleRecoverValue}
                    />
                    <View style={styles.buttonBox}>
                        <Button title="Change" active={activeButton && !loading} onPressEvent={changeNewWalletName} />
                    </View>
                    {isModalOpen && (
                        <AlertModal
                            visible={isModalOpen}
                            handleOpen={handleModalOpen}
                            title={'Change wallet name'}
                            desc={WALLETNAME_CHANGE_SUCCESS}
                            confirmTitle={'OK'}
                            type={'CONFIRM'}
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
    // wallet: {
    //     paddingVertical: 10,
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     color: '#aaa'
    // },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});

export default ChangeWalletName;
