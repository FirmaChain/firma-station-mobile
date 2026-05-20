import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CHANGE_NETWORK_NOTICE, CONNECTION_NOTICE, LOADING_DATA_NOTICE } from '@/constants/common';
import { BgColor, Lato, TextColor } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { fadeIn } from '@/util/animation';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, BackHandler, Keyboard, Platform, StyleSheet, Text, View } from 'react-native';

import LogoProgress from './logoProgress';

const Progress = () => {
    const { isNetworkChanged, connect, dataLoadStatus } = useAppSelector((state) => state.common);
    const { network } = useAppSelector((state) => state.storage);

    const opacity = connect === false || isNetworkChanged ? 1 : 0.8;
    const fadeAnim_text = useRef(new Animated.Value(0)).current;
    const [loadingDelayed, setLoadingDelayed] = useState(false);

    useEffect(() => {
        Keyboard.dismiss();
    }, []);

    useEffect(() => {
        if (dataLoadStatus >= 1) {
            setLoadingDelayed(true);
            fadeIn(Animated, fadeAnim_text, 600);
        }
    }, [dataLoadStatus, fadeAnim_text]);

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
            <View style={[styles.background, { opacity }]} />
            <View style={styles.box}>
                <LogoProgress size={50} duration={2000} style={styles.logo} />
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
        justifyContent: 'center',
        flexDirection: 'column'
    },
    network: {
        width: '100%',
        fontFamily: Lato,
        fontSize: 16,
        textAlign: 'center',
        color: TextColor,
        position: 'absolute',
        top: 60
    },
    logo: {
        position: 'absolute',
        top: 0
    }
});

export default Progress;
