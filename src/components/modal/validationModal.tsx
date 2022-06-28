import React, { useEffect, useMemo, useState } from "react";
import { Animated, Keyboard, KeyboardEvent, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useAppSelector } from "@/redux/hooks";
import { BgColor, DisableColor, Lato, PointColor, TextCatTitleColor, WhiteColor } from "@/constants/theme";
import { PLACEHOLDER_FOR_PASSWORD, TRANSACTION_AUTH_TEXT, UNLOCK_AUTH_TEXT } from "@/constants/common";
import { getPasswordViaBioAuth, getUseBioAuth } from "@/util/wallet";
import { WalletNameValidationCheck } from "@/util/validationCheck";
import { getChain } from "@/util/secureKeyChain";
import { decrypt, keyEncrypt } from "@/util/keystore";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { LayoutAnim, easeInAndOutAnim } from "@/util/animation";
import { ScreenHeight } from "@/util/getScreenSize";
import { wait } from "@/util/common";
import { ForwardArrow, LockIcon, SendIcon, SquareIcon } from "../icon/icon";
import Toast from "react-native-toast-message";
import InputSetVertical from "../input/inputSetVertical";
import ArrowButton from "../button/arrowButton";
import CustomModal from "./customModal";

interface Props {
    type: string;
    open: boolean;
    setOpenModal: Function;
    validationHandler: (password:string) => void; 
}

const ValidationModal = ({type, open, setOpenModal, validationHandler}:Props) => {
    const {wallet, common} = useAppSelector(state => state);

    const screenHeight = ScreenHeight();
    const [contentPosition, setContentPosition] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(false);
    const [dimActive, setDimActive] = useState(true);
    const [useBio, setUseBio] = useState(false);

    const [backbuttonLock, setBackbuttonLock] = useState(true);

    const contentPaddingBottom  = useMemo(() => {
        if(contentPosition !== 0 && keyboardHeight !== 0){
            if(screenHeight - (contentPosition + keyboardHeight) < 0){
                return Math.abs(screenHeight - (contentPosition + keyboardHeight));
            };
        }

        return 0;
    }, [contentPosition, keyboardHeight, screenHeight])


    const titleText = useMemo(() => {
        if(type === "transaction") return TRANSACTION_AUTH_TEXT;
        return UNLOCK_AUTH_TEXT;
    }, [type]);

    const renderIcon = () => {
        switch (type) {
            case "transaction":
                return <SendIcon size={80} color={WhiteColor} />
            case "lock":
                return <LockIcon size={80} color={WhiteColor} />
        }
    }

    const getUseBioAuthState = async() => {
        const result = await getUseBioAuth(wallet.name);
        setDimActive(result);
        setUseBio(result);
    }

    const handleModal = (open:boolean) => {
        setOpenModal(open);
    }

    const handleInputChange = async(val:string) => {
        setPassword(val);

        if(val.length >= 10){
            try {
                let nameCheck = await WalletNameValidationCheck(wallet.name);
                if(nameCheck){
                    const key:string = keyEncrypt(wallet.name, val);
                    try {
                        const result = await getChain(wallet.name);
                        if(result){
                            let w = decrypt(result.password, key);
                            if(w.split(" ").length === 24) {
                                setActive(true);
                            } else {
                                setActive(false);
                            }
                        }
                    } catch (error) {
                        console.log(error);
                        setActive(false);
                    }
                }
            } catch (error) {
                console.log(error);
                setActive(false);
            }
        } else {
            setActive(false);
        }
    }

    let isProcessing = false;
    const handleValidation = async(viaBioAuth:boolean) => {
        try {
            if(isProcessing === true) return;
            isProcessing = true;
    
            let passwordFromBio = '';
            if(viaBioAuth){
                const auth = await confirmViaBioAuth();
                if(auth){
                    passwordFromBio = await getPasswordViaBioAuth();
                } else {
                    LayoutAnim();
                    easeInAndOutAnim();
                    isProcessing = false;
                    setDimActive(false);
                    return;
                }
            }
            const result = viaBioAuth? passwordFromBio : password;
            isProcessing = false;
            validationHandler(result);
            handleModal(false);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: String(error),
            });
            handleModal(false);
        }
    }

    const onKeyboardDidShow = (event:KeyboardEvent) => {
        setKeyboardHeight(event.endCoordinates.height);
    }

    const onKeyboardDidHide = () => {
        setKeyboardHeight(0);
    }

    const initValues = () => {
        setPassword('');
        setDimActive(true);
        setActive(false);
        setUseBio(false);
        setBackbuttonLock(true);
    }

    useEffect(() => {
        if(open){
            getUseBioAuthState();
        } else {
            initValues();
        }
    }, [open])

    useEffect(() => {
        if(useBio){
            wait(600).then(()=>{
                handleValidation(useBio);
                wait(100).then(()=>{
                    if(type === "transaction"){
                        setBackbuttonLock(false);
                    }
                })
            })
        } else {
            if(type === "transaction"){
                setBackbuttonLock(false);
            }
        }
    }, [useBio])

    useEffect(() => {
        if(common.appState === "background") {
            if(type === "transaction"){
                handleModal(false);
            }
        }
        
        if(common.appState === "active" && common.isBioAuthInProgress === false){
            if(type === "lock"){
                handleValidation(useBio);
            }
        }
    }, [common.appState])

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
        const hideSubscription = Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <CustomModal
            visible={open}
            fade={true}
            bgColor={BgColor}
            lockBackButton={backbuttonLock}
            keyboardAvoiing={false}
            handleOpen={handleModal}>
            <Pressable style={styles.container} onPress={()=>{Keyboard.dismiss()}}>
                <View style={[styles.backArrowButton, {display: type === "transaction"?backbuttonLock?"none":"flex":"none"}]}>
                    <ArrowButton onPressEvent={()=>handleModal(false)}/>
                </View>
                <Animated.View 
                    style={[styles.textBox, {paddingBottom: contentPaddingBottom}]}
                    onLayout={(event) => {
                        const {y, height} = event.nativeEvent.layout;
                        if(dimActive === false){
                            setContentPosition(y + height);
                        } else {
                            setContentPosition(0);
                        }
                    }}>
                    <View style={{alignItems: "center"}}>
                        {renderIcon()}
                        <Text style={[styles.title, {fontWeight: "bold"}]}>{titleText}</Text>
                        <View style={[styles.passwordBox, {height: dimActive?0:"auto"}]}>
                            {dimActive === false && 
                            <View style={{flex: 1}}>
                                <InputSetVertical
                                    title="Password"
                                    validation={true}
                                    secure={true}
                                    placeholder={PLACEHOLDER_FOR_PASSWORD}
                                    onChangeEvent={handleInputChange}/>
                            </View>
                            }
                            <TouchableOpacity style={styles.confirmButton} disabled={active === false} onPress={()=>handleValidation(false)}>
                                <SquareIcon size={55} color={active? PointColor:DisableColor}/>
                                <View style={[styles.buttonArrow]}>
                                    <ForwardArrow size={25} color={active? WhiteColor:BgColor}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        </CustomModal>
    )
}


const styles = StyleSheet.create({
    container : {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BgColor,
    },
    dim: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "#000000",
        opacity: Platform.select({android: 0, ios: .5}),
        top: 0,
        left: 0,
        bottom: 0,
    },
    textBox: {
        justifyContent:"center",
        alignItems: "center",
    },
    title: {
        fontFamily: Lato,
        fontSize: 18,
        textAlign: "center",
        color: TextCatTitleColor,
        marginTop: 35,
        marginBottom: 20,
    },
    passwordBox: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    backArrowButton: {
        position: "absolute",
        top: Platform.select({android: 0, ios: getStatusBarHeight()}),
        left: 0,
    },
    confirmButton: {
        marginLeft: 2,
        marginBottom: 6,
    },
    buttonArrow: {
        position: "absolute",
        width: 25,
        height: 25,
        top: 17.5,
        left: 14,
    }
});

export default ValidationModal;