import React, { useEffect, useState } from 'react';
import { GUIDE_URI } from '@/../config';
import { PLACEHOLDER_FOR_PASSWORD } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { CommonActions, StorageActions, WalletActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { waitForNextFrame } from '@/util/common';
import { getAddressFromRecoverValue } from '@/util/firma';
import { PasswordCheck } from '@/util/validationCheck';
import { getWalletList, setBioAuth, setEncryptPassword, setWalletList, setWalletWithAutoLogin } from '@/util/wallet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Keyboard, Linking, Pressable, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '@/components/button/button';
import InputSetVertical from '@/components/input/inputSetVertical';
import { ModalWalletList } from '@/components/modal';
import CustomModal from '@/components/modal/customModal';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';

import WalletSelector from './walletSelector';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const SelectWallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const { lastSelectedWalletIndex } = useAppSelector((state) => state.storage);
    const { loading } = useAppSelector((state) => state.common);

    const [items, setItems] = useState<Array<any> | null>(null);
    const [selected, setSelected] = useState<number>(-1);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [resetValues, setResetValues] = useState(false);

    const [openSelectModal, setOpenSelectModal] = useState(false);

    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');

    const passwordText = {
        title: 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    };

    const handleOpenSelectModal = (open: boolean) => {
        setOpenSelectModal(open);
    };

    const handleSelectWallet = (index: number) => {
        if (index === selected) {
            return handleOpenSelectModal(false);
        }
        StorageActions.handleLastSelectedWalletIndex(index);
        setSelected(index);
        setResetValues(true);
        handleOpenSelectModal(false);
    };

    const handleEditWalletList = async (list: string, newIndex: number) => {
        try {
            await setWalletList(list);
            await WalletList();
            StorageActions.handleLastSelectedWalletIndex(newIndex);
            setSelected(newIndex);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    useEffect(() => {
        if (items !== null) {
            if (selected >= 0 && selectedWallet !== items[selected]) {
                setSelectedWallet(items[selected]);
                setMnemonic('');
                setResetValues(false);
            }
        }
    }, [selected, items]);

    const WalletList = async () => {
        try {
            const result = await getWalletList();
            setItems(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const onChangePassword = async (value: string) => {
        setPassword(value);
        try {
            const result = await PasswordCheck(selectedWallet, value);
            if (result) {
                setPwValidation(true);
                setMnemonic(result);
            } else {
                setPwValidation(false);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    const onSelectWalletAndMoveToHome = async () => {
        const loadingRequestId = CommonActions.beginLoadingProgress();
        await waitForNextFrame();
        try {
            let adr = '';
            const result = await getAddressFromRecoverValue(mnemonic);
            if (result !== undefined) adr = result;

            await setWalletWithAutoLogin(
                JSON.stringify({
                    name: selectedWallet,
                    address: adr
                })
            );

            await setEncryptPassword(password);

            WalletActions.handleWalletName(selectedWallet);
            WalletActions.handleWalletAddress(adr);

            await setBioAuth(selectedWallet, password);
            navigation.reset({ routes: [{ name: Screens.Home }] });
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
            CommonActions.endLoadingProgress(loadingRequestId);
        }
    };

    useEffect(() => {
        const initStatus = async () => {
            try {
                await WalletList();
                const initIndex = lastSelectedWalletIndex === undefined ? -1 : lastSelectedWalletIndex;
                setSelected(initIndex);
                if (initIndex >= 0 && items !== null) {
                    setSelectedWallet(items[initIndex]);
                }
                setPwValidation(false);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: String(error)
                });
            }
        };
        initStatus();
        return () => {
            setItems([]);
        };
    }, []);

    const handleMoveToWeb = () => {
        Linking.openURL(GUIDE_URI['selectWallet']);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <Container title="Select wallet" handleGuide={handleMoveToWeb} backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <Pressable style={styles.contentBox} onPress={() => Keyboard.dismiss()}>
                    <View style={styles.Box}>
                        <WalletSelector selectedWallet={selectedWallet} handleOpenModal={handleOpenSelectModal} />
                        <InputSetVertical
                            title={passwordText.title}
                            value={''}
                            validation={true}
                            placeholder={passwordText.placeholder}
                            secure={true}
                            resetValues={resetValues}
                            onChangeEvent={onChangePassword}
                        />
                    </View>
                    {openSelectModal && (
                        <CustomModal visible={openSelectModal} bgColor={BgColor} handleOpen={handleOpenSelectModal}>
                            <ModalWalletList
                                initVal={selected}
                                data={items}
                                handleEditWalletList={handleEditWalletList}
                                onPressEvent={handleSelectWallet}
                            />
                        </CustomModal>
                    )}
                    <View style={styles.buttonBox}>
                        <Button title="Next" active={pwValidation && !loading} onPressEvent={onSelectWalletAndMoveToHome} />
                    </View>
                </Pressable>
            </ViewContainer>
        </Container>
    );
};

const styles = StyleSheet.create({
    contentBox: {
        flex: 3,
        paddingHorizontal: 20
    },
    Box: {
        paddingVertical: 20
    },
    buttonBox: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});

export default SelectWallet;
