import React, { useState } from 'react';
import { ADDRESS_QRCODE_MODAL_TEXT, COPIED_CLIPBOARD } from '@/constants/common';
import { AddressBoxColor, AddressTextColor, Lato, TextCatTitleColor, WhiteColor } from '@/constants/theme';
import Clipboard from '@react-native-clipboard/clipboard';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';

import Button from '@/components/button/button';
import { Copy, DownArrow, QRCodeIcon, UpArrow } from '@/components/icon/icon';
import CustomModal from '@/components/modal/customModal';

interface IProps {
    address: string;
}

const AddressBox = ({ address }: IProps) => {
    const [showAll, setShowAll] = useState(false);
    const [openQRModal, setOpenQRModal] = useState(false);

    const handleAddressToClipboard = () => {
        Clipboard.setString(address);
        Toast.show({
            type: 'info',
            text1: COPIED_CLIPBOARD + 'address'
        });
    };

    const handleQRCode = (value: boolean) => {
        setOpenQRModal(value);
    };

    const handleShowAll = () => setShowAll((prev) => !prev);

    return (
        <View style={[styles.container, showAll && styles.containerExpanded]}>
            <TouchableOpacity onPress={handleShowAll} style={styles.addressPressArea} activeOpacity={0.75}>
                <Text numberOfLines={showAll ? undefined : 1} ellipsizeMode="middle" style={styles.address}>
                    {address}
                </Text>
            </TouchableOpacity>

            <View style={styles.iconWrapper}>
                <TouchableOpacity onPress={handleShowAll} style={styles.expandButton} activeOpacity={0.75}>
                    {showAll ? <UpArrow size={12} color={AddressTextColor} /> : <DownArrow size={12} color={AddressTextColor} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleAddressToClipboard}>
                    <Copy size={20} color={TextCatTitleColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleQRCode(true)}>
                    <QRCodeIcon size={20} color={TextCatTitleColor} />
                </TouchableOpacity>
            </View>
            <CustomModal visible={openQRModal} handleOpen={handleQRCode}>
                <View style={styles.modalTextContents}>
                    <Text style={styles.titleBold}>{ADDRESS_QRCODE_MODAL_TEXT.title}</Text>
                    <View style={styles.qrcodeContainer}>
                        <View style={styles.qrcodeWapper}>
                            <QRCode size={130} value={address} />
                        </View>
                    </View>
                    <Button title={ADDRESS_QRCODE_MODAL_TEXT.confirmTitle} active={true} onPressEvent={() => handleQRCode(false)} />
                </View>
            </CustomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 44,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 20,
        backgroundColor: AddressBoxColor,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerExpanded: {
        alignItems: 'flex-start'
    },
    addressWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0
    },
    addressPressArea: {
        flex: 1,
        minWidth: 0
    },
    address: {
        fontFamily: Lato,
        fontSize: 16,
        color: AddressTextColor,
        paddingRight: 8
    },
    expandButton: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconWrapper: {
        flexDirection: 'row',
        flexShrink: 0,
        alignItems: 'center',
        marginLeft: 10
    },
    actionButton: {
        marginLeft: 10
    },
    modalTextContents: {
        width: '100%',
        padding: 20
    },
    titleBold: {
        fontFamily: Lato,
        fontSize: 20,
        color: TextCatTitleColor,
        marginBottom: 15,
        fontWeight: 'bold'
    },
    qrcodeContainer: {
        borderRadius: 4,
        padding: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    qrcodeWapper: {
        padding: 30,
        borderRadius: 4,
        backgroundColor: WhiteColor
    }
});

export default AddressBox;
