import React, { useContext, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { getUniqueId } from "react-native-device-info";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import Button from "@/components/button/button";
import InputSetVertical from "@/components/input/inputSetVertical";
import AlertModal from "@/components/modal/alertModal";
import { getChain, removeChain, setChain } from "@/util/secureKeyChain";
import { AppContext } from "@/util/context";
import { decrypt, keyEncrypt } from "@/util/keystore";
import { PasswordValidationCheck } from "@/util/validationCheck";
import { getWalletList, getWalletWithAutoLogin, setBioAuth, setNewWallet } from "@/util/wallet";
import { BgColor } from "@/constants/theme";
import { CONTEXT_ACTIONS_TYPE, 
    PASSWORD_CHANGE_FAIL, 
    PASSWORD_CHANGE_SUCCESS, 
    PLACEHOLDER_FOR_PASSWORD, 
    PLACEHOLDER_FOR_PASSWORD_CONFIRM, 
    WALLET_LIST, 
    WARNING_PASSWORD_NOT_MATCH } from "@/constants/common";

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

    const {dispatchEvent} = useContext(AppContext);

    // 0: need to password confirm
    // 1: changed password
    const [status, setStatus] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [pwValidation, setPwValidation] = useState(false);
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

    const handleCurrentPassword = async(value: string) => {
        if(value.length >= 10){
            const key:string = keyEncrypt(walletName, value);
            await getChain(walletName).then(res => {
                if(res){
                    let w = decrypt(res.password, key.toString());
                    if(w !== null) {
                        setMnemonic(w);
                        setPwValidation(true);
                    } else {
                        setPwValidation(false);
                    }
                }
            }).catch(error => {
                console.log(error);
                setPwValidation(false);
            });
        } else {
            setPwValidation(false);
        }
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
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
        await removeCurrentPassword();
        await createNewPassword();
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);          
    }

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
        let newList:string = '';
        await getWalletList().then(res => {
            let arr = res !== undefined? res : [];
            
            if(arr.length > 1){
                arr.filter(item => item !== walletName).map((item) => {
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

        await setNewWallet(walletName, newPW, mnemonic)
            .then(() => {
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
                        <Pressable style={styles.contents} onPress={() => Keyboard.dismiss()}>
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
                        </Pressable>
                        <View style={styles.buttonBox}>
                            <Button title='Change' active={pwValidation && confirmPwValidation} onPressEvent={changeNewPassword} />
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