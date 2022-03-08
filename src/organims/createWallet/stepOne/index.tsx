import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@/redux/actions";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import Button from "@/components/button/button";
import BioAuthModal from "@/components/modal/bioAuthModal";
import { setPasswordViaBioAuth, setWalletWithBioAuth } from "@/util/wallet";
import { setChain } from "@/util/secureKeyChain";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { createNewWallet, Wallet } from "@/util/firma";
import { BgColor } from "@/constants/theme";
import { USE_BIO_AUTH } from "@/constants/common";
import InputBox from "./inputBox";
import Toast from "react-native-toast-message";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CreateStepOne>;

interface Props {
    wallet?: any;
}

const StepOne = ({wallet = null}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation(); 

    const [walletName, setWalletName] = useState('');
    const [password, setPassword] = useState('');
    const [validation, setValidation] = useState(false);
    const handleWalletInfo = (name: string, password: string, validation:boolean) => {
        setWalletName(name);
        setPassword(password);
        setValidation(validation);
    }

    const [openBioAuthModal, setOpenBioAuthModal] = useState(false);
    const handleOpenBioAuthModal = (open:boolean) => {
        setOpenBioAuthModal(open);
    }

    const onCreateWalletAndMoveToStepTwo = async() => {
        CommonActions.handleLoadingProgress(true);
        try {
            const result = await createNewWallet();
            if(result === undefined){
                CommonActions.handleLoadingProgress(false);
                return Toast.show({
                    type: 'error',
                    text1: 'Wallet creation failed. Please try again.',
                });
            }
            const wallet: Wallet = {
                name: walletName,
                password: password,
                mnemonic: result.mnemonic,
                privatekey: result.privateKey,
            }

            navigation.navigate(Screens.CreateStepTwo, {wallet: wallet});
        } catch (error) {
            CommonActions.handleLoadingProgress(false);
        }
    }

    const onCompleteRecoverWallet = async() => {
        const useBioAuth = await setWalletWithBioAuth(walletName, password, wallet.mnemonic);
        if(useBioAuth){
            handleOpenBioAuthModal(true);
        } else {
            navigation.reset({routes: [{name: 'Home'}]});
        }
    }

    const MoveToHomeScreen = (result:boolean) => {
        if(result){
            setPasswordViaBioAuth(wallet.password);
            setChain(USE_BIO_AUTH + wallet.name, "true");
            handleOpenBioAuthModal(false);
            navigation.reset({routes: [{name: 'Home'}]});
        } else {
            handleOpenBioAuthModal(false);
            navigation.reset({routes: [{name: 'Home'}]});
        }
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
                <Pressable style={styles.contentBox} onPress={() => Keyboard.dismiss()}>
                    <InputBox walletInfo={handleWalletInfo}/>
                    {wallet && <BioAuthModal walletName={wallet.name} visible={openBioAuthModal} handleOpen={handleOpenBioAuthModal} handleResult={MoveToHomeScreen}/>}
                    <View style={styles.buttonBox}>
                        <Button 
                            title={wallet? 'Recover' : 'Next'} 
                            active={validation} 
                            onPressEvent={wallet? onCompleteRecoverWallet : onCreateWalletAndMoveToStepTwo} />
                    </View>
                </Pressable>
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

export default StepOne;