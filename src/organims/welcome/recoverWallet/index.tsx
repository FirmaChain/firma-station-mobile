import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "@/components/button/button";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import { recoverFromMnemonic } from "@/util/firma";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Toast from "react-native-toast-message";
import WarnContainer from "@/components/parts/containers/warnContainer";
import QRCodeScannerModal from "@/components/modal/qrCodeScanner";
import { RECOVER_INFO_MESSAGE } from "@/constants/common";
import RecoverMenus from "./recoverMenus";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const RecoverWallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    
    const [active, setActive] = useState(false);

    const handleBack = () => {
        navigation.goBack();
    }

    const recoverWalletViaQR = async(mnemonic: string) => {
        CommonActions.handleLoadingProgress(true);
        const wallet = await recoverFromMnemonic(mnemonic);
        CommonActions.handleLoadingProgress(false);
        if(wallet === undefined){
            return Toast.show({
                type: 'error',
                text1: 'Check your mnemonic again.',
            });
        }
        navigation.navigate(Screens.CreateStepOne, {wallet: wallet});
    }

    const handleRecoverViaSeed = () => {
        navigation.navigate(Screens.StepRecover);
    }

    const handleRecoverViaQR = (value:boolean) => {
        setActive(value);
    }


    return (
        <Container
            title="Recover Wallet"
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <RecoverMenus recoverViaSeed={handleRecoverViaSeed} recoverViaQR={handleRecoverViaQR} />
                        <WarnContainer text={RECOVER_INFO_MESSAGE}/>
                        <QRCodeScannerModal visible={active} handleOpen={handleRecoverViaQR} ReaderHandler={recoverWalletViaQR} />
                    </View>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    }
})

export default RecoverWallet;