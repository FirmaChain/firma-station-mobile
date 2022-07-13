import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenWidth } from "@/util/getScreenSize";
import { BgColor, BoxColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import { COPIED_CLIPBOARD, MNEMONIC_WARN_MESSAGE } from "@/constants/common";
import TextButton from "@/components/button/textButton";
import WarnContainer from "@/components/parts/containers/warnContainer";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

interface IProps {
    mnemonic: string;
}

const MnemonicGrid = ({mnemonic}:IProps) => {

    const mnemonicArr = mnemonic.split(' ');

    const handleMnemonicToClipboard = () => {
        Clipboard.setString(mnemonic);
        Toast.show({
            type: 'info',
            text1: COPIED_CLIPBOARD + "mnemonic",
        });
    }

    return (
        <View style={styles.conatainer}>
            <View style={styles.copyIconWrapper}>
                <TextButton title={"Press to copy"} onPressEvent={handleMnemonicToClipboard} />
            </View>
            <View style={[styles.box, styles.mnemonicContainer]}>
                {mnemonicArr.map((item, index) => {
                    return (
                        <Text key={index} style={styles.mnemonicItem}>{item}</Text>
                    )
                })}
            </View>
            
            <WarnContainer text={MNEMONIC_WARN_MESSAGE} />
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
        paddingVertical: 10,
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
})