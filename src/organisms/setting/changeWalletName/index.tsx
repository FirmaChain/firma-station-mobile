import React, { useCallback, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { WALLETNAME_CHANGE_SUCCESS } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, WalletActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { updateArray } from '@/util/common';
import { getAddressFromRecoverValue } from '@/util/firma';
import {
    getUseBioAuth,
    getWalletList,
    removeDAppConnectSession,
    removeDAppProjectIdList,
    removePasswordViaBioAuth,
    removeRecoverType,
    removeUseBioAuth,
    removeWallet,
    setBioAuth,
    setNewWallet,
    setRecoverType,
    setUseBioAuth,
    setWalletList
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
        try {
            CommonActions.handleLoadingProgress(true);
            await removeCurrentWallet();
            await createNewWallet();
            CommonActions.handleLoadingProgress(false);
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const removeCurrentWallet = useCallback(async () => {
        try {
            await getAddressFromRecoverValue(recoverValue);
            removeRecoverType(recoverType, walletAddress);
            await removeWallet(walletName);
            await removeDAppProjectIdList(walletName);
            await removeDAppConnectSession(walletName);
            await removePasswordViaBioAuth();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, [recoverType, walletName, recoverValue]);

    const createNewWallet = async () => {
        let newList: string = '';
        try {
            const result = await getWalletList();
            const arr = result ? updateArray(result, walletName, newWalletName) : [];
            if (arr.length >= 1) {
                arr.map((item) => {
                    newList += item + '/';
                });
                newList = newList.slice(0, -1);
            }
            await setWalletList(newList);

            const setWalletResult = await setNewWallet(newWalletName, password, recoverValue, false);
            await setRecoverType(recoverType, recoverValue, walletAddress);

            await handleUseBioAuthForNewWallet();
            WalletActions.handleWalletName(newWalletName);
            if (setWalletResult) {
                handleModalOpen(true);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const handleUseBioAuthForNewWallet = async () => {
        try {
            const result = await getUseBioAuth(walletName);
            if (result) {
                await setUseBioAuth(newWalletName);
            }
            setBioAuth(newWalletName, password);
            await removeUseBioAuth(walletName);
        } catch (error) {
            throw error;
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
                        <Button title="Change" active={activeButton} onPressEvent={changeNewWalletName} />
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
