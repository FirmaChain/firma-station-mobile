import React, { useEffect, useState } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { DATA_LOAD_DELAYED_NOTICE } from "@/constants/common";
import { ApolloProvider, getClient } from "@/apollo";
import CustomToast from "@/components/toast/customToast";
import StackNavigator from "./stackNavigators";
import AlertModal from "@/components/modal/alertModal";
import AppStateManager from "./appStateManager";

const Router = () => {
    const {common} = useAppSelector(state => state);

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

    return (
        <ApolloProvider client={getClient()}>
            <NavigationContainer theme={DarkTheme}>
                <StackNavigator/>
                <AppStateManager />
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