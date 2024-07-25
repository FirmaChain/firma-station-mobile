import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, DisableColor, Lato, PointColor, TextColor, WhiteColor } from '@/constants/theme';
import { BIOAUTH_ACTIVATE, SETTING_BIO_AUTH_MODAL_TEXT } from '@/constants/common';
import {
    getUseBioAuth,
    removeDAppConnectSession,
    removeDAppProjectIdList,
    removePasswordViaBioAuth,
    removeUseBioAuth,
    setPasswordViaBioAuth,
    setUseBioAuth
} from '@/util/wallet';
import { confirmViaBioAuth } from '@/util/bioAuth';
import { useAppSelector } from '@/redux/hooks';
import { easeInAndOutCustomAnim, LayoutAnim } from '@/util/animation';
import Toast from 'react-native-toast-message';
import RadioOnModal from '../modal/bioAuthOnModal';

interface IProps {
    wallet: any;
}

const BioAuthRadio = ({ wallet }: IProps) => {
    const { common } = useAppSelector((state) => state);

    const [openBioModal, setOpenBioModal] = useState(false);
    const [useBio, setUseBio] = useState(false);

    const closeBioModal = async (open: boolean) => {
        setOpenBioModal(open);
    };

    const handleBioAuth = async (value: boolean) => {
        LayoutAnim();
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
        try {
            if (password) {
                const result = await confirmViaBioAuth();
                if (result) {
                    await setPasswordViaBioAuth(password);
                    await setUseBioAuth(wallet.name);
                    handleToast();
                } else {
                    closeBioModal(false);
                }
                setOpenBioModal(false);
            } else {
                await removePasswordViaBioAuth();
                await removeUseBioAuth(wallet.name);
                await removeDAppProjectIdList(wallet.name);
                await removeDAppConnectSession(wallet.name);
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
                const result = await getUseBioAuth(wallet.name);
                setUseBio(result);
            };

            if (common.isBioAuthInProgress === false) {
                getUseBioAuthState();
            }
        }
    }, [common.isBioAuthInProgress, openBioModal]);

    return (
        <View style={styles.listItem}>
            <Text style={styles.itemTitle}>Use Bio Auth</Text>
            <TouchableOpacity onPress={() => handleBioAuth(!useBio)}>
                <View
                    style={[
                        styles.radioWrapper,
                        useBio ? { backgroundColor: PointColor, alignItems: 'flex-end' } : { backgroundColor: DisableColor }
                    ]}
                >
                    <View style={styles.radio} />
                </View>
            </TouchableOpacity>
            <RadioOnModal
                walletName={wallet.name}
                open={openBioModal}
                book={SETTING_BIO_AUTH_MODAL_TEXT}
                setOpenModal={closeBioModal}
                bioAuthhandler={handleBioAuthState}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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