import React, { useEffect, useState } from "react";
import { AppState, Platform, StyleSheet, View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions, StorageActions } from "@/redux/actions";
import { convertNumber, getTimeStamp } from "@/util/common";
import { Detect } from "@/util/detect";
import { BgColor } from "@/constants/theme";
import { JAILBREAK_ALERT } from "@/constants/common";
import ValidationModal from "@/components/modal/validationModal";
import AlertModal from "@/components/modal/alertModal";

const AppStateManager = () => {
    const {wallet, storage, common} = useAppSelector(state => state);

    const [openAlertModal, setOpenAlertModal] = useState(false);

    const handleAlertModalOpen = (open:boolean) => {
        if(open){
            setOpenAlertModal(open);
        } else {
            return;
        }
    }

    const handleUnlock = (result: string) => {
        CommonActions.handleLoggedIn(true);
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime("");
    }

    useEffect(() => {
        const appStateListener = AppState.addEventListener(
            'change',
            nextAppState => {
                CommonActions.handleAppState(nextAppState);
                
                const key = (Platform.OS === "ios"? "inactive":"background");
                if(nextAppState === key){
                    CommonActions.handleAppPausedTime(getTimeStamp());
                }
            },
        );
        return () => {
            appStateListener?.remove();
        };
    }, [wallet.name]);

    useEffect(() => {
        if(Detect() === false){
            setOpenAlertModal(false);
            if(wallet.name === ""){
                CommonActions.handleAppPausedTime("");
            }
            if(common.appPausedTime !== "" && common.appState === "active"){
                if(convertNumber(getTimeStamp()) - convertNumber(common.appPausedTime) >= 60){
                    CommonActions.handleDataLoadStatus(0);
                    CommonActions.handleLockStation(true);
                } else {
                    CommonActions.handleAppPausedTime("");
                }
            }
        } else {
            return setOpenAlertModal(true);
        }
    }, [common.appState, common.appPausedTime]);

    useEffect(() => {
        CommonActions.handleAppPausedTime("");
        CommonActions.handleAppState("active");
        CommonActions.handleLockStation(false);
        if(storage.currency === undefined){
            StorageActions.handleCurrency("USD");
        }
    }, [])

    return (
        <>
        {(wallet.name !== "" && common.loggedIn) &&<>
        {(common.isBioAuthInProgress === false && common.appState !== "active") && <View style={styles.dim}/>}
        {(common.isBioAuthInProgress === false && common.appPausedTime !== "")&& <View style={styles.dim}/>}
        <ValidationModal 
            type={"lock"} 
            open={common.lockStation}
            setOpenModal={handleUnlock} 
            validationHandler={handleUnlock}/>
        </>}
        {openAlertModal && <>
        <View style={styles.dim}/>
        <AlertModal
            visible={openAlertModal}
            handleOpen={handleAlertModalOpen}
            title={"Jailbroken detected"}
            desc={JAILBREAK_ALERT}
            confirmTitle={"OK"}
            type={"ERROR"}/>
        </>}
        </>
    )
}

const styles = StyleSheet.create({
    dim: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: BgColor,
        opacity: 1,
        top: 0,
        left: 0,
        bottom: 0,
    }
})

export default AppStateManager;