import React, { useEffect } from "react";
import Progress from "@/components/parts/progress";
import CustomToast from "@/components/toast/customToast";
import { ApolloProvider, getClient, setClient } from "../apollo";
import { useAppSelector } from "@/redux/hooks";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import StackNavigator from "./stackNavigators";
import { setFirmaSDK } from "@/util/firma";
import { setExplorerUrl } from "@/constants/common";
import { CommonActions } from "@/redux/actions";
import { Platform, StyleSheet, Text } from "react-native";
import { BgColor, Lato, TextWarnColor } from "@/constants/theme";
import { getStatusBarHeight } from "react-native-status-bar-height";

const Router = () => {
    const {common} = useAppSelector(state => state);

    useEffect(() => {
        CommonActions.handleLoadingProgress(true);
        setClient(common.network);
        setFirmaSDK(common.network);
        setExplorerUrl(common.network);
        setTimeout(() => {
            CommonActions.handleLoadingProgress(false);
        }, 5000);
    }, [common.network])

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