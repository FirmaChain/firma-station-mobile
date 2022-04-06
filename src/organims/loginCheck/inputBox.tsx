import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { PasswordCheck } from "@/util/validationCheck";
import { getWalletList, setWalletList } from "@/util/wallet";
import { PLACEHOLDER_FOR_PASSWORD } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import Button from "@/components/button/button";
import InputSetVertical from "@/components/input/inputSetVertical";
import CustomModal from "@/components/modal/customModal";
import ModalWalletList from "@/components/modal/modalWalletList";
import WalletSelector from "../welcome/selectWallet/walletSelector";

interface Props {
    walletName: string;
    useBio: boolean;
    fadeIn: any;
    loginHandler: (mnemonic:string, name:string, password: string) => void;
}

const InputBox = ({walletName, useBio, fadeIn, loginHandler}:Props) => {
    
    const passwordText = {
        title : 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD,
    }

    const [items, setItems]:Array<any> = useState([]);
    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [resetValues, setResetValues] = useState(false);
    const [openSelectModal, setOpenSelectModal] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [selectedWallet, setSelectedWallet] = useState('');

    const WalletList = async() => {
        await getWalletList().then(res => {            
            setItems(res);
        }).catch(error => {
            console.log('error : ' + error);
        })
    }

    const handleOpenSelectModal = (open:boolean) => {
        setOpenSelectModal(open);
    }

    const handleSelectWallet = (index:number) => {
        if(index === selected) {return handleOpenSelectModal(false);}
        setSelected(index);
        setResetValues(true);
        handleOpenSelectModal(false);
    }

    const handleEditWalletList = async(list:string, newIndex: number) => {
        setWalletList(list);
        await WalletList();
        setSelected(newIndex);
    }

    const handleLogin = () => {
        loginHandler(mnemonic, selectedWallet, password);
    }

    const onChangePassword = async(value: string) => {
        setPassword(value);

        let result = await PasswordCheck(selectedWallet, value);
        if(result){
            setPwValidation(true);
            setMnemonic(result);
        } else {
            setPwValidation(false);
        }
    }

    useEffect(() => {
        if(items.length > 0){
            setSelectedWallet(items[items.indexOf(walletName)]);
            setSelected(items.indexOf(walletName));
        }
    }, [items])

    useEffect(() => {
        if(selected >= 0 && selectedWallet !== items[selected]){
            setSelectedWallet(items[selected]);
            setMnemonic('');
            setResetValues(false);
        }
    }, [selected])

    useEffect(() => {
        WalletList();
        setPwValidation(false);
        return () => {
            setItems([]);
        }
    }, [])

    return (
        <Animated.View 
            style={[styles.buttonBox, {opacity: useBio?fadeIn:1}]}>
            <View style={{paddingBottom: 20}}>
                <WalletSelector selectedWallet={selectedWallet} handleOpenModal={handleOpenSelectModal} />
                <InputSetVertical
                    title={passwordText.title}
                    message={''}
                    validation={true}
                    placeholder={passwordText.placeholder} 
                    secure={true}
                    resetValues={resetValues}
                    onChangeEvent={onChangePassword} />
            </View>
            {openSelectModal && 
            <CustomModal visible={openSelectModal} handleOpen={handleOpenSelectModal}>
                <ModalWalletList initVal={selected} data={items} handleEditWalletList={handleEditWalletList} onPressEvent={handleSelectWallet}/>
            </CustomModal>
            }
            <Button title='Connect' active={pwValidation} onPressEvent={handleLogin} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    buttonBox: {
        width: "100%", 
        paddingHorizontal: 20, 
        justifyContent: "flex-end",
        backgroundColor: BgColor,
    },
})

export default InputBox;