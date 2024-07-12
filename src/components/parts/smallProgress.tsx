import React, { useEffect, useRef } from "react";
import { LOADING_LOGO_0, LOADING_LOGO_1, LOADING_LOGO_2, LOADING_LOGO_3 } from "@/constants/images";
import { Animated, StyleSheet, View } from "react-native";
import { fadeIn, fadeOut } from "@/util/animation";

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

            if (inverse && (index >= 0 && index < 3)) fadeIn(Animated, animated[index], 300, 0.3);
            if (!inverse && (index >= 0 && index < 3)) fadeOut(Animated, animated[index], 300, 0);

            if (index <= -1 || index >= 3) inverse = !inverse;
            count = count + 2.5;
            if (count === 10) {
                count = 0;
            }
        }

        handleProgress();
        let timerId = setTimeout(function progress() {
            handleProgress();
            timerId = setTimeout(progress, 250);
        }, 250);

        return () => {
            clearTimeout(timerId);
        };
    }, [])

    return (
        <View style={styles.box}>
            <Animated.Image style={[styles.logo, { opacity: 0.5 }]} source={LOADING_LOGO_0} />
            <Animated.Image style={[styles.logo, { opacity: fadeAnim_1 }]} source={LOADING_LOGO_1} />
            <Animated.Image style={[styles.logo, { opacity: fadeAnim_2 }]} source={LOADING_LOGO_2} />
            <Animated.Image style={[styles.logo, { opacity: fadeAnim_3 }]} source={LOADING_LOGO_3} />
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 9,
        paddingHorizontal: 13,
    },
    logo: {
        width: 20,
        height: 20,
        position: "absolute",
        top: 0,
        left: 0
    },
})

export default SmallProgress;