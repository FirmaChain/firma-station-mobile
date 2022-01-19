import React from "react";
import { StyleSheet } from "react-native";
import Toast, { BaseToast, ErrorToast} from 'react-native-toast-message';
import { toastError, toastInfo, toastSuccess } from "../../constants/theme";

const CustomToast = () => {
    const toastConfig = {
        success: (props: any) => (
            <BaseToast
                {...props}
                style={{ zIndex:9999, borderLeftWidth: 0, backgroundColor: toastSuccess }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400',
                    color: 'white'
                }}
                text2Style={{
                    color: 'white'
                }}
            />
        ),
        info: (props: any) => (
            <BaseToast
                {...props}
                style={{ zIndex:9999, borderLeftWidth: 0, backgroundColor: toastInfo, color: 'white' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: '400',
                    color: 'white'
                }}
                text2Style={{
                    color: 'white'
                }}
            />
        ),
        error: (props: any) => (
            <ErrorToast
                {...props}
                style={{ zIndex:9999, borderLeftWidth: 0, backgroundColor: toastError, color: 'white' }}
                text1Style={{
                    fontSize: 17,
                    color: 'white'
                }}
                text2Style={{
                    fontSize: 15,
                    color: 'white'
                }}
            />
        ),
      };

    return (
        <Toast config={toastConfig} visibilityTime={2000}/>
    );
};


const styles = StyleSheet.create({
})

export default CustomToast;