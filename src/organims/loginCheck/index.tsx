import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { BgColor } from "@/constants/theme";
import { getWalletWithAutoLogin } from "@/util/wallet";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions, WalletActions } from "@/redux/actions";
import { useNavigation } from "@react-navigation/native";
import ViewContainer from "@/components/parts/containers/viewContainer";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

const LoginCheck = () => {
    const navigation:ScreenNavgationProps = useNavigation();

    const [loading, setLoading] = useState(true);
    const {wallet, common} = useAppSelector(state => state);

    useEffect(() => {
        const getWalletForAutoLogin = async() => {
            await getWalletWithAutoLogin()
            .then((res) => { 
                if(res !== ""){
                    const result = JSON.parse(res);
                    WalletActions.handleWalletName(result.name);
                    WalletActions.handleWalletAddress(result.address);
                }
                setLoading(false);
            })
            .catch(error => console.log(error))
        }
        getWalletForAutoLogin();
    }, []);

    useEffect(() => {
        if(common.connect){
            if(!loading){
                if(wallet.name !== ""){
                    navigation.reset({routes: [{name: Screens.Home}]});
                } else {
                    navigation.reset({routes: [{name: Screens.Welcome}]});
                    CommonActions.handleLoadingProgress(loading);
                }
            } else {
                CommonActions.handleLoadingProgress(loading);
            }
        }
    }, [loading, common.connect]);

    return (
        <ViewContainer bgColor={BgColor}>
            <View style={styles.container}/>
        </ViewContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})

export default LoginCheck;