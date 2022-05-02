import React from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { BorderColor, BoxDarkColor, FailedColor, Lato, PointColor, TextColor } from "@/constants/theme";
import { ScreenWidth } from "@/util/getScreenSize";
import ArrowButton from "../button/arrowButton";
import { useAppSelector } from "@/redux/hooks";
import NetworkBadge from "../parts/networkBadge";

interface Props {
    step: number,
    bgColor?: string;
    onPressEvent: Function;
}

const Header = ({step, bgColor = BoxDarkColor, onPressEvent}:Props) => {

    const {storage} = useAppSelector(state => state);

    return (
        <Pressable style={[styles.container, {backgroundColor: bgColor}]} onPress={()=>Keyboard.dismiss()}>
            <ArrowButton onPressEvent={onPressEvent}/>
            {step > 0?
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
            :
            storage.network !== "MainNet" && <NetworkBadge top={-5} title={storage.network} />
            }
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: ScreenWidth(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    stepBox: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
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
    },
    network: {
        fontFamily: Lato, 
        fontSize: 14,
        textAlign: "right", 
        color: FailedColor,
    }
})

export default Header;