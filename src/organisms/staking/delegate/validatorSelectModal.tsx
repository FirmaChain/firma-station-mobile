import React, { useEffect, useState } from 'react';
import { BgColor } from '@/constants/theme';

import { IStakeInfo } from '@/hooks/staking/hooks';
import CustomModal from '@/components/modal/customModal';
import ModalItemsForValidator from '@/components/modal/modalItemsForValidator';

interface IProps {
    list: Array<IStakeInfo>;
    open: boolean;
    myAddress: string;
    setOpenModal: (value: boolean) => void;
    setValue: (address: string) => void;
    resetValues: boolean;
}

const ValidatorSelectModal = ({ list, open, myAddress, setOpenModal, setValue, resetValues }: IProps) => {
    const [selected, setSelected] = useState('');

    const handleOpenModal = (open: boolean) => {
        setOpenModal(open);
    };

    const handleSelectWallet = (address: string) => {
        setValue(address);
        setSelected(address);
        handleOpenModal(false);
    };

    useEffect(() => {
        handleSelectWallet('');
    }, [resetValues]);

    return (
        <CustomModal visible={open} bgColor={BgColor} handleOpen={handleOpenModal}>
            <ModalItemsForValidator
                title={'Source Validator'}
                initVal={selected}
                myAddress={myAddress}
                data={list}
                onPressEvent={handleSelectWallet}
            />
        </CustomModal>
    );
};

export default ValidatorSelectModal;
