import Button from '@/components/button/button';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface IProps {
    active: boolean;
    rejectTitle: string;
    confirmTitle: string;
    handleReject: () => void;
    handleConfirm: () => void;
}

const DappButtonBox = ({ active, rejectTitle, confirmTitle, handleReject, handleConfirm }: IProps) => {
    return (
        <View style={styles.modalButtonBox}>
            <View style={{ flex: 1 }}>
                <Button title={rejectTitle} active={active} border={true} onPressEvent={() => handleReject()} />
            </View>
            <View style={{ width: 10 }} />
            <View style={{ flex: 1 }}>
                <Button title={confirmTitle} active={active} onPressEvent={() => handleConfirm()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalButtonBox: {
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default DappButtonBox;
