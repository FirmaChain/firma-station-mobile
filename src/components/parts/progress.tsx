import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CHANGE_NETWORK_NOTICE, CONNECTION_NOTICE, LOADING_DATA_NOTICE } from '@/constants/common';
import { LOADING_LOGO_0, LOADING_LOGO_1, LOADING_LOGO_2, LOADING_LOGO_3 } from '@/constants/images';
import { BgColor, Lato, TextColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { fadeIn } from '@/util/animation';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, BackHandler, Easing, Keyboard, Platform, StyleSheet, Text, View } from 'react-native';

const Progress = () => {
    const { isNetworkChanged, connect, dataLoadStatus } = useAppSelector((state) => state.common);
    const { network } = useAppSelector((state) => state.storage);

    const opacity = connect === false || isNetworkChanged ? 1 : 0.8;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const fadeAnim_text = useRef(new Animated.Value(0)).current;
    const [loadingDelayed, setLoadingDelayed] = useState(false);

    // Match the original pattern timing (250ms tick + 300ms fade) without JS timers.
    const fadeAnim_1 = progressAnim.interpolate({
        inputRange: [0, 0.15, 0.75, 0.9, 1],
        outputRange: [0, 1, 1, 0, 0]
    });

    const fadeAnim_2 = progressAnim.interpolate({
        inputRange: [0, 0.125, 0.275, 0.625, 0.775, 1],
        outputRange: [0, 0, 1, 1, 0, 0]
    });

    const fadeAnim_3 = progressAnim.interpolate({
        inputRange: [0, 0.25, 0.4, 0.5, 0.65, 1],
        outputRange: [0, 0, 1, 1, 0, 0]
    });

    useEffect(() => {
        Keyboard.dismiss();

        const animation = Animated.loop(
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
                isInteraction: false
            })
        );
        animation.start();

        return () => {
            animation.stop();
            progressAnim.stopAnimation();
            progressAnim.setValue(0);
            setLoadingDelayed(false);
        };
    }, [progressAnim]);

    useEffect(() => {
        if (dataLoadStatus >= 1) {
            setLoadingDelayed(true);
            fadeIn(Animated, fadeAnim_text, 600);
        }
    }, [dataLoadStatus]);

    useFocusEffect(
        useCallback(() => {
            if (Platform.OS === 'android') {
                const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
                return () => {
                    if (backHandler) backHandler.remove();
                };
            }
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={[styles.background, { opacity: opacity }]} />
            <View style={[styles.box, { justifyContent: 'center' }]}>
                <Animated.Image style={[styles.logo, { opacity: 1 }]} source={LOADING_LOGO_0} />
                <Animated.Image style={[styles.logo, { opacity: fadeAnim_1 }]} source={LOADING_LOGO_1} />
                <Animated.Image style={[styles.logo, { opacity: fadeAnim_2 }]} source={LOADING_LOGO_2} />
                <Animated.Image style={[styles.logo, { opacity: fadeAnim_3 }]} source={LOADING_LOGO_3} />
                {isNetworkChanged && <Text style={styles.network}>{CHANGE_NETWORK_NOTICE + network}</Text>}
                {connect === false && <Text style={styles.network}>{CONNECTION_NOTICE}</Text>}
                {loadingDelayed && connect && isNetworkChanged === false && (
                    <Animated.Text style={[styles.network, { opacity: fadeAnim_text }]}>{LOADING_DATA_NOTICE}</Animated.Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        top: 0,
        flex: 1
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: BgColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    box: {
        width: '100%',
        paddingBottom: 50,
        alignItems: 'center',
        flexDirection: 'column'
    },
    logo: {
        width: 50,
        height: 50,
        position: 'absolute',
        top: 0
    },
    network: {
        width: '100%',
        fontFamily: Lato,
        fontSize: 16,
        textAlign: 'center',
        color: TextColor,
        position: 'absolute',
        top: 60
    }
});

export default Progress;
