import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { recoverFromMnemonic } from "@/util/firma";
import { checkCameraPermission } from "@/util/permission";
import { CHECK_MNEMONIC, RECOVER_INFO_MESSAGE } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import { GUIDE_URI } from "@/../config";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import WarnContainer from "@/components/parts/containers/warnContainer";
import QRCodeScannerModal from "@/components/modal/qrCodeScanner";
import RecoverMenus from "./recoverMenus";
import Toast from "react-native-toast-message";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const RecoverWallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    const {common} = useAppSelector(state => state);

    const [active, setActive] = useState(false);

    const recoverWalletViaQR = async(mnemonic: string) => {
        try {
            CommonActions.handleLoadingProgress(true);
            await recoverFromMnemonic(mnemonic);
            CommonActions.handleLoadingProgress(false);
            navigation.navigate(Screens.CreateStepOne, {mnemonic: mnemonic});
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
            Toast.show({
                type: 'error',
                text1: CHECK_MNEMONIC,
            });
        }
    }

    const handleRecoverViaSeed = () => {
        navigation.navigate(Screens.StepRecover);
    }

    const handleRecoverViaQR = async(value:boolean) => {
        let permissionGranted = value;
        if(value){
            permissionGranted = await checkCameraPermission();    
            setActive(permissionGranted);
        } else {
            setActive(value);
        }
    }

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["recoverWallet"]});
        Linking.openURL(GUIDE_URI["recoverWallet"]);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        if(common.appState !== "active"){
            handleRecoverViaQR(false);
        }
    }, [common.appState])

    return (
        <Container
            title="Recover Wallet"
            handleGuide={handleMoveToWeb}
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <RecoverMenus recoverViaSeed={handleRecoverViaSeed} recoverViaQR={handleRecoverViaQR} />
                        <WarnContainer text={RECOVER_INFO_MESSAGE}/>
                        {active && <QRCodeScannerModal visible={active} handleOpen={handleRecoverViaQR} ReaderHandler={recoverWalletViaQR} />}
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