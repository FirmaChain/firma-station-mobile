import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface IProps {
    bgColor?: string;
    full?: boolean;
    children: JSX.Element;
}

const ViewContainer = ({ bgColor, children }: IProps) => {
    return (
        <View
            style={[
                styles.viewContainer,
                {
                    backgroundColor: bgColor,
                },
            ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    viewContainer: {
        paddingBottom: Platform.OS === 'android' ? 20 : 0,
        flex: 6,
    },
});

export default ViewContainer;
