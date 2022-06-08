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
import { useNetInfo } from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";
import StackNavigator from "./stackNavigators";

const Router = () => {
    const {storage, common} = useAppSelector(state => state);

    const netInfo = useNetInfo();

    useEffect(() => {
        const connect = netInfo.isConnected === null? false:netInfo.isConnected;
        if(common.connect !== connect){
            if(connect === false){
                SplashScreen.hide();
            }
            CommonActions.handleIsConnection(connect);
            CommonActions.handleIsNetworkChange(false);
            CommonActions.handleLoadingProgress(!connect);
        }
    }, [netInfo])

    useEffect(() => {
        if(common.lockStation === false && (common.connect === false || common.isNetworkChanged)) {
            CommonActions.handleLoadingProgress(true);
        }
    }, [common.connect, common.isNetworkChanged, common.loading]);

    useEffect(() => {
        if(common.loggedIn){
            wait(3000).then(() => {
                CommonActions.handleIsNetworkChange(false);
                CommonActions.handleLoadingProgress(false);
            })
        }
    }, [storage.network]);

    useEffect(() => {
        CommonActions.handleLoggedIn(false);
        CommonActions.handleIsConnection(true);
        setClient(storage.network);
        setFirmaSDK(storage.network);
        setExplorerUrl(storage.network);
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