import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { wait } from '@/util/common';
import { Lato, toastError, toastInfo, toastSuccess } from '@/constants/theme';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const CustomToast = () => {
    const [display, setDisplay] = useState('none');

    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{ zIndex: 9999, borderLeftWidth: 0, backgroundColor: toastSuccess, display: display }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={styles.text1Style}
                text1NumberOfLines={5}
                text2Style={styles.text2Style}
            />
        ),
        info: (props: any) => (
            <BaseToast
                {...props}
                style={{ zIndex: 9999, borderLeftWidth: 0, backgroundColor: toastInfo, color: 'white', display: display }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={styles.text1Style}
                text1NumberOfLines={5}
                text2Style={styles.text2Style}
            />
        ),
        error: (props: any) => (
            <ErrorToast
                {...props}
                style={{ zIndex: 9999, borderLeftWidth: 0, backgroundColor: toastError, color: 'white', display: display }}
                text1Style={styles.text1Style}
                text1NumberOfLines={5}
                text2Style={styles.text2Style}
            />
        )
    };

    return (
        <Toast
            config={toastConfig}
            visibilityTime={2000}
            onShow={() => setDisplay('flex')}
            onHide={() => wait(100).then(() => setDisplay('none'))}
        />
    );
};

const styles = StyleSheet.create({
    text1Style: {
        fontFamily: Lato,
        fontSize: 15,
        fontWeight: '400',
        color: 'white'
    },
    text2Style: {
        fontFamily: Lato,
        fontSize: 13,
        fontWeight: '400',
        color: 'white'
    }
});

export default CustomToast;
