import React, { useEffect, useRef, useState } from "react";
import { Animated, BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions, WalletActions } from "@/redux/actions";
import { BgColor, Lato, TextCatTitleColor } from "@/constants/theme";
import { JAILBREAK_ALERT, LOGIN_DESCRIPTION, PLACEHOLDER_FOR_PASSWORD } from "@/constants/common";
import { getPasswordViaBioAuth, 
    getUseBioAuth, 
    getWalletList, 
    getWalletWithAutoLogin, 
    removeWalletWithAutoLogin, 
    setBioAuth, 
    setEncryptPassword, 
    setWalletList, 
    setWalletWithAutoLogin } from "@/util/wallet";
import { easeInAndOutAnim, fadeIn, LayoutAnim } from "@/util/animation";
import { PasswordCheck } from "@/util/validationCheck";
import { getAdrFromMnemonic } from "@/util/firma";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { Detect } from "@/util/detect";
import SplashScreen from "react-native-splash-screen";
import ViewContainer from "@/components/parts/containers/viewContainer";
import CustomModal from "@/components/modal/customModal";
import ModalWalletList from "@/components/modal/modalWalletList";
import InputSetVertical from "@/components/input/inputSetVertical";
import Button from "@/components/button/button";
import Description from "../welcome/description";
import WalletSelector from "../welcome/selectWallet/walletSelector";
import AlertModal from "@/components/modal/alertModal";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

const LoginCheck = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    const {wallet, common} = useAppSelector(state => state);

    const Title: string = 'LOGIN';
    const Desc: string = LOGIN_DESCRIPTION;
    const passwordText = {
        title : 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD,
    }

    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [items, setItems]:Array<any> = useState([]);

    const [dimActive, setDimActive] = useState(true);
    const [useBio, setUseBio] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [resetValues, setResetValues] = useState(false);
    const [openSelectModal, setOpenSelectModal] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false);

    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');

    const [loading, setLoading] = useState(true);

    const WalletList = async() => {
        await getWalletList().then(res => {            
            setItems(res);
        }).catch(error => {
            console.log('error : ' + error);
        })
    }

    const handleOpenSelectModal = (open:boolean) => {
        setOpenSelectModal(open);
    }

    const handleAlertModalOpen = (open:boolean) => {
        if(Platform.OS === "ios") return;
        setOpenAlertModal(open);
        BackHandler.exitApp();
    }

    const handleSelectWallet = (index:number) => {
        if(index === selected) {return handleOpenSelectModal(false);}
        setSelected(index);
        setResetValues(true);
        handleOpenSelectModal(false);
    }

    const handleEditWalletList = async(list:string, newIndex: number) => {
        setWalletList(list);
        await WalletList();
        setSelected(newIndex);
    }

    const onChangePassword = async(value: string) => {
        setPassword(value);

        let result = await PasswordCheck(selectedWallet, value);
        if(result){
            setPwValidation(true);
            setMnemonic(result);
        } else {
            setPwValidation(false);
        }
    }

    const onSelectWalletAndMoveToHome = async() => {
        let adr = '';
        await getAdrFromMnemonic(mnemonic).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

        await setWalletWithAutoLogin(JSON.stringify({
            name: selectedWallet,
            address: adr,
        }));
        
        await setEncryptPassword(password);

        WalletActions.handleWalletName(selectedWallet);
        WalletActions.handleWalletAddress(adr);

        setBioAuth(selectedWallet, password);
        navigation.reset({routes: [{name: Screens.Home}]});
    }

    let isProcessing = false;
    const handleValidation = async() => {
        if(isProcessing === true) return;
        isProcessing = true;

        let passwordFromBio = '';
        const auth = await confirmViaBioAuth();
        if(auth){
            await getPasswordViaBioAuth().then(res => {
                passwordFromBio = res;
            }).catch(error => console.log(error));
        } else {
            LayoutAnim();
            easeInAndOutAnim();
            isProcessing = false;
            setDimActive(false);
            fadeIn(Animated, fadeAnim, 950);
            return;
        }

        const result = passwordFromBio;
        if(common.appState === "active" && result !== ""){
            isProcessing = false;
            navigation.reset({routes: [{name: Screens.Home}]});
        }
    }

    const getUseBioAuthState = async() => {
        const useBio = await getUseBioAuth(wallet.name);
        return useBio;
    }

    const handleDisconnect = () => {
        removeWalletWithAutoLogin();
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime("");
        navigation.reset({routes: [{name: Screens.Welcome}]});
    }

    const onKeyboardDidShow = () => {
        setIsKeyboardShown(true);
    }

    const onKeyboardDidHide = () => {
        setIsKeyboardShown(false);
    }

    useEffect(() => {
        if(common.connect){
            if(!loading){
                if(Detect() === false){
                    if(wallet.name !== ""){
                        SplashScreen.hide();
                        setSelectedWallet(items[items.indexOf(wallet.name)]);
                        setSelected(items.indexOf(wallet.name));
                        getUseBioAuthState().then(res => {
                            setDimActive(res);
                            setUseBio(res);
                            if(res){
                                handleValidation();
                            }
                        })
                    }
                } else {
                    return setOpenAlertModal(true);
                }
            }
        }
    }, [loading, common.connect]);

    useEffect(() => {
        if(selected >= 0 && selectedWallet !== items[selected]){
            setSelectedWallet(items[selected]);
            setMnemonic('');
            setResetValues(false);
        }
    }, [selected])

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);
        WalletList();
        setPwValidation(false);
        
        const getWalletForAutoLogin = async() => {
            await getWalletWithAutoLogin()
            .then((res) => { 
                if(res !== ""){
                    const result = JSON.parse(res);
                    WalletActions.handleWalletName(result.name);
                    WalletActions.handleWalletAddress(result.address);
                } else {
                    handleDisconnect();
                }
                setLoading(false);
            })
            .catch(error => {
                console.log(error)
                setLoading(false);
            })
        }
        getWalletForAutoLogin();
        
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
            setItems([]);
        }
    }, []);

    return (
        <ViewContainer bgColor={BgColor}>
            <KeyboardAvoidingView
                enabled={true}
                behavior={Platform.select({android: undefined, ios: 'padding'})} 
                style={{height: "100%"}}>
                {wallet.name !== "" &&
                <Pressable onPress={() => Keyboard.dismiss()}>
                    <Animated.View style={[styles.viewContainer, {justifyContent:dimActive?"center":"space-between", paddingBottom: isKeyboardShown? 20:0}]}>
                        {dimActive === false && 
                        <TouchableOpacity style={[styles.disconnect]} onPress={() => handleDisconnect()}>
                            <Text style={styles.disconnectText}>Disconnect</Text>
                        </TouchableOpacity>}
                        <Description title={Title} desc={Desc}/>
                        {dimActive === false && 
                        <Animated.View 
                            style={[styles.buttonBox, {opacity: useBio?fadeAnim:1}]}>
                            <View style={{paddingBottom: 20}}>
                                <WalletSelector selectedWallet={selectedWallet} handleOpenModal={handleOpenSelectModal} />
                                <InputSetVertical
                                    title={passwordText.title}
                                    message={''}
                                    validation={true}
                                    placeholder={passwordText.placeholder} 
                                    secure={true}
                                    resetValues={resetValues}
                                    onChangeEvent={onChangePassword} />
                            </View>
                            {openSelectModal && 
                            <CustomModal visible={openSelectModal} handleOpen={handleOpenSelectModal}>
                                <ModalWalletList initVal={selected} data={items} handleEditWalletList={handleEditWalletList} onPressEvent={handleSelectWallet}/>
                            </CustomModal>
                            }
                            <Button title='Connect' active={pwValidation} onPressEvent={onSelectWalletAndMoveToHome} />
                        </Animated.View>}
                    </Animated.View>

                    <AlertModal
                        visible={openAlertModal}
                        handleOpen={handleAlertModalOpen}
                        title={"Jailbroken detected"}
                        desc={JAILBREAK_ALERT}
                        confirmTitle={"OK"}
                        type={"ERROR"}/>
                </Pressable>
                }
            </KeyboardAvoidingView>
        </ViewContainer>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingTop: Platform.select({android: 0, ios: getStatusBarHeight()}),
    },
    buttonBox: {
        width: "100%", 
        paddingHorizontal: 20, 
        justifyContent: "flex-end",
        backgroundColor: BgColor,
    },
    disconnect: {
        height: 25,
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 20,
    },
    disconnectText: {
        fontFamily: Lato,
        fontSize: 14,
        color: TextCatTitleColor,
    }
});


export default LoginCheck;