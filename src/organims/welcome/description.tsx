import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ChakraPetch, GrayColor, Lato, TextColor, TextGrayColor } from "../../constants/theme";
import WalletIcon from "react-native-vector-icons/Ionicons";
import { useEffect } from "react";
import { useState } from "react";
import { ARROW_DISABLE, ARROW_ENABLE, FIRMA_LOGO } from "@/constants/images";

const Description: React.FC<{
    title: string;
    desc: string;
}> = ({title, desc}) => {

    const [arrowIndex, setArrowIndex] = useState(0);
    useEffect(() => {
        let timer = setInterval(() => {
            setArrowIndex(arrowIndex => arrowIndex === 2? 0 : arrowIndex + 1);
        }, 500);
        return () => {
            clearInterval(timer);
        }
    }, []);

    return (
        <View style={styles.styledView}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.box}>
                <WalletIcon name={'ios-wallet-outline'} size={50} color={GrayColor}/>
                <View style={styles.arrowBox}>
                    <Image style={styles.arrow} source={arrowIndex === 0? ARROW_ENABLE : ARROW_DISABLE} />
                    <Image style={styles.arrow}  source={arrowIndex === 1? ARROW_ENABLE : ARROW_DISABLE} />
                    <Image style={styles.arrow}  source={arrowIndex === 2? ARROW_ENABLE : ARROW_DISABLE} />
                </View>
                <Image style={styles.logo} source={FIRMA_LOGO} />
            </View>
            <Text style={styles.desc}>{desc}</Text>
        </View>
    )
}

export default Description;

const styles = StyleSheet.create({
    styledView: {
        flex: 2,
        marginTop: -25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontFamily: ChakraPetch,
        fontWeight: "600",
        fontSize: 36,
        color: TextColor,
        textAlign: "center",
    },
    desc: {
        fontFamily: Lato,
        fontSize: 18,
        fontWeight: "normal",
        color: TextGrayColor,
        textAlign: "center",
    },
    box: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 48,
    },
    arrowBox: {
        width: 93,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    arrow: {
        width: 16,
        height: 16,
    },
    logo: {
        width: 50,
        height: 50,
    }
})