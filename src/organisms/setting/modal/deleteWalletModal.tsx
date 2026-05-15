import React, { useEffect, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD, SETTING_DELETE_WALLET_TEXT } from '@/constants/common';
import { BgColor, FailedColor, Lato, TextCatTitleColor, TextWarnColor } from '@/constants/theme';
import { decrypt, keyEncrypt } from '@/util/keystore';
import { getChain } from '@/util/secureKeyChain';
import { WalletNameValidationCheck } from '@/util/validationCheck';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import InputSetVertical from '@/components/input/inputSetVertical';
import CustomModal from '@/components/modal/customModal';

interface IProps {
    walletName: string;
    open: boolean;
    setOpenModal: (value: boolean) => void;
    deleteWallet: () => void;
}

const DeleteWalletModal = ({ walletName, open, setOpenModal, deleteWallet }: IProps) => {
    const [active, setActive] = useState(false);

    const handleInputChange = async (val: string) => {
        if (val.length >= 10) {
            const nameCheck = await WalletNameValidationCheck(walletName);
            if (nameCheck) {
                const key: string = keyEncrypt(walletName, val);
                try {
                    const result = await getChain(walletName);
                    if (result) {
                        const w = decrypt(result.password, key);
                        setActive(w !== '');
                    }
                } catch (error) {
                    console.log(error);
                    setActive(false);
                }
            }
        } else {
            setActive(false);
        }
    };

    const handleDeleteWallet = () => {
        if (active) deleteWallet();
    };

    useEffect(() => {
        if (open === false) {
            setActive(false);
        }
    }, [open]);

    return (
        <CustomModal visible={open} handleOpen={(v) => setOpenModal(v)}>
            <View style={styles.modalTextContents}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.title}>{SETTING_DELETE_WALLET_TEXT.title}</Text>
                </View>
                <Text style={styles.desc}>{SETTING_DELETE_WALLET_TEXT.desc}</Text>
                <View style={{ paddingBottom: 15 }}>
                    <InputSetVertical
                        title={'Password'}
                        value={''}
                        bgColor={BgColor}
                        placeholder={PLACEHOLDER_FOR_PASSWORD}
                        secure={true}
                        onChangeEvent={handleInputChange}
                    />
                </View>
                <TouchableOpacity
                    disabled={!active}
                    style={[styles.delButton, { opacity: active ? 1 : 0.3 }]}
                    onPress={() => handleDeleteWallet()}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{SETTING_DELETE_WALLET_TEXT.confirmTitle}</Text>
                </TouchableOpacity>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalTextContents: {
        width: '100%',
        padding: 20
    },
    title: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: '600',
        color: TextCatTitleColor
    },
    desc: {
        fontFamily: Lato,
        fontSize: 15,
        color: TextWarnColor,
        paddingVertical: 10
    },
    delButton: {
        height: 50,
        borderRadius: 4,
        backgroundColor: FailedColor,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default DeleteWalletModal;
