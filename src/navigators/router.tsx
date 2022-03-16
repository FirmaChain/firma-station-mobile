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

const Router = () => {
    const {common} = useAppSelector(state => state);

    useEffect(() => {
        setClient(common.network);
        setFirmaSDK(common.network);
        setExplorerUrl(common.network);
        setTimeout(() => {
            CommonActions.handleLoadingProgress(false);
            CommonActions.handleIsNetworkChange(false);
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