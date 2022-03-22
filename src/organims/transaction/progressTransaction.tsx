import React, { useCallback, useEffect, useRef, useState } from "react";
import { LOADING_LOGO_0, LOADING_LOGO_1, LOADING_LOGO_2, LOADING_LOGO_3 } from "@/constants/images";
import { Animated, BackHandler, Platform, StyleSheet, Text, View } from "react-native";
import { fadeIn, fadeOut } from "@/util/animation";
import { TRANSACTION_PROCESS_DESCRIPTION_TEXT, TRANSACTION_PROCESS_NOTICE_TEXT, TRANSACTION_PROCESS_TEXT } from "@/constants/common";
import { BgColor, Lato, TextCatTitleColor, TextColor, TextLightGrayColor, TextWarnColor } from "@/constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { QuestionCircle } from "@/components/icon/icon";

const ProgressTransaction = () => {

    const fadeAnim_1 = useRef(new Animated.Value(0)).current;
    const fadeAnim_2 = useRef(new Animated.Value(0)).current;
    const fadeAnim_3 = useRef(new Animated.Value(0)).current;
    const fadeAnim_notice = useRef(new Animated.Value(0)).current;

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
        if(counter % 60 >= 15){ 
            fadeIn(fadeAnim_notice);
        }
    }, [counter])
    
    useEffect(() => {
        let index = -1;
        let inverse = true;
        let count = 0;

        const handleProgress = () => {
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
        }

        handleProgress();
        let timerId = setTimeout(function progress() {
            handleProgress();
            timerId = setTimeout(progress, 500);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            if(Platform.OS === "android"){
                const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
                return () => backHandler.remove()
            }
        }, [])
    )

    return (
        <View style={styles.container}>
            <View style={styles.background}/>
            <View style={[styles.box, {justifyContent: "flex-start", flex: 6}]}>
                <View style={[styles.counterBox,{flex: 2}]}>
                    <View style={{position:"relative", height: 280}}>
                        <Animated.Image style={[styles.logo, {opacity: 1}]} source={LOADING_LOGO_0} />
                        <Animated.Image style={[styles.logo, {opacity: fadeAnim_1}]} source={LOADING_LOGO_1} />
                        <Animated.Image style={[styles.logo, {opacity: fadeAnim_2}]} source={LOADING_LOGO_2} />
                        <Animated.Image style={[styles.logo, {opacity: fadeAnim_3}]} source={LOADING_LOGO_3} />
                    </View>
                    <Text style={styles.notice}>{TRANSACTION_PROCESS_TEXT}</Text>
                    <Text style={styles.counter}>{createTimerText(counter)}</Text>
                </View>
                <View style={[styles.counterBox,{flex: 1, width: "100%", justifyContent: "center"}]}>
                    <Text style={[styles.description, {paddingBottom: 20, fontSize: 16}]}>{TRANSACTION_PROCESS_DESCRIPTION_TEXT}</Text>
                    <Animated.View style={[styles.descriptionWrapper, {opacity: fadeAnim_notice}]}>
                        <View style={{paddingTop: 3}}>
                            <QuestionCircle size={15} color={TextWarnColor} />
                        </View>
                        <Text style={[styles.description, {color: TextWarnColor, lineHeight: 20, paddingLeft: 5}]}>{TRANSACTION_PROCESS_NOTICE_TEXT}</Text>
                    </Animated.View>
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
        paddingTop: getStatusBarHeight(),
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
        top: "50%",
    },
    counterBox: {
        alignItems: "center",
        justifyContent: "center",
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
    },
    descriptionWrapper: {
        width: "100%", 
        flexDirection:"row", 
        justifyContent: "center", 
        alignItems: "flex-start", 
        paddingHorizontal: 20, 
    },
    description: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextLightGrayColor,
        textAlign: "center",
    },

})

export default ProgressTransaction;