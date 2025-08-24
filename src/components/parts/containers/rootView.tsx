import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BgColor } from '@/constants/theme';

interface IProps {
    children: JSX.Element;
    bgColor?: string;
}

const RootView = ({ children, bgColor = BgColor }: IProps) => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: bgColor,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
            ]}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RootView;
