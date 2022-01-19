import React from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ScreenWidth } from "../../../util/getScreenSize";
import { BgColor, BoxColor, GrayColor, Lato, TextColor, TextGrayColor, TextWarnColor } from "@/constants/theme";
import { Copy } from "@/components/icon/icon";
import Toast from "react-native-toast-message";

const MnemonicGrid: React.FC<{
    mnemonic: string;
}> = ({mnemonic}) => {

    const mnemonicArr = mnemonic.split(' ');
    const warning = {
        msg_first: `If you lose your seed phrase it's `,
        accrent: `gone forever.`,
        msg_last: `Station doesn't store any data.`,
    }

    const handleMnemonicToClipboard = () => {
        Clipboard.setString(mnemonic);
        const msg = 'Copied your mnemonic';
        
        Toast.show({
            type: 'info',
            text1: msg,
          });
    }

    return (
        <View style={styles.conatainer}>
            <View style={styles.box}>
                <View style={styles.copyIconWrapper}>
                    <Text style={styles.copyText}>Press to copy</Text>
                    <Copy size={15} color={GrayColor} />
                </View>
                <TouchableOpacity style={styles.mnemonicContainer} onPress={() => handleMnemonicToClipboard()}>
                    {mnemonicArr.map((item, index) => {
                        return (
                            <Text key={index} style={styles.mnemonicItem}>{item}</Text>
                        )
                    })}
                </TouchableOpacity>
            </View>

            <View style={styles.wranContainer}>
                <Text style={styles.warnText}>{warning.msg_first}
                    <Text style={[styles.warnText, {fontWeight: 'bold'}]}>{warning.accrent}</Text>
                </Text>
                <Text style={styles.warnText}>{warning.msg_last}</Text>
            </View>
        </View>
    )
}

export default MnemonicGrid;

const styles = StyleSheet.create({
    conatainer: {
        marginHorizontal: 20,
    },
    box: {
        backgroundColor: BoxColor,
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 6,
        marginBottom: 20,
    },
    copyIconWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 5,
    },
    copyText: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextGrayColor,
        paddingHorizontal: 10,
    },
    mnemonicContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    mnemonicItem: {
        width: (ScreenWidth() - 80)/4,
        fontFamily: Lato,
        paddingVertical: 10,
        margin: 3,
        borderRadius: 4,
        backgroundColor: BgColor,
        color: TextColor,
        textAlign: 'center',
        fontSize: 12,
        overflow: 'hidden',
    },
    wranContainer: {
        fontFamily: Lato,
        backgroundColor: BoxColor,
        borderRadius: 4,
        padding: 20,
        overflow: 'hidden',
    },
    warnText: {
        fontSize: 14,
        lineHeight: 20,
        color: TextWarnColor,
    }
})