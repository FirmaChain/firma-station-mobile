import React, { useContext, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { Wallet, createNewWallet } from "@/util/firma";
import Button from "@/components/button/button";
import InputSetVertical from "@/components/input/inputSetVertical";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { PasswordValidationCheck, WalletNameValidationCheck } from "@/util/validationCheck";
import { setBioAuth, setNewWallet, setWalletWithAutoLogin } from "@/util/wallet";
import { BgColor } from "@/constants/theme";
import { AppContext } from "@/util/context";
import { CONTEXT_ACTIONS_TYPE, 
    PLACEHOLDER_FOR_PASSWORD, 
    PLACEHOLDER_FOR_PASSWORD_CONFIRM, 
    PLACEHOLDER_FOR_WALLET_NAME, 
    WARNING_PASSWORD_IS_TOO_SHORT, 
    WARNING_PASSWORD_NOT_MATCH, 
    WARNING_WALLET_NAME_IS_TOO_SHORT } from "@/constants/common";

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

    const {dispatchEvent} = useContext(AppContext);

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
        placeholder: PLACEHOLDER_FOR_WALLET_NAME
    }
    const passwordText = {
        title : 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD
    }
    const confirmPasswordText = {
        title : 'Confirm password',
        placeholder: PLACEHOLDER_FOR_PASSWORD_CONFIRM
    }

    const onChangeWalletName = async(value: string) => {
        let result = (value.length >= 5 && value.length <= 20);
        let nameCheck = await WalletNameValidationCheck(value);
        
        let msg = result && !nameCheck? '' : nameCheck?  `"${value}" is already exists` : WARNING_WALLET_NAME_IS_TOO_SHORT;
        if(value.length === 0) msg = '';
        setWalletName(value);
        setNameValidation(result && !nameCheck);
        setNameMessage(msg);
    }

    const onChangePassword = (value: string) => {
        const result = PasswordValidationCheck(value);
        var msg = result? '' : WARNING_PASSWORD_IS_TOO_SHORT;
        if(value.length === 0) msg = '';
        setPassword(value);
        setPwValidation(result);
        setPwMessage(msg);
    }

    const onChangeConfirmPassword = (value: string) => {
        var result = value === password;
        var msg = result? '' : WARNING_PASSWORD_NOT_MATCH;
        if(value.length === 0){
            msg = '';
            result = false;
        }
        setConfirm(result);
        setCMessage(msg);
    }

    const onCreateWalletAndMoveToStepTwo = async() => {
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
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
            dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
        }
    }

    const onCompleteRecoverWallet = async() => {
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
        const address = await setNewWallet(walletName, password, wallet.mnemonic);
        await setWalletWithAutoLogin(JSON.stringify({
            name: walletName,
            address: address,
        }));

        setBioAuth(password);
        dispatchEvent &&dispatchEvent(CONTEXT_ACTIONS_TYPE["WALLET"], {
            name: walletName,
            address: address,
        });

        navigation.reset({routes: [{name: 'Home'}]});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <>
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
        </>
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

