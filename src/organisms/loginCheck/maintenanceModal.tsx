import React, { useState } from "react";
import AlertModal from "@/components/modal/alertModal";

interface IProps {
    data: any;
}

const MaintenanceModal = ({data}:IProps) => {
    const [openAlertModal, setOpenAlertModal] = useState(true);

    const handleAlertModalOpen = (open:boolean) => {
        if(open){
            setOpenAlertModal(open);
        }
    }

    return (
        <AlertModal
            visible={openAlertModal}
            handleOpen={handleAlertModalOpen}
            forcedActive={true}
            title={data.title}
            desc={data.content}
            confirmTitle={"OK"}
            type={"CONFIRM"}/>
    )
}

export default MaintenanceModal;