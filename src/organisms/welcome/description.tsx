import React, { useEffect, useState }from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ChakraPetch, GrayColor, Lato, TextColor, TextGrayColor, TextWarnColor } from "@/constants/theme";
import { ARROW_DISABLE, ARROW_ENABLE, FIRMA_LOGO } from "@/constants/images";
import WalletIcon from "react-native-vector-icons/Ionicons";

interface IProps {
    title: string;
    desc?: string;
}

const Description = ({title, desc}:IProps) => {

    const [arrowIndex, setArrowIndex] = useState(0);

    const handleArrowIndex = () => {
        setArrowIndex(arrowIndex => arrowIndex === 2? 0 : arrowIndex + 1);
    }

    useEffect(() => {
        handleArrowIndex();
        let timerId = setTimeout(function progress() {
            handleArrowIndex();
            timerId = setTimeout(progress, 500);
        }, 500);

        return () => {
            clearTimeout(timerId);
        }
    }, []);

    return (
        <View style={[styles.styledView]}>
            <View>
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
                {desc && <Text style={styles.desc}>{desc}</Text>}
            </View>
        </View>
    )
}

export default Description;

const styles = StyleSheet.create({
    styledView: {
        width: "100%",
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
    accent: {
        fontFamily: Lato,
        fontSize: 20,
        fontWeight: "bold",
        color: TextWarnColor,
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