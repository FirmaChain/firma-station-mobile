import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useAppSelector } from "@/redux/hooks";
import { getChain } from "@/util/secureKeyChain";
import { BgColor, DisableColor, FailedColor, Lato, TextGrayColor } from "@/constants/theme";
import { WELCOME_DESCRIPTION } from "@/constants/common";
import { WALLET_LIST } from "@/../config";
import Button from "@/components/button/button";
import ViewContainer from "@/components/parts/containers/viewContainer";
import SplashScreen from "react-native-splash-screen";
import Description from "./description";
import { WalletActions } from "@/redux/actions";
import NetworkBadge from "@/components/parts/networkBadge";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

const Welcome = () => {
    const navigation: ScreenNavgationProps = useNavigation();
    
    const {storage: common} = useAppSelector(state => state);

    const [walletExist, setWalletExist] = useState(false);

    const Title: string = 'CONNECT';
    const Desc: string = WELCOME_DESCRIPTION;

    function handleCreateStepOne(){
        navigation.navigate(Screens.CreateStepOne, {});
    }

    function handleSelectWallet(){
        navigation.navigate(Screens.SelectWallet);
    }

    function handleRecoverWallet(){
        navigation.navigate(Screens.RecoverWallet);
    }

    
    const isWalletExist = async() => {
        try {
            const result = await getChain(WALLET_LIST);
            return setWalletExist(Boolean(result));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        WalletActions.handleWalletName("");
        WalletActions.handleWalletAddress("");
        SplashScreen.hide();
        isWalletExist();
        return () => {
            setWalletExist(false);
        }
    }, [])

    return (
        <ViewContainer bgColor={BgColor}>
            <View style={styles.viewContainer}>
                <View style={styles.network}>
                    {common.network !== "MainNet" &&
                    <NetworkBadge top={-5} title={common.network} />
                    }
                </View>
                <Description title={Title} desc={Desc} />
                <View style={styles.buttonBox}>
                    {walletExist && 
                    <View style={{paddingBottom: 10}}>
                        <Button title={'Select Wallet'} active={true} onPressEvent={handleSelectWallet}/>
                    </View>}
                    <Button title={'New Wallet'} active={true} border={walletExist?true:false} onPressEvent={handleCreateStepOne} />
                    <View style={styles.dividerWrapper}>
                        <View style={styles.divider}/>
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider}/>
                    </View>
                    <Button title={'Recover Wallet'} active={true} border={true} onPressEvent={handleRecoverWallet} />
                </View>
            </View>
        </ViewContainer>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: Platform.select({android: 0, ios: getStatusBarHeight()}),
    },
    network: {
        width: "100%",
        height: 25,
        fontFamily: Lato, 
        fontSize: 14,
        textAlign: "right", 
        color: FailedColor,
    },
    buttonBox: {
        width: "100%", 
        paddingHorizontal: 20, 
        justifyContent: "flex-end"
    },
    dividerWrapper: {
        height: 17,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 14,
    },
    divider: {
        flex:1,
        height: 1,
        backgroundColor: DisableColor,
    },
    dividerText: {
        fontFamily: Lato,
        fontSize: 14,
        fontWeight: "normal",
        color: TextGrayColor,
        paddingHorizontal: 18,
    }
})

export default Welcome;