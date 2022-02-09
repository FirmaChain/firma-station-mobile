import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { BgColor } from "@/constants/theme";
import { getWalletWithAutoLogin } from "@/util/wallet";
import Progress from "@/components/parts/progress";
import { AppContext } from "@/util/context";
import { CONTEXT_ACTIONS_TYPE } from "@/constants/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Welcome>;

interface LoginCheckScreenProps {
    navigation: ScreenNavgationProps;
}

const LoginCheckScreen: React.FunctionComponent<LoginCheckScreenProps> = (props) => {
    const { dispatchEvent, wallet } = useContext(AppContext);
    const {navigation} = props;

    const [loading, setLoading] = useState(false);

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
                setLoading(true);
            })
            .catch(error => console.log(error))
        }
        getWalletForAutoLogin();
    }, []);

    useEffect(() => {
        if(loading){
            if(wallet){
                navigation.reset({routes: [{name: Screens.Home}]});
            } else {
                navigation.reset({routes: [{name: Screens.Welcome}]});
            }
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