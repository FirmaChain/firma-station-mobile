import React, { useEffect, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD, SETTING_DELETE_WALLET_TEXT } from '@/constants/common';
import { BgColor, FailedColor, Lato, TextCatTitleColor, TextWarnColor } from '@/constants/theme';
import { WalletNameValidationCheck } from '@/util/validationCheck';
import { getRecoverValueWithMeta } from '@/util/wallet';
import { debounce } from 'es-toolkit';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import InputSetVertical from '@/components/input/inputSetVertical';
import CustomModal from '@/components/modal/customModal';

interface IProps {
    walletName: string;
    open: boolean;
    setOpenModal: (value: boolean) => void;
    deleteWallet: () => Promise<void>;
}

const DeleteWalletModal = ({ walletName, open, setOpenModal, deleteWallet }: IProps) => {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

    const validatePassword = debounce(async (value) => {
        if (value.length >= 10) {
            const nameCheck = await WalletNameValidationCheck(walletName);
            if (nameCheck) {
                const { recoverValue } = await getRecoverValueWithMeta(walletName, value);
                setActive(recoverValue !== null);
            }
        } else {
            setActive(false);
        }
    }, 200);

    const handleInputChange = async (val: string) => {
        setPassword(val);

        validatePassword(val);
    };

    const handleDeleteWallet = async () => {
        if (!active || loading) return;

        setLoading(true);
        try {
            const { recoverValue } = await getRecoverValueWithMeta(walletName, password);
            if (recoverValue !== null) {
                await deleteWallet();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open === false) {
            setActive(false);
            setPassword('');
        }
    }, [open]);

    const inlineStyles1 = {
        inlineStyle1: { flexDirection: 'row' },
        inlineStyle2: { paddingBottom: 15 },
        inlineStyle3: { opacity: active && !loading ? 1 : 0.3 },
        inlineStyle4: { color: '#fff', fontSize: 16, fontWeight: '600' }
    } as const;

    return (
        <CustomModal visible={open} handleOpen={(v) => setOpenModal(v)}>
            <View style={styles.modalTextContents}>
                <View style={inlineStyles1.inlineStyle1}>
                    <Text style={styles.title}>{SETTING_DELETE_WALLET_TEXT.title}</Text>
                </View>
                <Text style={styles.desc}>{SETTING_DELETE_WALLET_TEXT.desc}</Text>
                <View style={inlineStyles1.inlineStyle2}>
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
                    disabled={!active || loading}
                    style={[styles.delButton, inlineStyles1.inlineStyle3]}
                    onPress={() => handleDeleteWallet()}
                >
                    <Text style={inlineStyles1.inlineStyle4}>{SETTING_DELETE_WALLET_TEXT.confirmTitle}</Text>
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
