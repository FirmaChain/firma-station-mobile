import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import CustomModal from "../../../components/modal/customModal";
import ModalItems from "../../../components/modal/modalItems";

interface Props {
    list: Array<any>;
    open: boolean;
    setOpenModal: Function;
    setValue: Function;
}

const ValidatorSelectModal = ({list, open, setOpenModal, setValue}:Props) => {
    const [selected, setSelected] = useState(-1);

    const handleOpenModal = (open:boolean) => {
        setOpenModal && setOpenModal(open);
    }

    const handleSelectWallet = (index:number) => {
        setValue(index);
        setSelected(index);
        handleOpenModal(false);
    }

    return (
        <CustomModal visible={open} handleOpen={handleOpenModal}>
            <ModalItems initVal={selected} data={list} onPressEvent={handleSelectWallet}/>
        </CustomModal>
    )
}

const styles = StyleSheet.create({

})

export default ValidatorSelectModal;