import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { getWalletWithAutoLogin } from "@/util/wallet";
import SplashScreen from "react-native-splash-screen";
import Progress from "@/components/parts/progress";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

interface LoginCheckScreenProps {
    navigation: ScreenNavgationProps;
}

const LoginCheckScreen: React.FunctionComponent<LoginCheckScreenProps> = (props) => {
    const {navigation} = props;

    const [loading, setLoading] = useState(false);
    const [wallet, setWallet]:Array<any> = useState(null);

    useEffect(() => {
        const getWalletForAutoLogin = async() => {
            await getWalletWithAutoLogin()
            .then((res) => { 
                if(res !== ""){
                    const result = JSON.parse(res);
                    setWallet({
                        address: result.address,
                        walletName: result.walletName,
                    })
                }
                setLoading(true);
            })
            .catch(error => console.log(error))
        }
        getWalletForAutoLogin();
    }, []);

    useEffect(() => {
        if(loading){
            if(wallet){
                navigation.reset({routes: [{name: Screens.Home, params: {address: wallet.address, walletName: wallet.walletName}}]});
            } else {
                navigation.reset({routes: [{name: Screens.Welcome}]});
            }
            SplashScreen.hide();
        }
    }, [loading]);
    

    return (
        <ViewContainer bgColor={BgColor}>
            <View style={styles.container}>
                <Progress />
            </View>
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

export default LoginCheckScreen;