import React from 'react';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';

interface IProps {
    bgColor?: string;
    full?: boolean;
    children: JSX.Element;
}

const ViewContainer = ({ bgColor, full = false, children }: IProps) => {
    return (
        <SafeAreaView
            style={[
                styles.viewContainer,
                { backgroundColor: bgColor, paddingBottom: full ? 0 : Platform.select({ android: 30, ios: 50 }) }
            ]}
        >
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        flex: 6
    }
});

export default ViewContainer;
