import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Keyboard, Linking } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { useNavigation } from "@react-navigation/native";
import { WalletActions } from "@/redux/actions";
import { PLACEHOLDER_FOR_PASSWORD } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import { getWalletList, setBioAuth, setEncryptPassword, setWalletList, setWalletWithAutoLogin } from "@/util/wallet";
import { PasswordCheck } from "@/util/validationCheck";
import { getAdrFromMnemonic } from "@/util/firma";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import InputSetVertical from "@/components/input/inputSetVertical";
import Button from "@/components/button/button";
import CustomModal from "@/components/modal/customModal";
import WalletSelector from "./walletSelector";
import ModalWalletList from "@/components/modal/modalWalletList";
import { GUIDE_URI } from "@/../config";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const SelectWallet = () => {
    const navigation: ScreenNavgationProps = useNavigation();

    const [items, setItems]:Array<any> = useState([]);
    const [selected, setSelected] = useState(-1);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [resetValues, setResetValues] = useState(false);
    
    const [openSelectModal, setOpenSelectModal] = useState(false);

    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');

    const passwordText = {
        title : 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD,
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
    
    useEffect(() => {
        if(selected >= 0 && selectedWallet !== items[selected]){
            setSelectedWallet(items[selected]);
            setMnemonic('');
            setResetValues(false);
        }
    }, [selected])

    const WalletList = async() => {
        await getWalletList().then(res => {            
            setItems(res);
        }).catch(error => {
            console.log('error : ' + error);
        })
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

    const onSelectWalletAndMoveToHome = async() => {
        let adr = '';
        await getAdrFromMnemonic(mnemonic).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

        await setWalletWithAutoLogin(JSON.stringify({
            name: selectedWallet,
            address: adr,
        }));
        
        await setEncryptPassword(password);

        WalletActions.handleWalletName(selectedWallet);
        WalletActions.handleWalletAddress(adr);

        setBioAuth(selectedWallet, password);
        navigation.reset({routes: [{name: Screens.Home}]});
    }

    useEffect(() => {
        WalletList();
        setPwValidation(false);
        return () => {
            setItems([]);
        }
    }, [])

    const handleMoveToWeb = () => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI["selectWallet"]});
        Linking.openURL(GUIDE_URI["selectWallet"]);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Select wallet"
            handleGuide={handleMoveToWeb}
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <Pressable style={styles.contentBox} onPress={() => Keyboard.dismiss()}>
                    <View style={styles.Box}>
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
                    <CustomModal visible={openSelectModal} bgColor={BgColor} handleOpen={handleOpenSelectModal}>
                        <ModalWalletList initVal={selected} data={items} handleEditWalletList={handleEditWalletList} onPressEvent={handleSelectWallet}/>
                    </CustomModal>
                    }
                    <View style={styles.buttonBox}>
                        <Button title='Next' active={pwValidation} onPressEvent={onSelectWalletAndMoveToHome} />
                    </View>
                </Pressable>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    contentBox: {
        flex: 3,
        paddingHorizontal: 20,
    },
    Box: {
        paddingVertical: 20,
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
    }
})

export default SelectWallet;