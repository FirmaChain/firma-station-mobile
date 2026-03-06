import React, { useEffect, useRef, useState } from 'react';
import { PLACEHOLDER_FOR_PASSWORD } from '@/constants/common';
import { BgColor, Lato, TextCatTitleColor } from '@/constants/theme';
import { decrypt, keyEncrypt } from '@/util/keystore';
import { getChain } from '@/util/secureKeyChain';
import { WalletNameValidationCheck } from '@/util/validationCheck';
import { StyleSheet, Text, View } from 'react-native';

import Button from '@/components/button/button';
import InputSetVertical from '@/components/input/inputSetVertical';
import CustomModal from '@/components/modal/customModal';

interface IProps {
    walletName: string;
    open: boolean;
    book: {
        title: string;
        desc: string;
        confirmTitle: string;
    };
    setOpenModal: (open: boolean) => void;
    bioAuthhandler: (value: string) => void;
}

const RadioOnModal = ({ walletName, open, book, setOpenModal, bioAuthhandler }: IProps) => {
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(false);
    const pending = useRef(false);

    const enabled = active && !pending.current;

    const handleInputChange = async (val: string) => {
        setPassword(val);
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

    const handleBioAuth = () => {
        if (active === false || pending.current) return;
        pending.current = true;
        bioAuthhandler(password);
    };

    const handleModal = (open: boolean) => {
        setOpenModal(open);
    };

    useEffect(() => {
        if (open === false) {
            setPassword('');
            setActive(false);
            pending.current = false;
        }
    }, [open]);

    return (
        <CustomModal visible={open} handleOpen={handleModal}>
            <View style={styles.modalTextContents}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.title, { fontWeight: 'bold' }]}>{book.title}</Text>
                </View>
                <View style={{ paddingBottom: 15 }}>
                    <Text style={styles.desc}>{book.desc}</Text>
                    <InputSetVertical
                        title={''}
                        value={''}
                        bgColor={BgColor}
                        placeholder={PLACEHOLDER_FOR_PASSWORD}
                        secure={true}
                        onChangeEvent={handleInputChange}
                    />
                </View>
                <Button title={book.confirmTitle} active={enabled} onPressEvent={handleBioAuth} />
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
        color: TextCatTitleColor,
        marginBottom: 15
    },
    desc: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextCatTitleColor,
        marginBottom: -5
    }
});

export default RadioOnModal;
