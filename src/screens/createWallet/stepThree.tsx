import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../../components/button/button";
import { Screens, StackParamList } from "../../navigators/stackNavigators";
import { encrypt, keyEncrypt } from "../../util/keystore";
import { getChain, setChain } from "../../util/secureKeyChain";
import { getAdrFromMnemonic } from "../../util/wallet";
import Container from "../../components/parts/containers/conatainer";
import ViewContainer from "../../components/parts/containers/viewContainer";
import MnemonicQuiz from "../../organims/createWallet/stepThree/mnemonicQuiz";
import { BgColor } from "@/constants/theme";

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
        const walletKey:string = keyEncrypt(wallet.name, wallet.password);
        
        const encWallet = encrypt(wallet.mnemonic, walletKey.toString());
        setChain(wallet.name, encWallet);
        let list = wallet.name;
        await getChain('test_3').then(res => {
            if(res) list += '/' + res.password;
        }).catch(error => console.log('error : ' + error));
        setChain('test_3', list);

        let adr = null;
        await getAdrFromMnemonic(wallet.mnemonic).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

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

