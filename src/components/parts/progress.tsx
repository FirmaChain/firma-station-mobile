import React, { useEffect, useRef } from "react";
import { LOADING_LOGO_0, LOADING_LOGO_1, LOADING_LOGO_2, LOADING_LOGO_3 } from "@/constants/images";
import { Animated, StyleSheet, View } from "react-native";

const Progress = () => {
    const fadeAnim_1 = useRef(new Animated.Value(0)).current;
    const fadeAnim_2 = useRef(new Animated.Value(0)).current;
    const fadeAnim_3 = useRef(new Animated.Value(0)).current;

    const animated = [ fadeAnim_1, fadeAnim_2, fadeAnim_3 ];

    const fadeIn = (value:Animated.Value) => {
        Animated.timing(value, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const fadeOut = (value:Animated.Value) => {
        Animated.timing(value, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        let index = -1;
        let inverse = true;
        const timer = setInterval(() => {
            if(index <= -1 || index >= 3) inverse = !inverse;
            if(inverse && index < 3) index = index + 1;
            if(!inverse && index >= 0) index = index - 1;

            if(inverse && (index >= 0  && index < 3)) fadeIn(animated[index]);
            if(!inverse && (index >= 0 && index < 3)) fadeOut(animated[index]);
        }, 500);
    
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.background}/>
            <Animated.Image style={[styles.logo, {opacity: 1}]} source={LOADING_LOGO_0} />
            <Animated.Image style={[styles.logo, {opacity: fadeAnim_1}]} source={LOADING_LOGO_1} />
            <Animated.Image style={[styles.logo, {opacity: fadeAnim_2}]} source={LOADING_LOGO_2} />
            <Animated.Image style={[styles.logo, {opacity: fadeAnim_3}]} source={LOADING_LOGO_3} />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
    },
    background: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        opacity: .5,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 50,
        height: 50,
        position: "absolute",
    }
})

export default Progress;