import React, { useCallback, useEffect, useState } from 'react';
import AlertModal from '@/components/modal/alertModal';
import { useInterval } from '@/hooks/common/hooks';

interface IProps {
    data: any;
    refreshData: () => void;
}

const MaintenanceModal = ({ data, refreshData }: IProps) => {
    const [openAlertModal, setOpenAlertModal] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0);
    const [buttonText, setButtonText] = useState('OK');

    const handleRefreshCount = useCallback(() => {
        let count = refreshCount - 1;
        setRefreshCount(count);
    }, [refreshCount]);

    useInterval(
        () => {
            handleRefreshCount();
        },
        refreshCount >= 1 ? 1000 : null,
        true
    );

    const handleAlertModalOpen = (open: boolean) => {
        if (open) {
            setOpenAlertModal(open);
        } else {
            if (refreshCount === 0) {
                setRefreshCount(5);
                refreshData();
            } else {
                return;
            }
        }
    };

    useEffect(() => {
        setButtonText(refreshCount === 0 ? 'OK' : `${refreshCount}`);
    }, [refreshCount]);

    return (
        <AlertModal
            visible={openAlertModal}
            handleOpen={handleAlertModalOpen}
            forcedActive={true}
            title={data.title}
            desc={data.content}
            confirmTitle={buttonText}
            type={'CONFIRM'}
        />
    );
};

export default MaintenanceModal;
