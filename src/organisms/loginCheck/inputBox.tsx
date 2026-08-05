import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD } from '@/constants/common';
import { BgColor } from '@/constants/theme';
import { StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { PasswordCheck } from '@/util/validationCheck';
import { getWalletList, setWalletList } from '@/util/wallet';
import { debounce } from 'es-toolkit';
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
    fadeIn: Animated.Value;
    loginHandler: (mnemonic: string, name: string, password: string) => void;
    isLoginProgress: boolean;
}

const InputBox = ({ walletName, useBio, fadeIn, loginHandler, isLoginProgress }: IProps) => {
    const { lastSelectedWalletIndex } = useAppSelector((state) => state.storage);

    const passwordText = {
        title: 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    };

    // FIXME: The secure wallet-list response can be null before a wallet is configured.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [items, setItems]: Array<any> = useState([]);
    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [recoverValue, setRecoverValue] = useState('');
    const [resetValues, setResetValues] = useState(false);
    const [openSelectModal, setOpenSelectModal] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [selectedWallet, setSelectedWallet] = useState('');
    const validationRequestIdRef = useRef(0);

    const validatePassword = useMemo(
        () =>
            debounce(async (wallet: string, value: string, requestId: number) => {
                try {
                    const result = await PasswordCheck(wallet, value);

                    if (requestId !== validationRequestIdRef.current) {
                        return;
                    }

                    if (result) {
                        setPwValidation(true);
                        setRecoverValue(result);
                    } else {
                        setPwValidation(false);
                        setRecoverValue('');
                    }
                } catch (error) {
                    if (requestId !== validationRequestIdRef.current) {
                        return;
                    }

                    Toast.show({
                        type: 'error',
                        text1: String(error)
                    });
                    setPwValidation(false);
                    setRecoverValue('');
                }
            }, 250),
        []
    );

    const WalletList = async () => {
        try {
            const result = await getWalletList();
            setItems(result);
        } catch (error) {
            console.error(error);
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

    const onChangePassword = (value: string) => {
        setPassword(value);
        setPwValidation(false);
        setRecoverValue('');

        const requestId = ++validationRequestIdRef.current;
        validatePassword(selectedWallet, value, requestId);
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
            setPassword('');
            setPwValidation(false);
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
            validatePassword.cancel();
            setItems([]);
        };
    }, []);

    const inlineStyles1 = {
        inlineStyle1: { opacity: useBio ? fadeIn : 1 },
        inlineStyle2: { paddingBottom: 20 }
    } as const;

    return (
        <Animated.View style={[styles.buttonBox, inlineStyles1.inlineStyle1]}>
            <View style={inlineStyles1.inlineStyle2}>
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
