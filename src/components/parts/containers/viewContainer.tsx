import React from 'react';
import { View, StyleSheet } from 'react-native';

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
        paddingBottom: 20,
        flex: 6,
    },
});

export default ViewContainer;
