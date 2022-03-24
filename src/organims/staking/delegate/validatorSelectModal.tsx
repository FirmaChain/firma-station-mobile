import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { StakeInfo } from "@/hooks/staking/hooks";
import ModalItemsForValidator from "@/components/modal/modalItemsForValidator";
import CustomModal from "@/components/modal/customModal";

interface Props {
    list: Array<StakeInfo>;
    open: boolean;
    setOpenModal: Function;
    setValue: Function;
    resetValues: boolean;
}

const ValidatorSelectModal = ({list, open, setOpenModal, setValue, resetValues}:Props) => {
    const [selected, setSelected] = useState('');

    const handleOpenModal = (open:boolean) => {
        setOpenModal && setOpenModal(open);
    }

    const handleSelectWallet = (address:string) => {
        setValue(address);
        setSelected(address);
        handleOpenModal(false);
    }

    useEffect(() => {
        handleSelectWallet('');
    }, [resetValues])
    
    return (
        <CustomModal visible={open} handleOpen={handleOpenModal}>
            <ModalItemsForValidator title={"Source Validator"} initVal={selected} data={list} onPressEvent={handleSelectWallet}/>
        </CustomModal>
    )
}

const styles = StyleSheet.create({

})

export default ValidatorSelectModal;