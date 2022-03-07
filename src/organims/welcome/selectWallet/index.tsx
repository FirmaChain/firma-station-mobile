import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Keyboard } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import InputSetVertical from "@/components/input/inputSetVertical";
import Button from "@/components/button/button";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { PLACEHOLDER_FOR_PASSWORD } from "@/constants/common";
import { BgColor } from "@/constants/theme";
import { getWalletList, setBioAuth, setEncryptPassword, setWalletWithAutoLogin } from "@/util/wallet";
import { getChain } from "@/util/secureKeyChain";
import { WalletNameValidationCheck } from "@/util/validationCheck";
import { getAdrFromMnemonic } from "@/util/firma";
import { decrypt, keyEncrypt } from "@/util/keystore";
import { WalletActions } from "@/redux/actions";
import { useNavigation } from "@react-navigation/native";
import Container from "@/components/parts/containers/conatainer";
import WalletSelector from "./walletSelector";

type SelectWalletScreenNavigationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

const SelectWallet = () => {
    const navigation: SelectWalletScreenNavigationProps = useNavigation();

    const [items, setItems]:Array<any> = useState([]);
    const [selected, setSelected] = useState(-1);
    const [selectedWallet, setSelectedWallet] = useState('');
    
    const [openSelectModal, setOpenSelectModal] = useState(false);

    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [walletInfo, setWalletInfo] = useState('');

    const passwordText = {
        title : 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD,
    }

    const handleOpenSelectModal = (open:boolean) => {
        setOpenSelectModal(open);
    }

    const handleSelectWallet = (index:number) => {
        setSelected(index);
        handleOpenSelectModal(false);
    }
    
    useEffect(() => {
        if(selected >= 0){
            setSelectedWallet(items[selected]);
        }
    }, [selected])

    const WalletList = async() => {
        await getWalletList().then(res => {            
            setItems(res);
        }).catch(error => {
            console.log('error : ' + error);
        })
    }

    const onChangePassword = (value: string) => {
        setPassword(value);
        PasswordCheck(value);
    }

    const PasswordCheck = async(password: string) => {
        if(password.length >= 10){
            let nameCheck = await WalletNameValidationCheck(selectedWallet);
            
            if(nameCheck){
                const key:string = keyEncrypt(selectedWallet, password);
                await getChain(selectedWallet).then(res => {
                    if(res){
                        let w = decrypt(res.password, key.toString());
                        if(w !== null) {
                            setPwValidation(true);
                            setWalletInfo(w);
                        } else {
                            setPwValidation(false);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                    setPwValidation(false);
                });
            } 
        } else {
            setPwValidation(false);
        }
    }

    const onSelectWalletAndMoveToHome = async() => {
        let adr = '';
        await getAdrFromMnemonic(walletInfo).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

        await setWalletWithAutoLogin(JSON.stringify({
            name: selectedWallet,
            address: adr,
        }));
        
        await setEncryptPassword(password);

        WalletActions.handleWalletName(selectedWallet);
        WalletActions.handleWalletAddress(adr);

        setBioAuth(password);
        navigation.reset({routes: [{name: 'Home'}]});
    }

    useEffect(() => {
        WalletList();
        setPwValidation(false);
        return () => {
            setItems([]);
        }
    }, [])

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Select wallet"
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
                            onChangeEvent={onChangePassword} />
                    </View>
                    <CustomModal visible={openSelectModal} handleOpen={handleOpenSelectModal}>
                        <ModalItems initVal={selected} data={items} onPressEvent={handleSelectWallet}/>
                    </CustomModal>
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