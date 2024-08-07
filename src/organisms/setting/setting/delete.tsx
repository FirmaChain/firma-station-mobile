import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BgColor, BoxColor, Lato, TextColor } from '@/constants/theme';
import { getWalletList, removeRecoverType, removeUseBioAuth, removeWallet, setWalletList } from '@/util/wallet';
import DeleteWalletModal from '../modal/deleteWalletModal';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '@/redux/hooks';

interface IProps {
    wallet: any;
    handleDisconnect: () => void;
}

const Delete = ({ wallet, handleDisconnect }: IProps) => {
    const { storage } = useAppSelector((state) => state);
    const [openDelModal, setOpenDelModal] = useState(false);
    const handleDelModal = (open: boolean) => {
        setOpenDelModal(open);
    };

    const handleDeleteWallet = useCallback(async () => {
        try {
            removeRecoverType(storage.recoverType, wallet.address);
            await removeWallet(wallet.name);
            await removeUseBioAuth(wallet.name);

            let newList: string = '';
            const result = await getWalletList();
            let arr = result ? result : [];

            if (arr.length >= 1) {
                arr.filter((item) => item !== wallet.name).map((item) => {
                    newList += item + '/';
                });
                newList = newList.slice(0, -1);
            }
            await setWalletList(newList);
            handleDelModal(false);
            handleDisconnect();
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: String(error)
            });
        }
    }, [storage.recoverType, wallet.name]);

    return (
        <View>
            <TouchableOpacity onPress={() => handleDelModal(true)}>
                <View style={[styles.listItem, { justifyContent: 'center' }]}>
                    <Text style={[styles.itemTitle, { color: 'tomato', fontWeight: 'bold' }]}>Delete Wallet</Text>
                </View>
            </TouchableOpacity>

            <DeleteWalletModal
                walletName={wallet.name}
                open={openDelModal}
                setOpenModal={handleDelModal}
                deleteWallet={handleDeleteWallet}
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
    }
});

export default Delete;