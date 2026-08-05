import React, { useEffect, useState } from 'react';
import { BIOAUTH_ACTIVATE, SETTING_BIO_AUTH_MODAL_TEXT } from '@/constants/common';
import { BgColor, BoxColor, DisableColor, Lato, PointColor, TextColor, WhiteColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { easeInAndOutCustomAnim } from '@/util/animation';
import { confirmViaBioAuth } from '@/util/bioAuth';
import {
    getAutoLoginTimestamp,
    getUseBioAuth,
    removeDAppData,
    removePasswordViaBioAuthByTimestamp,
    removeUseBioAuth,
    setPasswordViaBioAuth,
    setUseBioAuth
} from '@/util/wallet';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import RadioOnModal from '../modal/bioAuthOnModal';

interface IProps {
    walletName: string;
}

const BioAuthRadio = ({ walletName }: IProps) => {
    const { isBioAuthInProgress } = useAppSelector((state) => state.common);

    const [openBioModal, setOpenBioModal] = useState(false);
    const [useBio, setUseBio] = useState(false);

    const closeBioModal = async (open: boolean) => {
        setOpenBioModal(open);
    };

    const handleBioAuth = async (value: boolean) => {
        easeInAndOutCustomAnim(150);
        if (value === false) {
            handleBioAuthState();
        }
        setOpenBioModal(value);
        setUseBio(value);
    };

    const handleToast = () => {
        Toast.show({
            type: 'info',
            text1: BIOAUTH_ACTIVATE
        });
    };

    const handleBioAuthState = async (password?: string) => {
        // This password is considered as right password.

        try {
            if (password) {
                // Try to get user bio auth
                const result = await confirmViaBioAuth();
                if (result) {
                    await setPasswordViaBioAuth(password);
                    await setUseBioAuth(walletName);
                    handleToast();
                } else {
                    closeBioModal(false);
                }
                setOpenBioModal(false);
            } else {
                const timestamp = await getAutoLoginTimestamp();
                if (timestamp) {
                    await removePasswordViaBioAuthByTimestamp(timestamp);
                }
                await removeUseBioAuth(walletName);
                await removeDAppData(walletName);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    };

    useEffect(() => {
        if (openBioModal === false) {
            const getUseBioAuthState = async () => {
                const result = await getUseBioAuth(walletName);
                setUseBio(result);
            };

            if (isBioAuthInProgress === false) {
                getUseBioAuthState();
            }
        }
    }, [isBioAuthInProgress, openBioModal]);

    return (
        <View style={styles.listItem}>
            <Text style={styles.itemTitle}>Use Bio Auth</Text>
            <TouchableOpacity onPress={() => handleBioAuth(!useBio)}>
                <View style={[styles.radioWrapper, useBio ? styles.inlineStyle1 : styles.inlineStyle2]}>
                    <View style={styles.radio} />
                </View>
            </TouchableOpacity>
            <RadioOnModal
                walletName={walletName}
                open={openBioModal}
                book={SETTING_BIO_AUTH_MODAL_TEXT}
                setOpenModal={closeBioModal}
                bioAuthhandler={handleBioAuthState}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { backgroundColor: PointColor, alignItems: 'flex-end' },
    inlineStyle2: { backgroundColor: DisableColor },
    listItem: {
        backgroundColor: BoxColor,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: BgColor
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: 'center',
        padding: 3
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor
    }
});

export default BioAuthRadio;
