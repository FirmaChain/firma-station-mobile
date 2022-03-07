import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "@/components/button/button";
import BioAuthModal from "@/components/modal/bioAuthModal";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { USE_BIO_AUTH } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { setChain } from "@/util/secureKeyChain";
import { setPasswordViaBioAuth, setWalletWithBioAuth } from "@/util/wallet";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import MnemonicQuiz from "./mnemonicQuiz";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.CreateStepThree>;

interface Props {
    wallet: any;
}

const StepThree = ({wallet}:Props) => {
    const navigation: ScreenNavgationProps = useNavigation();

    const [confirm, setConfirm] = useState(false);
    const [openBioAuthModal, setOpenBioAuthModal] = useState(false);
    const handleOpenBioAuthModal = (open:boolean) => {
        setOpenBioAuthModal(open);
    }

    const handleConfirm = (result: boolean) => {
        setConfirm(result);
    }
    
    const onCompleteCreateWallet = async() => {
        setConfirm(false);
        const useBioAuth = await setWalletWithBioAuth(wallet.name, wallet.password, wallet.mnemonic);
        if(useBioAuth){
            handleOpenBioAuthModal(true);
        } else {
            navigation.reset({routes: [{name: 'Home'}]});
        }
    }

    const MoveToHomeScreen = (result:boolean) => {
        if(result){
            confirmViaBioAuth().then(res => {
                if(res){
                    setPasswordViaBioAuth(wallet.password);
                    setChain(USE_BIO_AUTH + wallet.name, "true");
                    handleOpenBioAuthModal(false);
                    navigation.reset({routes: [{name: 'Home'}]});
                }
            });
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
                <BioAuthModal walletName={wallet.name} visible={openBioAuthModal} handleOpen={handleOpenBioAuthModal} handleResult={MoveToHomeScreen}/>
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

export default StepThree;