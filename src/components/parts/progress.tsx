import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LOADING_LOGO_0, LOADING_LOGO_1, LOADING_LOGO_2, LOADING_LOGO_3 } from '@/constants/images';
import { Animated, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { fadeIn, fadeOut } from '@/util/animation';
import { BgColor, Lato, TextCatTitleColor, TextColor } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { useAppSelector } from '@/redux/hooks';
import { CHANGE_NETWORK_NOTICE, CONNECTION_NOTICE, LOADING_DATA_NOTICE } from '@/constants/common';

const Progress = () => {
    const { common, storage } = useAppSelector(state => state);

    const opacity = common.connect === false || common.isNetworkChanged ? 1 : 0.8;

    const fadeAnim_1 = useRef(new Animated.Value(0)).current;
    const fadeAnim_2 = useRef(new Animated.Value(0)).current;
    const fadeAnim_3 = useRef(new Animated.Value(0)).current;
    const fadeAnim_text = useRef(new Animated.Value(0)).current;

    const animated = [fadeAnim_1, fadeAnim_2, fadeAnim_3];
    const [loadingDelayed, setLoadingDelayed] = useState(false);
    useEffect(() => {
        let index = -1;
        let inverse = true;
        let count = 0;

        const handleProgress = () => {
            if (inverse && index < 3) index = index + 1;
            if (!inverse && index >= 0) index = index - 1;

            if (inverse && index >= 0 && index < 3) fadeIn(Animated, animated[index], 300);
            if (!inverse && index >= 0 && index < 3) fadeOut(Animated, animated[index], 300);

            if (index <= -1 || index >= 3) inverse = !inverse;
            count = count + 2.5;
            if (count === 10) {
                count = 0;
            }
        };

        handleProgress();
        let timerId = setTimeout(function progress() {
            handleProgress();
            timerId = setTimeout(progress, 250);
        }, 250);

        return () => {
            clearTimeout(timerId);
            setLoadingDelayed(false);
        };
    }, []);

    useEffect(() => {
        if (common.dataLoadStatus >= 1) {
            setLoadingDelayed(true);
            fadeIn(Animated, fadeAnim_text, 600);
        }
    }, [common.dataLoadStatus]);

    useFocusEffect(
        useCallback(() => {
            if (Platform.OS === 'android') {
                const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
                return () => backHandler.remove();
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
                {common.isNetworkChanged && <Text style={styles.network}>{CHANGE_NETWORK_NOTICE + storage.network}</Text>}
                {common.connect === false && <Text style={styles.network}>{CONNECTION_NOTICE}</Text>}
                {loadingDelayed && common.connect && common.isNetworkChanged === false && (
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
        flex: 1,
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: BgColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: '100%',
        paddingBottom: 50,
        alignItems: 'center',
        flexDirection: 'column',
    },
    logo: {
        width: 50,
        height: 50,
        position: 'absolute',
        top: 0,
    },
    counterBox: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    notice: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: '600',
        color: TextColor,
        paddingBottom: 10,
    },
    counter: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
    },
    network: {
        width: '100%',
        fontFamily: Lato,
        fontSize: 16,
        textAlign: 'center',
        color: TextColor,
        position: 'absolute',
        top: 60,
    },
});

export default Progress;
