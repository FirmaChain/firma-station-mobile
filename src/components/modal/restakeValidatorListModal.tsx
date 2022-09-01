import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BgColor, BoxColor, BoxDarkColor, Lato, TextCatTitleColor } from '@/constants/theme';
import CustomModal from './customModal';

interface IRestakeValidatorListModalProps {
    children: JSX.Element;
    open: boolean;
    closeModal: () => void;
}

const RestakeValidatorListModal = ({ children, open, closeModal }: IRestakeValidatorListModalProps) => {
    return (
        <CustomModal visible={open} bgColor={BgColor} handleOpen={closeModal}>
            <View style={styles.modalContainer}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerTitle}>Validator List</Text>
                </View>
                {children}
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        maxHeight: 500,
        backgroundColor: BoxDarkColor
    },
    headerBox: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BoxColor
    },
    headerTitle: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        paddingHorizontal: 10
    }
});

export default RestakeValidatorListModal;
