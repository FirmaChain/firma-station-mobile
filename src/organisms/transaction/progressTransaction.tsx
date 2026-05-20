import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TRANSACTION_PROCESS_DESCRIPTION_TEXT, TRANSACTION_PROCESS_NOTICE_TEXT, TRANSACTION_PROCESS_TEXT } from '@/constants/common';
import { BgColor, Lato, TextCatTitleColor, TextColor, TextLightGrayColor, TextWarnColor } from '@/constants/theme';
import { fadeIn } from '@/util/animation';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, BackHandler, Easing, Platform, StyleSheet, Text, View } from 'react-native';

import { QuestionCircle } from '@/components/icon/icon';
import LogoProgress from '@/components/parts/logoProgress';

const getNow = () => (typeof globalThis.performance?.now === 'function' ? globalThis.performance.now() : Date.now());

const ProgressTransaction = () => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim_notice = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const elapsedSecRef = useRef(0);
    const noticeShownRef = useRef(false);

    const [elapsedSec, setElapsedSec] = useState(0);

    const createTimerText = (time: number) => {
        let min: string | number = parseInt((time / 60).toString());
        let sec: string | number = time % 60;

        if (min < 10) min = '0' + min.toString();
        if (sec < 10) sec = '0' + sec.toString();

        return min + ' : ' + sec;
    };

    useEffect(() => {
        if (elapsedSec >= 15 && !noticeShownRef.current) {
            noticeShownRef.current = true;
            fadeIn(Animated, fadeAnim_notice, 300);
        }
    }, [elapsedSec, fadeAnim_notice]);

    useEffect(() => {
        const startedAt = getNow();

        const clearTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };

        const updateElapsed = () => {
            const now = getNow();
            const targetElapsed = Math.floor((now - startedAt) / 1000);
            const currentElapsed = elapsedSecRef.current;
            const elapsedMs = now - startedAt;

            if (currentElapsed < targetElapsed) {
                const nextElapsed = currentElapsed + 1;
                elapsedSecRef.current = nextElapsed;
                setElapsedSec(nextElapsed);

                const catchUpDelay = nextElapsed < targetElapsed ? 50 : Math.max(1000 - (elapsedMs % 1000), 50);
                timerRef.current = setTimeout(updateElapsed, catchUpDelay);
                return;
            }

            timerRef.current = setTimeout(updateElapsed, Math.max(1000 - (elapsedMs % 1000), 50));
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

        return () => {
            clearTimer();
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
                    <View style={{ height: 280, justifyContent: 'flex-end', padding: 24 }}>
                        <LogoProgress size={115} />
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
