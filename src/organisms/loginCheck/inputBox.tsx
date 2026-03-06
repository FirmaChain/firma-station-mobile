import React, { useEffect, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { PasswordCheck } from '@/util/validationCheck';
import { getWalletList, setWalletList } from '@/util/wallet';
import { Animated, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '@/components/button/button';
import InputSetVertical from '@/components/input/inputSetVertical';
import CustomModal from '@/components/modal/customModal';
import ModalWalletList from '@/components/modal/modalWalletList';

import WalletSelector from '../welcome/selectWallet/walletSelector';

interface IProps {
    walletName: string;
    useBio: boolean;
    fadeIn: any;
    loginHandler: (mnemonic: string, name: string, password: string) => void;
    isLoginProgress: boolean;
}

const InputBox = ({ walletName, useBio, fadeIn, loginHandler, isLoginProgress }: IProps) => {
    const { lastSelectedWalletIndex } = useAppSelector((state) => state.storage);

    const passwordText = {
        title: 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    };

    const [items, setItems]: Array<any> = useState([]);
    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [recoverValue, setRecoverValue] = useState('');
    const [resetValues, setResetValues] = useState(false);
    const [openSelectModal, setOpenSelectModal] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [selectedWallet, setSelectedWallet] = useState('');

    const WalletList = async () => {
        try {
            const result = await getWalletList();
            setItems(result);
        } catch (error) {
            console.log(error);
            throw error;
        }
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

    const handleLogin = () => {
        loginHandler(recoverValue, selectedWallet, password);
    };

    const onChangePassword = async (value: string) => {
        setPassword(value);
        try {
            const result = await PasswordCheck(selectedWallet, value);
            if (result) {
                setPwValidation(true);
                setRecoverValue(result);
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

    useEffect(() => {
        if (items.length > 0) {
            let index = 0;
            if (lastSelectedWalletIndex < 0) {
                index = items.indexOf(walletName);
            } else {
                if (lastSelectedWalletIndex === items.indexOf(walletName)) {
                    index = items.indexOf(walletName);
                } else {
                    index = lastSelectedWalletIndex;
                }
            }
            setSelectedWallet(items[index]);
            setSelected(index);
        }
    }, [items, lastSelectedWalletIndex]);

    useEffect(() => {
        if (selected >= 0 && selectedWallet !== items[selected]) {
            setSelectedWallet(items[selected]);
            setRecoverValue('');
            setResetValues(false);
        }
    }, [selected]);

    useEffect(() => {
        const initStatus = async () => {
            try {
                await WalletList();
                StorageActions.handleLastSelectedWalletIndex(-1);
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

    return (
        <Animated.View style={[styles.buttonBox, { opacity: useBio ? fadeIn : 1 }]}>
            <View style={{ paddingBottom: 20 }}>
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
            <Button title="Connect" active={pwValidation && !isLoginProgress} onPressEvent={handleLogin} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    buttonBox: {
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
        backgroundColor: BgColor
    }
});

export default InputBox;
