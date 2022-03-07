import React, { useState } from "react";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import Button from "@/components/button/button";
import { RECOVER_INFO_MESSAGE } from "@/constants/common";
import QRCodeScannerModal from "@/components/modal/qrCodeScanner";
import { recoverFromMnemonic } from "@/util/firma";
import Toast from "react-native-toast-message";
import WarnContainer from "@/components/parts/containers/warnContainer";
import { CommonActions } from "@/redux/actions";

type RecoverWalletScreenNavigationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

interface RecoverWalletScreenProps {
    navigation: RecoverWalletScreenNavigationProps;
}

const RecoverWalletScreen: React.FunctionComponent<RecoverWalletScreenProps> = (props) => {
    const {navigation} = props;

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
                        <View style={{paddingBottom: 20}}>
                            <Button
                                title="Use seed phrase"
                                active={true}
                                border={true}
                                onPressEvent={handleRecoverViaSeed}/>
                        </View>
                        <View style={{paddingBottom: 20}}>
                            <Button
                                title="Scan QR code"
                                active={true}
                                border={true}
                                onPressEvent={() => handleRecoverViaQR(true)}/>
                        </View>

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

export default RecoverWalletScreen;