import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Keyboard, Linking } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens, StackParamList } from '@/navigators/appRoutes';
import { useNavigation } from '@react-navigation/native';
import { WalletActions } from '@/redux/actions';
import { PLACEHOLDER_FOR_PASSWORD } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { getWalletList, setBioAuth, setEncryptPassword, setWalletList, setWalletWithAutoLogin } from '@/util/wallet';
import { PasswordCheck } from '@/util/validationCheck';
import { getAddressFromRecoverValue } from '@/util/firma';
import { GUIDE_URI } from '@/../config';
import Toast from 'react-native-toast-message';
import Container from '@/components/parts/containers/conatainer';
import ViewContainer from '@/components/parts/containers/viewContainer';
import InputSetVertical from '@/components/input/inputSetVertical';
import Button from '@/components/button/button';
import CustomModal from '@/components/modal/customModal';
import WalletSelector from './walletSelector';
import ModalWalletList from '@/components/modal/modalWalletList';

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const SelectWallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const [items, setItems]: Array<any> = useState([]);
    const [selected, setSelected] = useState(-1);
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
        setSelected(index);
        setResetValues(true);
        handleOpenSelectModal(false);
    };

    const handleEditWalletList = async (list: string, newIndex: number) => {
        try {
            await setWalletList(list);
            await WalletList();
            setSelected(newIndex);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    useEffect(() => {
        if (selected >= 0 && selectedWallet !== items[selected]) {
            setSelectedWallet(items[selected]);
            setMnemonic('');
            setResetValues(false);
        }
    }, [selected]);

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
            let result = await PasswordCheck(selectedWallet, value);
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
        }
    };

    useEffect(() => {
        const initStatus = async () => {
            try {
                await WalletList();
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
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["selectWallet"]});
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
                            message={''}
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
                        <Button title="Next" active={pwValidation} onPressEvent={onSelectWalletAndMoveToHome} />
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
