import React from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import { StyleSheet, Text, View } from "react-native";
import { ScreenWidth } from "@/util/getScreenSize";
import { BgColor, BoxColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import Toast from "react-native-toast-message";
import TextButton from "@/components/button/textButton";
import WarnContainer from "@/components/parts/containers/warnContainer";
import { MNEMONIC_WARN_MESSAGE } from "@/constants/common";

const MnemonicGrid: React.FC<{
    mnemonic: string;
}> = ({mnemonic}) => {

    const mnemonicArr = mnemonic.split(' ');

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