import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Screens, StackParamList } from "../../navigators/stackNavigators";
import { getChain } from "../../util/secureKeyChain";
import { BgColor, GrayColor, InputBgColor, InputPlaceholderColor, Lato, TextColor, TextGrayColor } from "../../constants/theme";
import InputSetVertical from "../../components/input/inputSetVertical";
import { WalletNameValidationCheck } from "../../util/validationCheck";
import { decrypt, keyEncrypt } from "../../util/keystore";
import Button from "../../components/button/button";
import { getAdrFromMnemonic } from "../../util/wallet";
import CustomModal from "../../components/modal/customModal";
import ModalItems from "../../components/modal/modalItems";
import { getWalletList } from "../../util/walletList";
import Icon from "react-native-vector-icons/AntDesign";
import Container from "../../components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";

type SelectWalletScreenNavigationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

interface SelectWalletScreenProps {
    navigation: SelectWalletScreenNavigationProps;
}

const SelectWalletScreen: React.FunctionComponent<SelectWalletScreenProps> = (props) => {
    const {navigation} = props;

    const [items, setItems]:Array<any> = useState([]);
    const [selected, setSelected] = useState(-1);
    const [openModal, setOpenModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [pwValidation, setPwValidation] = useState(false);
    const [walletInfo, setWalletInfo] = useState('');
    
    const passwordText = {
        title : 'Password',
        placeholder: 'Must be at least 10 characters',
    }

    const handleOpenModal = (open:boolean) => {
        setOpenModal(open);
    }

    const handleSelectWallet = (index:number) => {
        setSelected(index);
        handleOpenModal(false);
    }
    
    useEffect(() => {
        if(selected >= 0){
            setSelectedWallet(items[selected]);
        }
    }, [selected])

    const WalletList = async() => {
        await getWalletList().then(res => {
            console.log(res);
            
            setItems(res);
        }).catch(error => {
            console.log('error : ' + error);
        })
    }

    const onChangePassword = (value: string) => {
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
                        if(w.length > 0) {
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
        }
    }

    const onSelectWalletAndMoveToMain = async() => {
        let adr = null;
        await getAdrFromMnemonic(walletInfo).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

        navigation.reset({routes: [{name: 'Home', params: {address: adr, walletName: selectedWallet} }]});
    }

    useEffect(() => {
        WalletList();
        return () => {
            setItems([]);
        }
    }, [])

    useEffect(() => {
        setPwValidation(false);
        return () => {
        }
    }, [SelectWalletScreen]);

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Select wallet"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={styles.contentBox}>
                    <View style={styles.Box}>
                        <View style={styles.walletContainer}>
                            <Text style={styles.title}>Wallet</Text>
                            <TouchableOpacity style={styles.walletBox} onPress={() => handleOpenModal(true)}>
                                <Text style={[styles.wallet, selected < 0 &&{color: InputPlaceholderColor}]}>{selected < 0? 'Select your wallet' : selectedWallet}</Text>
                                <Icon name="caretdown" size={10} color={InputPlaceholderColor} />
                            </TouchableOpacity>
                        </View>
                        <InputSetVertical
                            title={passwordText.title}
                            message={''}
                            validation={true}
                            placeholder={passwordText.placeholder} 
                            secure={true}
                            onChangeEvent={onChangePassword} />
                    </View>
                    <CustomModal visible={openModal} handleOpen={handleOpenModal}>
                        <ModalItems initVal={selected} data={items} onPressEvent={handleSelectWallet}/>
                    </CustomModal>
                    <View style={styles.buttonBox}>
                        <Button title='Next' active={pwValidation} onPressEvent={onSelectWalletAndMoveToMain} />
                    </View>
                </View>
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
    walletContainer: {
        marginBottom: 20,
    },
    title: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextGrayColor,
        marginBottom: 5,
    },
    walletBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: InputBgColor,
        marginBottom: 5,
    },
    wallet: {
        fontFamily: Lato,
        fontSize:14,
        color: TextColor,
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
    }
})

export default SelectWalletScreen;
