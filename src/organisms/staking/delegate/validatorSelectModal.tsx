import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { IStakeInfo } from "@/hooks/staking/hooks";
import { BgColor } from "@/constants/theme";
import CustomModal from "@/components/modal/customModal";
import ModalItemsForValidator from "@/components/modal/modalItemsForValidator";

interface IProps {
    list: Array<IStakeInfo>;
    open: boolean;
    myAddress: string;
    setOpenModal: Function;
    setValue: Function;
    resetValues: boolean;
}

const ValidatorSelectModal = ({list, open, myAddress, setOpenModal, setValue, resetValues}:IProps) => {
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
        <CustomModal visible={open} bgColor={BgColor} handleOpen={handleOpenModal}>
            <ModalItemsForValidator title={"Source Validator"} initVal={selected} myAddress={myAddress} data={list} onPressEvent={handleSelectWallet}/>
        </CustomModal>
    )
}

const styles = StyleSheet.create({

})

export default ValidatorSelectModal;