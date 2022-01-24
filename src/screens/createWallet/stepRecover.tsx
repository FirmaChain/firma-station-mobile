import React, { useEffect, useState } from "react";
import { Screens, StackParamList } from "@/navigators/stackNavigators";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor, GrayColor, InputBgColor, Lato, TextColor, TextGrayColor, WhiteColor } from "@/constants/theme";
import { TextInput } from "react-native-gesture-handler";
import { Paste } from "@/components/icon/icon";
import Clipboard from "@react-native-clipboard/clipboard";
import Button from "@/components/button/button";
import { recoverFromMnemonic } from "@/util/firma";
import Toast from "react-native-toast-message";

type StepRecoverScreenNavigationProps = StackNavigationProp<StackParamList, Screens.StepRecover>;

interface StepRecoverScreenProps {
    navigation: StepRecoverScreenNavigationProps;
}

const StepRecoverScreen: React.FunctionComponent<StepRecoverScreenProps> = (props) => {
    const {navigation} = props;

    const [focus, setFocus] = useState(false);
    const [activeRecover, setActiveRecover] = useState(false);
    const [mnemonic, setMnemonic] = useState('');

    const handleBack = () => {
        navigation.goBack();
    }

    const pasteFromClipboard = async() => {
        const copied = await Clipboard.getString();
        setMnemonic(copied);
    }

    const handleMnemonic = (value: string) => {
        setMnemonic(value);
    }

    const handleRecoverViaSeed = async() => {
        const wallet = await recoverFromMnemonic(mnemonic);
        if(wallet === undefined) return Toast.show({
            type: 'error',
            text1: 'Check your mnemonic again.',
          });
        navigation.navigate(Screens.CreateStepOne, {wallet: wallet});
    }

    useEffect(() => {
        const mnemonicArr = mnemonic.split(' ');
        if(mnemonicArr.filter(item => item !== "").length === 24) setActiveRecover(true);
        if(mnemonicArr.filter(item => item !== "").length !== 24) setActiveRecover(false);
    }, [mnemonic]);
    

    return (
        <Container
            title="Recover Wallet"
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <View style={{flex: 2}}>
                            <View style={styles.wrapperH}>
                                <Text style={styles.title}>Enter seed phrase</Text>
                                <TouchableOpacity style={{flexDirection: "row"}} onPress={()=>pasteFromClipboard()}>
                                    <Text style={[styles.title,{paddingHorizontal: 5}]}>Paste</Text>
                                    <Paste size={20} color={GrayColor} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.inputWrapper, {borderColor: focus? WhiteColor : 'transparent'}]}>
                                <TextInput
                                    multiline={true}
                                    style={styles.input}
                                    value={mnemonic}
                                    selectionColor={WhiteColor}
                                    keyboardType="url"
                                    onChangeText={text=>handleMnemonic(text)} 
                                    onFocus={()=>setFocus(true)}
                                    onBlur={()=>setFocus(false)}/>
                            </View>
                        </View>
                        <View style={{flex: 1, justifyContent: "flex-end"}}>
                            <Button
                                title="Recover"
                                active={activeRecover}
                                onPressEvent={handleRecoverViaSeed}/>
                        </View>
                    </View>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        padding: 20
    },
    wrapperH:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
    },
    title: {
        color: TextGrayColor,
        fontFamily: Lato,
        fontSize: 16,
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

export default StepRecoverScreen;