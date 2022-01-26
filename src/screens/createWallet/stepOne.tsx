import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Button from "@/components/button/button";
import InputSetVertical from "@/components/input/inputSetVertical";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { PasswordValidationCheck, WalletNameValidationCheck } from "@/util/validationCheck";
import { Wallet, createNewWallet, getAdrFromMnemonic } from "@/util/firma";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { setNewWallet, setWalletWithAutoLogin } from "@/util/wallet";

type CreateStepOneScreenNavigationProps = StackNavigationProp<StackParamList, Screens.CreateStepOne>;

export type CreateStepOneParams = {
    wallet?: any;
}

interface CreateStepOneScreenProps {
    route: {params: CreateStepOneParams};
    navigation: CreateStepOneScreenNavigationProps;
}

const CreateStepOneScreen: React.FunctionComponent<CreateStepOneScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {wallet = null} = params;

    const [walletName, setWalletName] = useState('');
    const [password, setPassword] = useState('');

    const [nameMessage, setNameMessage] = useState('');
    const [nameValidation, setNameValidation] = useState(false);

    const [pwMessage, setPwMessage] = useState('');
    const [pwValidation, setPwValidation] = useState(false);

    const [confirm, setConfirm] = useState(false);
    const [cMessage, setCMessage] = useState('');

    const walletNameText = {
        title : 'Wallet name',
        placeholder: 'Enter 5-20 alphanumeric characters'
    }
    const passwordText = {
        title : 'Password',
        placeholder: 'Must be at least 10 characters'
    }
    const confirmPasswordText = {
        title : 'Confirm password',
        placeholder: 'Confirm your password'
    }

    const onChangeWalletName = async(value: string) => {
        let result = (value.length >= 5 && value.length <= 20);
        let nameCheck = await WalletNameValidationCheck(value);
        
        let msg = result && !nameCheck? '' : nameCheck?  `"${value}" is already exists` : 'name must be between 5 and 20 characters';
        if(value.length === 0) msg = '';
        setWalletName(value);
        setNameValidation(result && !nameCheck);
        setNameMessage(msg);
    }

    const onChangePassword = (value: string) => {
        const result = PasswordValidationCheck(value);
        var msg = result? '' : 'Password must be longer than 10 characters';
        if(value.length === 0) msg = '';
        setPassword(value);
        setPwValidation(result);
        setPwMessage(msg);
    }

    const onChangeConfirmPassword = (value: string) => {
        var result = value === password;
        var msg = result? '' : 'Password does not match';
        if(value.length === 0){
            msg = '';
            result = false;
        }
        setConfirm(result);
        setCMessage(msg);
    }

    const onCreateWalletAndMoveToStepTwo = async() => {
        try {
            const result = await createNewWallet();
            const wallet: Wallet = {
                name: walletName,
                password: password,
                mnemonic: result?.mnemonic,
                privatekey: result?.privateKey,
            }

            navigation.navigate(Screens.CreateStepTwo, {wallet: wallet});
        } catch (error) {
            
        }
    }

    const onCompleteRecoverWallet = async() => {
        await setNewWallet(walletName, password, wallet.mnemonic);
        let adr = null;
        await getAdrFromMnemonic(wallet.mnemonic).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

        await setWalletWithAutoLogin(adr + "|" + walletName);

        navigation.reset({routes: [{name: 'Home', params: {address: adr, walletName: walletName} }]});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title={wallet? "Recover Wallet" : "New Wallet"}
            step={wallet? 0 : 1}
            backEvent={handleBack}>

            <ViewContainer bgColor={BgColor}>
                <View style={styles.contentBox}>
                    <ScrollView>
                        <InputSetVertical 
                            title={walletNameText.title}
                            message={nameMessage}
                            validation={nameValidation}
                            placeholder={walletNameText.placeholder} 
                            onChangeEvent={onChangeWalletName} />
                        <InputSetVertical 
                            title={passwordText.title}
                            message={pwMessage}
                            validation={pwValidation}
                            placeholder={passwordText.placeholder} 
                            secure={true} 
                            onChangeEvent={onChangePassword} />
                        <InputSetVertical 
                            title={confirmPasswordText.title} 
                            message={cMessage}
                            validation={confirm}
                            placeholder={confirmPasswordText.placeholder} 
                            secure={true} 
                            onChangeEvent={onChangeConfirmPassword} />
                    </ScrollView>
                    <View style={styles.buttonBox}>
                        <Button 
                            title={wallet? 'Recover' : 'Next'} 
                            active={confirm && nameValidation} 
                            onPressEvent={wallet? onCompleteRecoverWallet : onCreateWalletAndMoveToStepTwo} />
                    </View>
                </View>
            </ViewContainer>

        </Container>
    )
}


const styles = StyleSheet.create({
    contentBox: {
        flex: 3,
        paddingHorizontal: 20,
        marginTop: 30,
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
    }
})

export default CreateStepOneScreen;

