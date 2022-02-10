import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { getWalletWithAutoLogin } from "@/util/wallet";
import { AppContext } from "@/util/context";
import { CONTEXT_ACTIONS_TYPE } from "@/constants/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

interface LoginCheckScreenProps {
    navigation: ScreenNavgationProps;
}

const LoginCheckScreen: React.FunctionComponent<LoginCheckScreenProps> = (props) => {
    const { dispatchEvent, wallet } = useContext(AppContext);
    const {navigation} = props;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getWalletForAutoLogin = async() => {
            await getWalletWithAutoLogin()
            .then((res) => { 
                if(res !== ""){
                    const result = JSON.parse(res);
                    dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["WALLET"], {
                        address: result.address,
                        name: result.name,
                    })
                }
                setLoading(false);
            })
            .catch(error => console.log(error))
        }
        getWalletForAutoLogin();
    }, []);

    useEffect(() => {
        if(!loading){
            if(wallet){
                navigation.reset({routes: [{name: Screens.Home}]});
            } else {
                navigation.reset({routes: [{name: Screens.Welcome}]});
                dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], loading);
            }
        } else {
            dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], loading);
        }
    }, [loading]);
    
    return (
        <ViewContainer bgColor={BgColor}>
            <View style={styles.container}>
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