import React, { useEffect } from "react";
import { AppState, Platform, StyleSheet, View } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import { CommonActions } from "@/redux/actions";
import { convertNumber, getTimeStamp } from "@/util/common";
import { BgColor } from "@/constants/theme";
import ValidationModal from "@/components/modal/validationModal";

const AppStateManager = () => {
    const {wallet, common} = useAppSelector(state => state);

    const handleUnlock = (result: string) => {
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
        if(wallet.name === ""){
            CommonActions.handleAppPausedTime("");
        }
        if(common.appPausedTime !== "" && common.appState === "active"){
            if(convertNumber(getTimeStamp()) - convertNumber(common.appPausedTime) >= 5){
                CommonActions.handleLockStation(true);
            } else {
                CommonActions.handleAppPausedTime("");
            }
        }
    }, [common.appState, common.appPausedTime]);

    useEffect(() => {
        CommonActions.handleAppPausedTime("");
        CommonActions.handleAppState("active");
        CommonActions.handleLockStation(false);
    }, [])

    return (
        <>
        {wallet.name !== "" &&
        <>
        {(common.isBioAuthInProgress === false && common.appState !== "active") && <View style={styles.dim}/>}
        {common.appPausedTime !== "" && <View style={styles.dim}/>}
        {(common.appState !== "background" && common.lockStation) &&
            <ValidationModal 
                type="lock" 
                open={common.lockStation}
                setOpenModal={handleUnlock} 
                validationHandler={handleUnlock}/>
        }
        </>
        }
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