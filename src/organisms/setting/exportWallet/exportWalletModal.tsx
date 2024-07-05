import React, { useEffect } from 'react';
import { View } from 'react-native';
import { WARNING_PASSWORD_NOT_MATCH } from '@/constants/common';
import AlertModal from '@/components/modal/alertModal';
import CustomModal from '@/components/modal/customModal';
import ExportModal from '../modal/exportModal';
import { useAppSelector } from '@/redux/hooks';

interface IProps {
    title: string;
    value: string;
    alertOpen: boolean;
    exportOpen: boolean;
    handleOpen: (open: boolean) => void;
    handleBack: () => void;
}

const ExportWalletModal = ({ title, value, alertOpen, exportOpen, handleOpen, handleBack }: IProps) => {
    const { common } = useAppSelector((state) => state);

    useEffect(() => {
        if (common.appState !== 'active' && common.isBioAuthInProgress === false) handleOpen(false);
    }, [common.appState]);

    return (
        <View>
            {alertOpen && (
                <AlertModal
                    visible={alertOpen}
                    handleOpen={handleOpen}
                    title={'Wrong password'}
                    desc={WARNING_PASSWORD_NOT_MATCH}
                    confirmTitle={'OK'}
                    type={'ERROR'}
                />
            )}

            <CustomModal visible={exportOpen} handleOpen={handleOpen}>
                <ExportModal type={title} value={value} onPressEvent={handleBack} />
            </CustomModal>
        </View>
    );
};

export default ExportWalletModal;
