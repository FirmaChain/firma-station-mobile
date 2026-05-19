import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TRANSACTION_PROCESS_DESCRIPTION_TEXT, TRANSACTION_PROCESS_NOTICE_TEXT, TRANSACTION_PROCESS_TEXT } from '@/constants/common';
import { LOADING_LOGO_0, LOADING_LOGO_1, LOADING_LOGO_2, LOADING_LOGO_3 } from '@/constants/images';
import { BgColor, Lato, TextCatTitleColor, TextColor, TextLightGrayColor, TextWarnColor } from '@/constants/theme';
import { fadeIn } from '@/util/animation';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, BackHandler, Easing, Platform, StyleSheet, Text, View } from 'react-native';

import { QuestionCircle } from '@/components/icon/icon';

const ProgressTransaction = () => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim_notice = useRef(new Animated.Value(0)).current;
    const startedAtRef = useRef<number>(Date.now());

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

    const [elapsedSec, setElapsedSec] = useState(0);

    const createTimerText = (time: number) => {
        let min: string | number = parseInt((time / 60).toString());
        let sec: string | number = time % 60;

        if (min < 10) min = '0' + min.toString();
        if (sec < 10) sec = '0' + sec.toString();

        return min + ' : ' + sec;
    };

    useEffect(() => {
        if (elapsedSec % 60 >= 15) {
            fadeIn(Animated, fadeAnim_notice, 300);
        }
    }, [elapsedSec]);

    useEffect(() => {
        startedAtRef.current = Date.now();
        const updateElapsed = () => {
            setElapsedSec(Math.floor((Date.now() - startedAtRef.current) / 1000));
        };
        updateElapsed();

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

        const timerId = setInterval(updateElapsed, 250);

        return () => {
            clearInterval(timerId);
            animation.stop();
            progressAnim.stopAnimation();
            progressAnim.setValue(0);
        };
    }, [progressAnim]);

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
            <View style={styles.background} />
            <View style={[styles.box, { justifyContent: 'flex-start', flex: 6 }]}>
                <View style={[styles.counterBox, { flex: 2 }]}>
                    <View style={{ position: 'relative', height: 280 }}>
                        <Animated.Image style={[styles.logo, { opacity: 1 }]} source={LOADING_LOGO_0} />
                        <Animated.Image style={[styles.logo, { opacity: fadeAnim_1 }]} source={LOADING_LOGO_1} />
                        <Animated.Image style={[styles.logo, { opacity: fadeAnim_2 }]} source={LOADING_LOGO_2} />
                        <Animated.Image style={[styles.logo, { opacity: fadeAnim_3 }]} source={LOADING_LOGO_3} />
                    </View>
                    <Text style={styles.notice}>{TRANSACTION_PROCESS_TEXT}</Text>
                    <Text style={styles.counter}>{createTimerText(elapsedSec)}</Text>
                </View>
                <View style={[styles.counterBox, { flex: 1, width: '100%', justifyContent: 'center' }]}>
                    <Text style={[styles.description, { paddingBottom: 20, fontSize: 16 }]}>{TRANSACTION_PROCESS_DESCRIPTION_TEXT}</Text>
                    <Animated.View style={[styles.descriptionWrapper, { opacity: fadeAnim_notice }]}>
                        <View style={{ paddingTop: 3 }}>
                            <QuestionCircle size={15} color={TextWarnColor} />
                        </View>
                        <Text style={[styles.description, { color: TextWarnColor, lineHeight: 20, paddingLeft: 5 }]}>
                            {TRANSACTION_PROCESS_NOTICE_TEXT}
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: BgColor,
        opacity: 0.5,
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
        width: 120,
        height: 120,
        position: 'absolute',
        left: -60,
        top: '50%'
    },
    counterBox: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    notice: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: '600',
        color: TextColor,
        paddingBottom: 10
    },
    counter: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor
    },
    descriptionWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20
    },
    description: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextLightGrayColor,
        textAlign: 'center'
    }
});

export default ProgressTransaction;
