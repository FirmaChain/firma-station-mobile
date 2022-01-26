import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { FIRMA_SPLASH } from "@/constants/images";
import { BgColor } from "@/constants/theme";
import { getWalletViaAutoLogin } from "@/util/wallet";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

interface SplashScreenProps {
    navigation: ScreenNavgationProps;
}

const SplashScreen: React.FunctionComponent<SplashScreenProps> = (props) => {
    const {navigation} = props;

    const [loading, setLoading] = useState(false);
    const [wallet, setWallet]:Array<any> = useState(null);

    useEffect(() => {
        const getWalletForAutoLogin = async() => {
            await getWalletViaAutoLogin()
            .then(res => { 
                if(res !== ""){
                    const result = res.split("|");
                    setWallet({
                        address: result[0],
                        walletName: result[1],
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
        }
    }, [loading]);
    

    return (
        <ViewContainer bgColor={BgColor}>
            <View style={styles.container}>
                <Image style={styles.splash}   source={FIRMA_SPLASH} />
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
    splash: {
        maxWidth: 272,
        resizeMode: "contain",
    }
})

export default SplashScreen;