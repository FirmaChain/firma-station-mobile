import React, { useState } from "react";
import { Linking, Platform } from "react-native";
import { APPLE_APP_STORE, APPLE_APP_STORE_WEB, GOOGLE_PLAY_STORE, GOOGLE_PLAY_STORE_WEB, UPDATE_NOTIFICATION } from "@/constants/common";
import AlertModal from "@/components/modal/alertModal";

const UpdateModal = () => {
    const [openAlertModal, setOpenAlertModal] = useState(true);

    const handleAlertModalOpen = (open:boolean) => {
        if(open === false){
            handleLinkingStore();
        } else {
            setOpenAlertModal(open);
        }
    }

    const handleLinkingStore = async() => {
        let store = Platform.OS === "ios"? APPLE_APP_STORE:GOOGLE_PLAY_STORE;
        const supported = await Linking.canOpenURL(store);
        if(supported === false){
            store = Platform.OS === "ios"? APPLE_APP_STORE_WEB:GOOGLE_PLAY_STORE_WEB;
        }
        await Linking.openURL(store);
    }

    return (
        <AlertModal
            visible={openAlertModal}
            handleOpen={handleAlertModalOpen}
            forcedActive={true}
            title={"Notice"}
            desc={UPDATE_NOTIFICATION}
            confirmTitle={"OK"}
            type={"CONFIRM"}/>
    )
}

export default UpdateModal;