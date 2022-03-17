import React, { useEffect } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { setFirmaSDK } from "@/util/firma";
import { setExplorerUrl } from "@/constants/common";
import Progress from "@/components/parts/progress";
import CustomToast from "@/components/toast/customToast";
import { ApolloProvider, getClient, setClient } from "../apollo";
import StackNavigator from "./stackNavigators";
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";

const Router = () => {
    const {common} = useAppSelector(state => state);

    const unsubscribe = NetInfo.addEventListener(state => {
        if(state.isConnected !== null && common.connect !== state.isConnected){
            SplashScreen.hide();
            CommonActions.handleIsConnection(state.isConnected);
            CommonActions.handleLoadingProgress(!state.isConnected);
        }
    });

    useEffect(() => {
        setClient(common.network);
        setFirmaSDK(common.network);
        setExplorerUrl(common.network);
        if(common.connect){
            setTimeout(() => {
                CommonActions.handleLoadingProgress(false);
                CommonActions.handleIsNetworkChange(false);
            }, 5000);
        }
    }, [common.network]);

    useEffect(() => {
        CommonActions.handleIsConnection(true);
        unsubscribe();
    }, [])

    return (
        <ApolloProvider client={getClient()}>
        <NavigationContainer theme={DarkTheme}>
            <StackNavigator/>
            {common.loading && <Progress />}
            <CustomToast />
        </NavigationContainer>
        </ApolloProvider>
    )
}

export default Router;