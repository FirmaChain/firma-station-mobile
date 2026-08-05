import React, { ReactNode } from 'react';
import { BoxDarkColor } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

import Header from '@/components/header/header';

import TitleBar from '../titleBar';

interface IProps {
    title?: string;
    subTitle?: string;
    titleOn?: boolean;
    step?: number;
    bgColor?: string;
    backEvent: () => void;
    handleGuide?: () => void;
    children: ReactNode;
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
        backEvent();
    };

    const inlineStyles1 = {
        inlineStyle1: { backgroundColor: bgColor /*paddingTop: insets.top*/ }
    } as const;

    return (
        <View style={[styles.container, inlineStyles1.inlineStyle1]}>
            <Header step={step} bgColor={bgColor} onPressEvent={() => handleMoveBack()} />
            {titleOn && <TitleBar title={title} subTitle={subTitle} handleGuide={handleGuide} />}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default Container;
