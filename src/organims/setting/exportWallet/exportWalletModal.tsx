import React from "react";
import { View } from "react-native";
import AlertModal from "@/components/modal/alertModal";
import CustomModal from "@/components/modal/customModal";
import { WARNING_PASSWORD_NOT_MATCH } from "@/constants/common";
import ExportModal from "../modal/exportModal";

interface Props {
    title: string;
    value: string;
    alertOpen: boolean;
    exportOpen: boolean;
    handleOpen: (open:boolean) => void;
    handleGoBack: () => void;
}

const ExportWalletModal = ({title, value, alertOpen, exportOpen, handleOpen, handleGoBack}:Props) => {
    return (
        <View>
            <AlertModal
                visible={alertOpen}
                handleOpen={handleOpen}
                title={'Wrong password'}
                desc={WARNING_PASSWORD_NOT_MATCH}
                confirmTitle={"OK"}
                type={"ERROR"}/>

            <CustomModal
                visible={exportOpen}
                handleOpen={handleOpen}>
                <ExportModal type={title} value={value} onPressEvent={handleGoBack}/>
            </CustomModal>
        </View>
    )
}

export default ExportWalletModal;