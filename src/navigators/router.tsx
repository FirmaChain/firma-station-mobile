import React, { useEffect } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { setFirmaSDK } from "@/util/firma";
import { wait } from "@/util/common";
import { setExplorerUrl } from "@/constants/common";
import { ApolloProvider, getClient, setClient } from "@/apollo";
import Progress from "@/components/parts/progress";
import CustomToast from "@/components/toast/customToast";
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";
import StackNavigator from "./stackNavigators";

const Router = () => {
    const {common} = useAppSelector(state => state);

    const unsubscribe = NetInfo.addEventListener(state => {
        if(state.isConnected !== null){
            if(common.connect !== state.isConnected){
                if(state.isConnected === false){
                    SplashScreen.hide();
                }
                CommonActions.handleIsConnection(state.isConnected);
                CommonActions.handleIsNetworkChange(false);
                CommonActions.handleLoadingProgress(!state.isConnected);
            }
        }
    });

    useEffect(() => {
        if(common.connect === false) {
            CommonActions.handleLoadingProgress(true);
        }
    }, [common.connect, common.loading]);

    useEffect(() => {
        wait(3000).then(() => {
            CommonActions.handleLoadingProgress(false);
            CommonActions.handleIsNetworkChange(false);
        })
    }, [common.network]);

    useEffect(() => {
        setClient(common.network);
        setFirmaSDK(common.network);
        setExplorerUrl(common.network);
        CommonActions.handleIsConnection(true);
        unsubscribe();
    }, []);

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