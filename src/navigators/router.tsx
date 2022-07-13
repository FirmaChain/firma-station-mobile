import React, { useEffect, useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { setFirmaSDK } from "@/util/firma";
import { wait } from "@/util/common";
import { DATA_LOAD_DELAYED_NOTICE, setExplorerUrl } from "@/constants/common";
import { ApolloProvider, getClient, setClient } from "@/apollo";
import { useNetInfo } from "@react-native-community/netinfo";
import Progress from "@/components/parts/progress";
import CustomToast from "@/components/toast/customToast";
import SplashScreen from "react-native-splash-screen";
import StackNavigator from "./stackNavigators";
import AlertModal from "@/components/modal/alertModal";
import HomeQrScanner from "@/components/modal/qrcode/homeQrScanner";
import WalletConnectModal from "@/components/modal/walletConnectModal";
import WalletResultModal from "@/components/modal/walletResultModal";

const Router = () => {
    const {storage, common, modal} = useAppSelector(state => state);
    const netInfo = useNetInfo();

    const [openAlertModal, setOpenAlertModal] = useState(false);
    const handleAlertModalOpen = (open:boolean) => {
        CommonActions.handleLoadingProgress(false);
        setOpenAlertModal(open);
        if(open === false){
            CommonActions.handleLoadingProgress(true);
            CommonActions.handleDataLoadStatus(1);
        }
    }

    useEffect(() => {
        if(common.dataLoadStatus >= 2){
            setOpenAlertModal(true);
        }
        if(common.dataLoadStatus === 0){
            setOpenAlertModal(false);
        }
    }, [common.dataLoadStatus, common.lockStation])

    useEffect(() => {
        const connect = netInfo.isConnected === null? false:netInfo.isConnected;
        if(connect === false){
            SplashScreen.hide();
        }
        CommonActions.handleIsNetworkChange(false);
        CommonActions.handleLoadingProgress(!connect);
        CommonActions.handleIsConnection(connect);
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
                <HomeQrScanner />
                <WalletConnectModal />
                <WalletResultModal />
                <AlertModal
                    visible={openAlertModal}
                    handleOpen={handleAlertModalOpen}
                    title={"Data load delayed"}
                    desc={DATA_LOAD_DELAYED_NOTICE}
                    confirmTitle={"Reload"}
                    forcedActive={true}
                    type={"CONFIRM"}/>
                <CustomToast />
            </NavigationContainer>
        </ApolloProvider>
    )
}

export default Router;