import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "@/components/button/button";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import MnemonicQuiz from "@/organims/createWallet/stepThree/mnemonicQuiz";
import { BgColor } from "@/constants/theme";
import { setBioAuth, setNewWallet, setPasswordForEstimateGas, setWalletWithAutoLogin } from "@/util/wallet";
import { CommonActions, WalletActions } from "@/redux/actions";

type CreateStepThreeScreenNavigationProps = StackNavigationProp<StackParamList, Screens.CreateStepThree>;

export type CreateStepThreeParams = {
    wallet: any;
}

interface CreateStepThreeScreenProps {
    route: {params: CreateStepThreeParams};
    navigation: CreateStepThreeScreenNavigationProps;
}

const CreateStepThreeScreen: React.FunctionComponent<CreateStepThreeScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {wallet} = params;

    const [confirm, setConfirm] = useState(false);
    
    const onCompleteCreateWallet = async() => {
        CommonActions.handleLoadingProgress(true);
        setConfirm(false);
        const address = await setNewWallet(wallet.name, wallet.password, wallet.mnemonic);
        await setWalletWithAutoLogin(JSON.stringify({
            name: wallet.name,
            address: address,
        }));

        await setPasswordForEstimateGas(wallet.password);
        setBioAuth(wallet.password);

        WalletActions.handleWalletName(wallet.name);
        WalletActions.handleWalletAddress(address === null? "" : address);

        navigation.reset({routes: [{name: 'Home'}]});
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

