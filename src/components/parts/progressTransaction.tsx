import React, { useEffect, useRef, useState } from "react";
import { LOADING_LOGO_0, LOADING_LOGO_1, LOADING_LOGO_2, LOADING_LOGO_3 } from "@/constants/images";
import { Animated, StyleSheet, Text, View } from "react-native";
import { fadeIn, fadeOut } from "@/util/animation";
import { TRANSACTION_PROCESS_TEXT } from "@/constants/common";
import { BgColor, Lato, TextCatTitleColor, TextColor } from "@/constants/theme";

const ProgressTransaction = () => {
    const fadeAnim_1 = useRef(new Animated.Value(0)).current;
    const fadeAnim_2 = useRef(new Animated.Value(0)).current;
    const fadeAnim_3 = useRef(new Animated.Value(0)).current;

    const animated = [ fadeAnim_1, fadeAnim_2, fadeAnim_3 ];

    const [counter, setCounter] = useState(0);

    const createTimerText = (time:number) => {
        let min:string|number = parseInt((time/60).toString());
        let sec:string|number = time%60;

        if(min < 10) min = "0" + min.toString();
        if(sec < 10) sec = "0" + sec.toString();

        return min + " : " + sec;
    }
    
    useEffect(() => {
        let index = -1;
        let inverse = true;
        let count = 0;
        const timer = setInterval(() => {
            count = count + 5;
            if(count === 10){
                setCounter(counter => counter + 1);
                count = 0;
            }
            if(inverse && index < 3) index = index + 1;
            if(!inverse && index >= 0) index = index - 1;

            if(inverse && (index >= 0  && index < 3)) fadeIn(animated[index]);
            if(!inverse && (index >= 0 && index < 3)) fadeOut(animated[index]);

            if(index <= -1 || index >= 3) inverse = !inverse;
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.background}/>
            <View style={[styles.box, {height: 250, justifyContent: "flex-start"}]}>
                <View>
                    <Animated.Image style={[styles.logo, {opacity: 1}]} source={LOADING_LOGO_0} />
                    <Animated.Image style={[styles.logo, {opacity: fadeAnim_1}]} source={LOADING_LOGO_1} />
                    <Animated.Image style={[styles.logo, {opacity: fadeAnim_2}]} source={LOADING_LOGO_2} />
                    <Animated.Image style={[styles.logo, {opacity: fadeAnim_3}]} source={LOADING_LOGO_3} />
                </View>
                <View style={styles.counterBox}>
                    <Text style={styles.notice}>{TRANSACTION_PROCESS_TEXT}</Text>
                    <Text style={styles.counter}>{createTimerText(counter)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    background: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: BgColor,
        opacity: .5,
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        width: "100%",
        paddingBottom: 50,
        alignItems: "center",
        flexDirection: "column",
    },
    logo: {
        width: 120,
        height: 120,
        position: "absolute",
        left: -60,
        top: 0,
    },
    logoSmall: {
        width: 50,
        height: 50,
        position: "absolute",
        left: -25,
        top: 0,
    },
    counterBox: {
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    notice: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "600",
        color: TextColor,
        paddingBottom: 10,
    },
    counter: {
        fontFamily: Lato,
        fontSize: 18,
        color: TextCatTitleColor,
    }
})

export default ProgressTransaction;