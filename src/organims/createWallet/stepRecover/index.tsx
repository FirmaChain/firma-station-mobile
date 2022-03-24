import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { BgColor, InputBgColor, Lato, TextColor } from "@/constants/theme";
import { recoverFromMnemonic } from "@/util/firma";
import { CHECK_MNEMONIC } from "@/constants/common";
import Button from "@/components/button/button";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import InputBox from "./inputBox";
import Toast from "react-native-toast-message";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.StepRecover>;

const StepRecover = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const [activeRecover, setActiveRecover] = useState(false);
    const [mnemonic, setMnemonic] = useState('');

    const handleMnemonic = (mnemonic:string) => {
        setMnemonic(mnemonic);
    }

    const handleRecoverViaSeed = async() => {
        CommonActions.handleLoadingProgress(true);
        const wallet = await recoverFromMnemonic(mnemonic);
        CommonActions.handleLoadingProgress(false);
        if(wallet === undefined){
            return Toast.show({
                type: 'error',
                text1: CHECK_MNEMONIC,
            });
        }
        navigation.navigate(Screens.CreateStepOne, {mnemonic});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Recover Wallet"
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <InputBox handleMnemonic={handleMnemonic} activateRecover={setActiveRecover} />
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

export default StepRecover;