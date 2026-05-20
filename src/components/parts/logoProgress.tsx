import React, { useEffect, useRef } from 'react';
import { GrayColor, TextColor } from '@/constants/theme';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LogoProgress = ({
    size,
    duration = 2000,
    style,
    fillColor = TextColor
}: {
    size: number;
    duration?: number;
    style?: StyleProp<ViewStyle>;
    fillColor?: string;
}) => {
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Sequence: 1 fills -> 2 fills -> 3 fills -> short pause -> 3 empties -> 2 empties -> 1 empties -> short pause.
    // Fill and empty use the same transition duration so the speed feels identical both ways.
    const fadeAnim_1 = progressAnim.interpolate({
        inputRange: [0, 0.1, 0.7, 0.8, 1],
        outputRange: [0, 1, 1, 0, 0]
    });

    const fadeAnim_2 = progressAnim.interpolate({
        inputRange: [0, 0.1, 0.2, 0.6, 0.7, 1],
        outputRange: [0, 0, 1, 1, 0, 0]
    });

    const fadeAnim_3 = progressAnim.interpolate({
        inputRange: [0, 0.2, 0.3, 0.5, 0.6, 1],
        outputRange: [0, 0, 1, 1, 0, 0]
    });

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(progressAnim, {
                toValue: 1,
                duration,
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
        };
    }, [duration, progressAnim]);

    return (
        <Svg width={size} height={size} viewBox="14 14 172 172" style={style} pointerEvents="none">
            <Path d="M98.58 16.77 26.59 57.85v82.29l13.71 7.79V65.82l58.28-33.29 26.25 15.03 2.98-14.12z" fill={GrayColor} />
            <Path
                d="M157.75 65.57v67.71l-58.86 33.63-31.19-17.83V81.69l31.24-17.86 31.24 17.8 13.86-7.88v-.24L99.02 47.82 54 73.51v83.66l45.67 26.07 73.74-42.09V57.5z"
                fill={GrayColor}
            />
            <Path
                d="m100.47 134.5-3.41-1.95V98.28l17.24-9.86-13.83-7.91-17.11 9.8v50.21l17.11 9.74 44.1-25.14-13.4-8.15z"
                fill={GrayColor}
            />
            <AnimatedPath
                id="line-1"
                d="M98.58 16.77 26.59 57.85v82.29l13.71 7.79V65.82l58.28-33.29 26.25 15.03 2.98-14.12z"
                fill={fillColor}
                opacity={fadeAnim_1}
            />
            <AnimatedPath
                id="line-2"
                d="M157.75 65.57v67.71l-58.86 33.63-31.19-17.83V81.69l31.24-17.86 31.24 17.8 13.86-7.88v-.24L99.02 47.82 54 73.51v83.66l45.67 26.07 73.74-42.09V57.5z"
                fill={fillColor}
                opacity={fadeAnim_2}
            />
            <AnimatedPath
                id="line-3"
                d="m100.47 134.5-3.41-1.95V98.28l17.24-9.86-13.83-7.91-17.11 9.8v50.21l17.11 9.74 44.1-25.14-13.4-8.15z"
                fill={fillColor}
                opacity={fadeAnim_3}
            />
        </Svg>
    );
};

export default LogoProgress;
