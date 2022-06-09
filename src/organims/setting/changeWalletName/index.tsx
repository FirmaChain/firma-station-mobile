import React, { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions, WalletActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { getUseBioAuth, getWalletList, removePasswordViaBioAuth, removeUseBioAuth, removeWallet, setBioAuth, setNewWallet, setUseBioAuth, setWalletList } from "@/util/wallet";
import { WALLETNAME_CHANGE_SUCCESS } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import Button from "@/components/button/button";
import AlertModal from "@/components/modal/alertModal";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import InputBox from "./inputBox";
import { updateArray } from "@/util/common";
import { GUIDE_URI } from "@/../config";


type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.ChangeWalletName>;

const ChangeWalletName = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const {wallet} = useAppSelector(state => state);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeButton, setActiveButton] = useState(false);

    const [newWalletName, setNewWalletName] = useState('');
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');

    const handleMnemonic = (mnemonic:string) => {
        setMnemonic(mnemonic);
    }

    const handleActiveButton = (active:boolean) => {
        setActiveButton(active)
    }

    const handleModalOpen = (open:boolean) => {
        setIsModalOpen(open);
        if(open === false){
            handleBack();
        }
    }

    const changeNewWalletName = async() => {
        CommonActions.handleLoadingProgress(true);
        await removeCurrentWallet();
        await createNewWallet();
        CommonActions.handleLoadingProgress(false);
    }

    const removeCurrentWallet = async() => {
        await removeWallet(wallet.name);
        await removePasswordViaBioAuth();
    }

    const createNewWallet = async() => {
        let newList:string = "";
        try {
            const result = await getWalletList();
            let arr = result? updateArray(result, wallet.name, newWalletName) : [];
            if(arr.length > 1){
                arr.map((item) => {
                    newList += item + "/";
                });
                newList = newList.slice(0, -1);
            }
            setWalletList(newList);

            const setWalletResult = await setNewWallet(newWalletName, password, mnemonic, false);
            if(setWalletResult){
                setIsModalOpen(true);
            }

            await handleUseBioAuthForNewWallet();
            WalletActions.handleWalletName(newWalletName);
            handleModalOpen(true);
        } catch (error) {
            console.log(error)
        }

    }

    const handleUseBioAuthForNewWallet = async() => {
        const result = await getUseBioAuth(wallet.name);
        if(result){
            setUseBioAuth(newWalletName);
        }
        setBioAuth(newWalletName, password);
        await removeUseBioAuth(wallet.name);
    }

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["changeWalletName"]});
        Linking.openURL(GUIDE_URI["changeWalletName"]);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Change wallet name"
            handleGuide={handleMoveToWeb}
            backEvent={handleBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <InputBox 
                            wallet={wallet} 
                            validate={handleActiveButton}
                            newWalletName={setNewWalletName}
                            password={setPassword}
                            mnemonic={handleMnemonic}/>
                        <View style={styles.buttonBox}>
                            <Button title='Change' active={activeButton} onPressEvent={changeNewWalletName} />
                        </View>

                        <AlertModal
                            visible={isModalOpen}
                            handleOpen={handleModalOpen}
                            title={'Change wallet name'}
                            desc={WALLETNAME_CHANGE_SUCCESS}
                            confirmTitle={"OK"}
                            type={"CONFIRM"}/>
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


export default ChangeWalletName;