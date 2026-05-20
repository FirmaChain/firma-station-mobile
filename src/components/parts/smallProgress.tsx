import React, { useEffect, useRef } from 'react';
import { TextCatTitleColor } from '@/constants/theme';
import { fadeIn, fadeOut } from '@/util/animation';
import { Animated, StyleSheet, View } from 'react-native';

import LogoProgress from './logoProgress';

const SmallProgress = () => {
    const fadeAnim_1 = useRef(new Animated.Value(0)).current;
    const fadeAnim_2 = useRef(new Animated.Value(0)).current;
    const fadeAnim_3 = useRef(new Animated.Value(0)).current;

    const animated = [fadeAnim_1, fadeAnim_2, fadeAnim_3];

    useEffect(() => {
        let index = -1;
        let inverse = true;
        let count = 0;

        const handleProgress = () => {
            if (inverse && index < 3) index = index + 1;
            if (!inverse && index >= 0) index = index - 1;

            if (inverse && index >= 0 && index < 3) fadeIn(Animated, animated[index], 300, 0.3);
            if (!inverse && index >= 0 && index < 3) fadeOut(Animated, animated[index], 300, 0);

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
        };
    }, []);

    return (
        <View style={styles.box}>
            <LogoProgress size={19.5} fillColor={TextCatTitleColor} style={styles.box} />
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    }
});

export default SmallProgress;
