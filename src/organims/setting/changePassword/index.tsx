import Button from "@/components/button/button";
import AlertModal from "@/components/modal/alertModal";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { PASSWORD_CHANGE_FAIL, PASSWORD_CHANGE_SUCCESS, WALLET_LIST } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { removeChain, setChain } from "@/util/secureKeyChain";
import { getWalletList, getWalletWithAutoLogin, setBioAuth, setNewWallet } from "@/util/wallet";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { getUniqueId } from "react-native-device-info";
import InputBox from "./inputBox";


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
        if(status === 1) handleGoBack();
    }

    const changeNewPassword = async() => {
        CommonActions.handleLoadingProgress(true);
        await removeCurrentPassword();
        await createNewPassword();
        CommonActions.handleLoadingProgress(false);
    }

    const removeCurrentPassword = async() => {
        await removeChain(wallet.name)
            .then(res => console.log(res))
            .catch(error => console.log(error));
        
        let timestamp = 0;
        await getWalletWithAutoLogin().then(res => {
            if('') return null;
            const result = JSON.parse(res);
            timestamp = result.timestamp;
        }).catch(error => {
            console.log('error : ' + error);
            return null;
        })

        await removeChain(getUniqueId + timestamp.toString())
        .then(res => console.log(res))
        .catch(error => console.log(error));
    }

    const createNewPassword = async() => {
        let newList:string = '';
        await getWalletList().then(res => {
            let arr = res !== undefined? res : [];
            
            if(arr.length > 1){
                arr.filter(item => item !== wallet.name).map((item) => {
                    newList += item + "/";
                });
                newList = newList.slice(0, -1);
            }

            if(newList === ''){
                removeChain(WALLET_LIST);
            } else {
                setChain(WALLET_LIST, newList);
            }
        }).catch(error => {
            console.log(error)
        });

        await setNewWallet(wallet.name, newPassword, mnemonic)
            .then(() => {
                setStatus(1);
                setIsModalOpen(true);
            })
            .catch(error => console.log(error))
        setBioAuth(wallet.name, newPassword);
    }

    const handleGoBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Change password"
            backEvent={handleGoBack}>
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