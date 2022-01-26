import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "@/components/button/button";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { getAdrFromMnemonic } from "@/util/firma";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import MnemonicQuiz from "@/organims/createWallet/stepThree/mnemonicQuiz";
import { BgColor } from "@/constants/theme";
import { setNewWallet, setWalletViaAutoLogin } from "@/util/wallet";

type CreateStepThreeScreenNavigationProps = StackNavigationProp<StackParamList, Screens.CreateStepThree>;

export type CreateStepThreeParams = {
    wallet: any;
}

interface CreateStepThreeScreenProps {
    route: {params: CreateStepThreeParams};
    navigation: CreateStepThreeScreenNavigationProps;
}

const CreateStepThreeScreen: React.FunctionComponent<CreateStepThreeScreenProps> = (props) => {
    // const {navigation} = props;
    const {navigation, route} = props;
    const {params} = route;
    const {wallet} = params;

    const [confirm, setConfirm] = useState(false);
    
    const onCompleteCreateWallet = async() => {
        setConfirm(false);

        await setNewWallet(wallet.name, wallet.password, wallet.mnemonic);
        let adr = null;
        await getAdrFromMnemonic(wallet.mnemonic).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));
        await setWalletViaAutoLogin(adr + "|" + wallet.name);

        navigation.reset({routes: [{name: 'Home', params: {address: adr, walletName: wallet.name} }]});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    const handleConfirm = (result: boolean) => {
        setConfirm(result);
    }

    return (
        <Container
            title="Confirm seed phrase"
            step={3}
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <>
                <View style={styles.contentBox}>
                    <MnemonicQuiz mnemonic={wallet.mnemonic} handleConfirm={handleConfirm}/>
                </View>
                <View style={styles.buttonBox}>
                    <Button title='Confirm and finish' active={confirm} onPressEvent={onCompleteCreateWallet} />
                </View>
                </>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    contentBox: {
        marginVertical: 20,
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    }
})

export default CreateStepThreeScreen;

