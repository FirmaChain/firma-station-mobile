import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Platform, StyleSheet, Text, View } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Button from "../../components/button/button";
import Header from "../../components/header/header";
import InputSetVertical from "../../components/input/inputSetVertical";
import AlertModal from "../../components/modal/alertModal";
import CustomModal from "../../components/modal/customModal";
import TitleBar from "../../components/parts/titleBar";
import { BgColor } from "../../constants/theme";
import { Screens, StackParamList } from "../../navigators/stackNavigators";
import { decrypt, keyEncrypt } from "../../util/keystore";
import { getChain } from "../../util/secureKeyChain";
import { PasswordValidationCheck } from "../../util/validationCheck";
import ExportModal from "../../organims/setting/modal/exportModal";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Setting>;

export type ExportPrivateKeyParams = {
    walletName?: string;
}

interface ExportPrivateKeyProps {
    route: {params: ExportPrivateKeyParams};
    navigation: ScreenNavgationProps;
}

const ExportPrivateKeyScreen: React.FunctionComponent<ExportPrivateKeyProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {walletName} = params;
    const wallet = walletName?walletName:'';

    // 0: need to password confirm
    // 1: export privatekey
    const [status, setStatus] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [privatekey, setPrivatekey] = useState('');
    const [validation, setValidation] = useState(false);

    const currentPasswordTextObj = {
        title: "Current password",
        placeholder: "Must be at least 10 characters",
    }

    const handlePassword = (value: string) => {
        setPassword(value);
        setValidation(PasswordValidationCheck(value));
    }

    const exportPrivateKey = async() => {
        await getMnemonicFromChain();
    }

    const getMnemonicFromChain = async() => {
        const key:string = keyEncrypt(wallet, password);
        await getChain(wallet).then(res => {
            if(res){
                let w = decrypt(res.password, key.toString());
                if(w.length > 0) {
                    setMnemonic(w);
                    setIsModalOpen(false);
                } else {
                    setIsModalOpen(true);
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const getPrivatekeyFromMnemonic = async() => {
            if(mnemonic !== ''){
                setPrivatekey('PRIVATE KEY');
                setStatus(1);
                setIsModalOpen(true);
            }
        }

        getPrivatekeyFromMnemonic();
    }, [mnemonic])

    const handleModalOpen = (open:boolean) => {
        setIsModalOpen(open);
        setMnemonic('');
    }

    const handleGoBack = () => {
        setIsModalOpen(false);
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <Header step='' onPressEvent={() => handleGoBack()} />
            <TitleBar title='Export private key' />
            <View style={styles.contents}>
                <Text style={styles.wallet}>{wallet}</Text>
                <InputSetVertical
                    title={currentPasswordTextObj.title}
                    placeholder={currentPasswordTextObj.placeholder} 
                    validation={true}
                    secure={true}
                    onChangeEvent={handlePassword} />
            </View>
            <View style={styles.buttonBox}>
                <Button title='Export' active={validation} onPressEvent={exportPrivateKey} />
            </View>

            <AlertModal
                visible={status === 0 && isModalOpen}
                handleOpen={handleModalOpen}
                isSingleButton={true}
                title={'Wrong password'}
                desc={'Please check your current password.'}/>

            <CustomModal
                visible={status === 1 && isModalOpen}
                handleOpen={handleModalOpen}>
                <ExportModal privatekey={privatekey} onPressEvent={handleGoBack}/>
            </CustomModal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
        backgroundColor: BgColor,
    },
    contents: {
        flex: 1,
        paddingHorizontal: 20,
    },
    wallet:{
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa',
    },
    buttonBox: {
        justifyContent: "flex-end",
    }
})

export default ExportPrivateKeyScreen;