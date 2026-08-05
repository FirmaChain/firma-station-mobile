import React, { useCallback, useState } from 'react';
import { BgColor, BoxColor, DangerColor, Lato, TextColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { getWalletList, removeDAppData, removeRecoverType, removeUseBioAuth, removeWallet, setWalletList } from '@/util/wallet';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import DeleteWalletModal from '../modal/deleteWalletModal';

interface IProps {
    walletName: string;
    walletAddress: string;
    handleDisconnect: () => void;
}

const Delete = ({ walletName, walletAddress, handleDisconnect }: IProps) => {
    const { recoverType } = useAppSelector((state) => state.storage);

    const [openDelModal, setOpenDelModal] = useState(false);
    const handleDelModal = (open: boolean) => {
        setOpenDelModal(open);
    };

    const handleDeleteWallet = useCallback(async () => {
        try {
            removeRecoverType(recoverType, walletAddress);
            await removeWallet(walletName);
            await removeUseBioAuth(walletName);
            await removeDAppData(walletName);

            let newList: string = '';
            const result = await getWalletList();
            const arr = result ? result : [];

            if (arr.length >= 1) {
                arr.filter((item) => item !== walletName).map((item) => {
                    newList += item + '/';
                });
                newList = newList.slice(0, -1);
            }
            await setWalletList(newList);
            handleDelModal(false);
            handleDisconnect();
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    }, [recoverType, walletName]);

    return (
        <View>
            <TouchableOpacity onPress={() => handleDelModal(true)}>
                <View style={[styles.listItem, styles.inlineStyle1]}>
                    <Text style={[styles.itemTitle, styles.inlineStyle2]}>Delete Wallet</Text>
                </View>
            </TouchableOpacity>

            <DeleteWalletModal
                walletName={walletName}
                open={openDelModal}
                setOpenModal={handleDelModal}
                deleteWallet={handleDeleteWallet}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inlineStyle1: { justifyContent: 'center' },
    inlineStyle2: { color: DangerColor, fontWeight: 'bold' },
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
    }
});

export default Delete;
