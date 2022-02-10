import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { PASSWORD_CHANGE_FAIL, PASSWORD_CHANGE_SUCCESS, PLACEHOLDER_FOR_PASSWORD, PLACEHOLDER_FOR_PASSWORD_CONFIRM, WARNING_PASSWORD_NOT_MATCH } from "@/constants/common";
import { getWalletWithAutoLogin, setBioAuth, setNewWallet } from "@/util/wallet";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { getUniqueId } from "react-native-device-info";
import Button from "../../components/button/button";
import InputSetVertical from "../../components/input/inputSetVertical";
import AlertModal from "../../components/modal/alertModal";
import { BgColor } from "../../constants/theme";
import { Screens, StackParamList } from "../../navigators/appRoutes";
import { decrypt, keyEncrypt } from "../../util/keystore";
import { getChain, removeChain } from "../../util/secureKeyChain";
import { PasswordValidationCheck } from "../../util/validationCheck";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.ChangePassword>;

export type ChangePasswordParams = {
    walletName: string;
}

interface ChangePasswordProps {
    route: {params: ChangePasswordParams};
    navigation: ScreenNavgationProps;
}

const ChangePasswordScreen: React.FunctionComponent<ChangePasswordProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {walletName} = params;

    // 0: need to password confirm
    // 1: changed password
    const [status, setStatus] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPW, setCurrentPW] = useState('');
    const [newPW, setNewPW] = useState('');

    const [mnemonic, setMnemonic] = useState('');

    const [newPwMessage, setNewPwMessage] = useState('');
    const [newPwValidation, setNewPwValidation] = useState(false);

    const [confirmPwMessage, setConfirmPwMessage] = useState('');
    const [confirmPwValidation, setConfirmPwValidation] = useState(false);

    const currentPasswordTextObj = {
        title: "Current password",
        placeholder: PLACEHOLDER_FOR_PASSWORD,
    }

    const newPasswordTextObj = {
        title: "New password",
        placeholder: PLACEHOLDER_FOR_PASSWORD,
    }

    const confirmPasswordTextObj = {
        title: "Confirm new password",
        placeholder: PLACEHOLDER_FOR_PASSWORD_CONFIRM,
    }

    const handleCurrentPassword = (value: string) => {
        setCurrentPW(value);
    }

    const handleNewPassword = (value: string) => {
        const result = PasswordValidationCheck(value);
        var msg = result? '' : PLACEHOLDER_FOR_PASSWORD;
        if(value.length === 0) msg = '';
        setNewPW(value);
        setNewPwValidation(result);
        setNewPwMessage(msg);
    }

    const handleConfirmPassword = (value: string) => {
        var result = value === newPW;
        var msg = result? '' : WARNING_PASSWORD_NOT_MATCH;
        if(value.length === 0){
            msg = '';
            result = false;
        }
        setConfirmPwValidation(result);
        setConfirmPwMessage(msg);
    }

    const changeNewPassword = async() => {
        const key:string = keyEncrypt(walletName, currentPW);
        await getChain(walletName).then(res => {
            if(res){
                let w = decrypt(res.password, key.toString());
                if(w.length > 0) {
                    setMnemonic(w);
                    setIsModalOpen(false);
                } else {
                    setIsModalOpen(true);
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const changePassword = async() => {
            if(mnemonic !== ''){
                await removeCurrentPassword();
                await createNewPassword();          
            }
        }
        changePassword();
    }, [mnemonic])

    const removeCurrentPassword = async() => {
        await removeChain(walletName)
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
        await setNewWallet(walletName, newPW, mnemonic)
            .then(res => {
                console.log(res);
                setStatus(1);
                setIsModalOpen(true);
            })
            .catch(error => console.log(error))
        
        setBioAuth(newPW);
    }

    const handleModalOpen = (open:boolean) => {
        setIsModalOpen(open);
        if(status === 1) handleGoBack();
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
                        <View style={styles.contents}>
                            {/* <Text style={styles.wallet}>{wallet}</Text> */}
                            <InputSetVertical
                                title={currentPasswordTextObj.title}
                                placeholder={currentPasswordTextObj.placeholder} 
                                validation={true}
                                secure={true}
                                onChangeEvent={handleCurrentPassword} />
                            <InputSetVertical
                                title={newPasswordTextObj.title}
                                placeholder={newPasswordTextObj.placeholder} 
                                message={newPwMessage}
                                validation={newPwValidation}
                                secure={true}
                                onChangeEvent={handleNewPassword} />
                            <InputSetVertical
                                title={confirmPasswordTextObj.title}
                                placeholder={confirmPasswordTextObj.placeholder} 
                                message={confirmPwMessage}
                                validation={confirmPwValidation}
                                secure={true}
                                onChangeEvent={handleConfirmPassword} />
                        </View>
                        <View style={styles.buttonBox}>
                            <Button title='Change' active={confirmPwValidation} onPressEvent={changeNewPassword} />
                        </View>
                        <AlertModal
                            visible={isModalOpen}
                            handleOpen={handleModalOpen}
                            isSingleButton={true}
                            title={status === 0?'Wrong password':'Change password'}
                            desc={status === 0?PASSWORD_CHANGE_FAIL:PASSWORD_CHANGE_SUCCESS}/>
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
    contents: {
        flex: 2,
        paddingVertical: 20,
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

export default ChangePasswordScreen;