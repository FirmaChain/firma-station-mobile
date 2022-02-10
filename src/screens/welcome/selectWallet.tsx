import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import InputSetVertical from "@/components/input/inputSetVertical";
import Button from "@/components/button/button";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { DownArrow } from "@/components/icon/icon";
import { CONTEXT_ACTIONS_TYPE, PLACEHOLDER_FOR_PASSWORD } from "@/constants/common";
import { BgColor, InputBgColor, InputPlaceholderColor, Lato, TextColor, TextGrayColor } from "@/constants/theme";
import { getWalletList, setBioAuth, setWalletWithAutoLogin } from "@/util/wallet";
import { getChain } from "@/util/secureKeyChain";
import { WalletNameValidationCheck } from "@/util/validationCheck";
import { getAdrFromMnemonic } from "@/util/firma";
import { decrypt, keyEncrypt } from "@/util/keystore";
import { AppContext } from "@/util/context";

type SelectWalletScreenNavigationProps = StackNavigationProp<StackParamList, Screens.SelectWallet>;

interface SelectWalletScreenProps {
    navigation: SelectWalletScreenNavigationProps;
}

const SelectWalletScreen: React.FunctionComponent<SelectWalletScreenProps> = (props) => {
    const {navigation} = props;

    const {dispatchEvent} = useContext(AppContext);

    const [items, setItems]:Array<any> = useState([]);
    const [selected, setSelected] = useState(-1);
    const [openModal, setOpenModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState('');
    const [pwValidation, setPwValidation] = useState(false);
    const [password, setPassword] = useState('');
    const [walletInfo, setWalletInfo] = useState('');

    const passwordText = {
        title : 'Password',
        placeholder: PLACEHOLDER_FOR_PASSWORD,
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
        let adr = '';
        await getAdrFromMnemonic(walletInfo).then(res => {
            if(res !== undefined) adr = res;
        }).catch(error => console.log('error : ' + error));

        await setWalletWithAutoLogin(JSON.stringify({
            name: selectedWallet,
            address: adr,
        }));
        
        dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["WALLET"], {
            name: selectedWallet,
            address: adr,
        });

        setBioAuth(password);

        navigation.reset({routes: [{name: 'Home'}]});
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
                                <DownArrow size={10} color={InputPlaceholderColor} />
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

