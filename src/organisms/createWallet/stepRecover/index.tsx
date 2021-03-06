import React, { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { BgColor, InputBgColor, Lato, TextColor } from "@/constants/theme";
import { recoverFromMnemonic } from "@/util/firma";
import { CHECK_MNEMONIC, RECOVER_WALLET_FAILED } from "@/constants/common";
import Button from "@/components/button/button";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import InputBox from "./inputBox";
import Toast from "react-native-toast-message";
import { GUIDE_URI } from "@/../config";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.StepRecover>;

const StepRecover = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const [activeRecover, setActiveRecover] = useState(false);
    const [mnemonic, setMnemonic] = useState('');

    const handleMnemonic = (mnemonic:string) => {
        setMnemonic(mnemonic);
    }

    const handleRecoverViaSeed = async() => {
        try {
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
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: RECOVER_WALLET_FAILED,
            });
        }
    }

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["recoverWallet"]});
        Linking.openURL(GUIDE_URI["recoverWallet"]);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Recover Wallet"
            handleGuide={handleMoveToWeb}
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