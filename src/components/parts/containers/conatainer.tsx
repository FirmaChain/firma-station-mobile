import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { BoxDarkColor } from '@/constants/theme';
import Header from '@/components/header/header';
import TitleBar from '../titleBar';

interface IProps {
    title?: string;
    subTitle?: string;
    titleOn?: boolean;
    step?: number;
    bgColor?: string;
    backEvent: Function;
    handleGuide?: () => void;
    children: JSX.Element;
}

const Container = ({
    title = '',
    subTitle = '',
    titleOn = true,
    bgColor = BoxDarkColor,
    step = 0,
    backEvent,
    handleGuide,
    children
}: IProps) => {
    const handleMoveBack = () => {
        backEvent && backEvent();
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Header step={step} bgColor={bgColor} onPressEvent={() => handleMoveBack()} />
            {titleOn && <TitleBar title={title} subTitle={subTitle} handleGuide={handleGuide} />}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.select({ android: 0, ios: getStatusBarHeight() })
    }
});

export default Container;
