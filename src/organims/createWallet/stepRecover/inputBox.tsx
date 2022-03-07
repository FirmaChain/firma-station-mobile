import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import TextButton from "@/components/button/textButton";
import { InputBgColor, Lato, TextColor, WhiteColor } from "@/constants/theme";

interface Props {
    handleMnemonic: (mnemonic:string) => void;
    activateRecover: (active:boolean) => void;
}

const InputBox = ({activateRecover}:Props) => {
    const [focus, setFocus] = useState(false);
    const [mnemonic, setMnemonic] = useState('');

    const handleMnemonic = (value: string) => {
        setMnemonic(value);
    }

    const pasteFromClipboard = async() => {
        const copied = await Clipboard.getString();
        setMnemonic(copied);
    }

    useEffect(() => {
        handleMnemonic(mnemonic);
        const mnemonicArr = mnemonic.split(' ');
        if(mnemonicArr.filter(item => item !== "").length !== 24) activateRecover(false);
        if(mnemonicArr.filter(item => item !== "").length === 24){
            activateRecover(true);
        }
    }, [mnemonic]);

    return (
        <Pressable onPress={() => Keyboard.dismiss()} style={{flex: 2}}>
            <View style={styles.wrapperH}>
                <Text style={styles.title}>Enter seed phrase</Text>
                <TextButton title={"Paste"} onPressEvent={pasteFromClipboard} />
            </View>
            <View style={[styles.inputWrapper, {borderColor: focus? WhiteColor : 'transparent'}]}>
                <TextInput
                    multiline={true}
                    style={styles.input}
                    value={mnemonic}
                    selectionColor={WhiteColor}
                    keyboardType="url"
                    onChangeText={text => handleMnemonic(text)} 
                    onFocus={()=>setFocus(true)}
                    onBlur={()=>setFocus(false)}/>
            </View>
        </Pressable>
    )

}

const styles = StyleSheet.create({
    wrapperH:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
    title: {
        color: TextColor,
        fontFamily: Lato,
        fontSize: 14,
    },
    inputWrapper: {
        height: 200,
        marginVertical: 20,
        padding: 20,
        backgroundColor: InputBgColor,
        borderWidth: 1,
        borderRadius: 4,
    },
    input: {
        color: TextColor,
        flex: 1,
    }
})

export default InputBox;