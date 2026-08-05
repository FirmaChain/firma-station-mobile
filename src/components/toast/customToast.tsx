import React, { useState } from 'react';
import { Lato, toastError, toastInfo, toastSuccess } from '@/constants/theme';
import { wait } from '@/util/common';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast, type ToastConfigParams } from 'react-native-toast-message';

const CustomToast = () => {
    const [display, setDisplay] = useState<'none' | 'flex'>('none');
    const inset = useSafeAreaInsets();

    const inlineStyles1 = {
        inlineStyle1: {
            zIndex: 9999,
            borderLeftWidth: 0,
            backgroundColor: toastSuccess,
            display,
            marginTop: inset.top / 2
        },
        inlineStyle2: {
            zIndex: 9999,
            borderLeftWidth: 0,
            backgroundColor: toastInfo,
            display,
            marginTop: inset.top / 2
        },
        inlineStyle3: {
            zIndex: 9999,
            borderLeftWidth: 0,
            backgroundColor: toastError,
            display,
            marginTop: inset.top / 2
        }
    } as const;

    const toastConfig = {
        success: (props: ToastConfigParams<unknown>) => (
            <BaseToast
                {...props}
                style={inlineStyles1.inlineStyle1}
                contentContainerStyle={styles.inlineStyle1}
                text1Style={styles.text1Style}
                text1NumberOfLines={5}
                text2Style={styles.text2Style}
            />
        ),
        info: (props: ToastConfigParams<unknown>) => (
            <BaseToast
                {...props}
                style={inlineStyles1.inlineStyle2}
                contentContainerStyle={styles.inlineStyle1}
                text1Style={styles.text1Style}
                text1NumberOfLines={5}
                text2Style={styles.text2Style}
            />
        ),
        error: (props: ToastConfigParams<unknown>) => (
            <ErrorToast
                {...props}
                style={inlineStyles1.inlineStyle3}
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
    inlineStyle1: { paddingHorizontal: 15 },
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
