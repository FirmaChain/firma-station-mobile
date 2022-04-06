import React, { useEffect, useRef, useState } from "react";
import { Animated, BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions, WalletActions } from "@/redux/actions";
import { BgColor, Lato, TextCatTitleColor } from "@/constants/theme";
import { JAILBREAK_ALERT, LOGIN_DESCRIPTION } from "@/constants/common";
import { getPasswordViaBioAuth, 
    getUseBioAuth, 
    getWalletWithAutoLogin, 
    removeWalletWithAutoLogin, 
    setBioAuth, 
    setEncryptPassword, 
    setWalletWithAutoLogin } from "@/util/wallet";
import { easeInAndOutAnim, fadeIn, LayoutAnim } from "@/util/animation";
import { getAdrFromMnemonic } from "@/util/firma";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { Detect, removeAllData } from "@/util/detect";
import SplashScreen from "react-native-splash-screen";
import ViewContainer from "@/components/parts/containers/viewContainer";
import Description from "../welcome/description";
import AlertModal from "@/components/modal/alertModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputBox from "./inputBox";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

const LoginCheck = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    
    const {wallet, common} = useAppSelector(state => state);

    const Title: string = 'LOGIN';
    const Desc: string = LOGIN_DESCRIPTION;

    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [dimActive, setDimActive] = useState(true);
    const [useBio, setUseBio] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openAlertModal, setOpenAlertModal] = useState(false);

    const handleAlertModalOpen = (open:boolean) => {
        if(Platform.OS === "ios") return;
        setOpenAlertModal(open);
        BackHandler.exitApp();
    }

    const handleLogin = async(mnemonic:string, name:string, password:string) => {
        let adr = '';
        await getAdrFromMnemonic(mnemonic).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

        await setWalletWithAutoLogin(JSON.stringify({
            name: name,
            address: adr,
        }));
        
        await setEncryptPassword(password);

        WalletActions.handleWalletName(name);
        WalletActions.handleWalletAddress(adr);

        setBioAuth(name, password);
        navigation.reset({routes: [{name: Screens.Home}]});
    }

    let isProcessing = false;
    const handleLoginViaBioAuth = async() => {
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
        if(common.connect && loading === false){
            if(Detect() === false){
                if(wallet.name !== ""){
                    SplashScreen.hide();
                    getUseBioAuthState()
                    .then(res => {
                        setDimActive(res);
                        setUseBio(res);
                        if(res){
                            handleLoginViaBioAuth();
                        }
                    })
                }
            } else {
                return setOpenAlertModal(true);
            }
        }
    }, [loading, common.connect]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);
        
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

        AsyncStorage.getItem("alreadyLaunched").then(value => {
            if(value == null){
                removeAllData().then(()=>getWalletForAutoLogin());
                AsyncStorage.setItem('alreadyLaunched', "Launched");
            } else {
                getWalletForAutoLogin();
            }
        })
        
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
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
                        {dimActive === false && <InputBox walletName={wallet.name} useBio={useBio} fadeIn={fadeAnim} loginHandler={handleLogin}/>}
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