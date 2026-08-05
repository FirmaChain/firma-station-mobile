import React, { useCallback } from 'react';
import { TRANSACTION_PROCESS_DESCRIPTION_TEXT, TRANSACTION_PROCESS_NOTICE_TEXT, TRANSACTION_PROCESS_TEXT } from '@/constants/common';
import { BgColor, Lato, TextCatTitleColor, TextColor, TextLightGrayColor, TextWarnColor } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
    createAnimatedComponent,
    useAnimatedProps,
    useAnimatedStyle,
    useFrameCallback,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import { QuestionCircle } from '@/components/icon/icon';
import LogoProgress from '@/components/parts/logoProgress';

const createTimerText = (time: number) => {
    'worklet';

    let min: string | number = parseInt((time / 60).toString());
    let sec: string | number = time % 60;

    if (min < 10) min = '0' + min.toString();
    if (sec < 10) sec = '0' + sec.toString();

    return min + ' : ' + sec;
};

const AnimatedTextInput = createAnimatedComponent(TextInput);

const ProgressTransaction = () => {
    const startedAt = useSharedValue(-1);
    const elapsedSec = useSharedValue(0);
    const noticeOpacity = useSharedValue(0);

    useFrameCallback(({ timestamp }) => {
        if (startedAt.value < 0) {
            startedAt.value = timestamp;
            return;
        }

        const nextElapsed = Math.max(0, Math.floor((timestamp - startedAt.value) / 1000));

        if (nextElapsed !== elapsedSec.value) {
            elapsedSec.value = nextElapsed;
            if (nextElapsed >= 15 && noticeOpacity.value === 0) {
                noticeOpacity.value = withTiming(1, { duration: 300 });
            }
        }
    });

    const timerAnimatedProps = useAnimatedProps(() => {
        const text = createTimerText(elapsedSec.value);

        return {
            text,
            defaultValue: text
        };
    });

    const noticeAnimatedStyle = useAnimatedStyle(() => ({
        opacity: noticeOpacity.value
    }));

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
                    <View style={styles.counterWrapper}>
                        <AnimatedTextInput
                            animatedProps={timerAnimatedProps}
                            editable={false}
                            caretHidden
                            contextMenuHidden
                            selectTextOnFocus={false}
                            showSoftInputOnFocus={false}
                            underlineColorAndroid="transparent"
                            pointerEvents="none"
                            style={styles.counter}
                        />
                    </View>
                </View>
                <View style={[styles.counterBox, { flex: 1, width: '100%', justifyContent: 'center' }]}>
                    <Text style={[styles.description, { paddingBottom: 20, fontSize: 16 }]}>{TRANSACTION_PROCESS_DESCRIPTION_TEXT}</Text>
                    <Animated.View style={[styles.descriptionWrapper, noticeAnimatedStyle]}>
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
    counterWrapper: {
        width: 110,
        alignItems: 'center',
        justifyContent: 'center'
    },
    counter: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
        textAlign: 'center',
        padding: 0,
        margin: 0,
        backgroundColor: 'transparent',
        includeFontPadding: false,
        fontVariant: ['tabular-nums']
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
