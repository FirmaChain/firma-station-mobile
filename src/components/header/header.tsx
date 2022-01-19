import { BorderColor, BoxColor, Lato, PointColor, TextColor } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenWidth } from "../../util/getScreenSize";
import ArrowButton from "../button/arrowButton";

const Header:  React.FC<{
        step: number,
        onPressEvent: Function;
    }> = ({step, onPressEvent}) => {

    return (
        <View style={styles.container}>
            <ArrowButton onPressEvent={onPressEvent}/>
            {step > 0 && 
            <View style={styles.stepBox}>
                <View style={step === 1? styles.step : styles.stepNone}>
                    <Text style={[styles.stepText, step === 1 && {opacity: 1}]}>{step}</Text>
                </View>
                <View style={styles.divier} />
                <View style={step === 2? styles.step : styles.stepNone}>
                    <Text style={[styles.stepText, step === 2 && {opacity: 1}]}>{step}</Text>
                </View>
                <View style={styles.divier} />
                <View style={step === 3? styles.step : styles.stepNone}>
                    <Text style={[styles.stepText, step === 3 && {opacity: 1}]}>{step}</Text>
                </View>
            </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: ScreenWidth(),
        backgroundColor: BoxColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    stepBox: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    stepText: {
        fontFamily: Lato,
        fontWeight: "bold",
        color: TextColor,
        fontSize: 14,
        textAlign: "center",
        opacity: 0,
    },
    step: {
        backgroundColor: PointColor,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
    },
    stepNone: {
        backgroundColor: BorderColor,
        width: 12,
        height: 12,
        borderRadius: 50,
    },
    divier: {
        width: 16,
        height: .5,
        backgroundColor: BorderColor,
    }
})

export default Header;