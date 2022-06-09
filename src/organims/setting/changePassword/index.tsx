import React, { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { removePasswordViaBioAuth, removeWallet, setBioAuth, setNewWallet } from "@/util/wallet";
import { PASSWORD_CHANGE_FAIL, PASSWORD_CHANGE_SUCCESS } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import Button from "@/components/button/button";
import AlertModal from "@/components/modal/alertModal";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import InputBox from "./inputBox";
import { GUIDE_URI } from "@/../config";


type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.ChangePassword>;

const ChangePassword = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const {wallet} = useAppSelector(state => state);

    const [status, setStatus] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeButton, setActiveButton] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');

    const handleNewPassword = (password:string) => {
        setNewPassword(password);
    }

    const handleMnemonic = (mnemonic:string) => {
        setMnemonic(mnemonic);
    }

    const handleActiveButton = (active:boolean) => {
        setActiveButton(active)
    }

    const handleModalOpen = (open:boolean) => {
        setIsModalOpen(open);
        if(status === 1) handleBack();
    }

    const changeNewPassword = async() => {
        CommonActions.handleLoadingProgress(true);
        await removeCurrentPassword();
        await createNewPassword();
        CommonActions.handleLoadingProgress(false);
    }

    const removeCurrentPassword = async() => {
        await removeWallet(wallet.name);
        await removePasswordViaBioAuth();
    }

    const createNewPassword = async() => {
        try {
            const result = await setNewWallet(wallet.name, newPassword, mnemonic, false);
            if(result){
                setStatus(1);
                setIsModalOpen(true);
                setBioAuth(wallet.name, newPassword);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["changePassword"]});
        Linking.openURL(GUIDE_URI["changePassword"]);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Change password"
            handleGuide={handleMoveToWeb}
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <InputBox 
                            wallet={wallet} 
                            validate={handleActiveButton}
                            newPassword={handleNewPassword}
                            mnemonic={handleMnemonic}/>
                        <View style={styles.buttonBox}>
                            <Button title='Change' active={activeButton} onPressEvent={changeNewPassword} />
                        </View>

                        <AlertModal
                            visible={isModalOpen}
                            handleOpen={handleModalOpen}
                            title={status === 0?'Wrong password':'Change password'}
                            desc={status === 0?PASSWORD_CHANGE_FAIL:PASSWORD_CHANGE_SUCCESS}
                            confirmTitle={"OK"}
                            type={status === 0?"ERROR":"CONFIRM"}/>
                    </View>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        paddingHorizontal: 20,
    },
    wallet:{
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa',
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
    }
})


export default ChangePassword;