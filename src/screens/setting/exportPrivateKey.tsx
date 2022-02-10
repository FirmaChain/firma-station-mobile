import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import Button from "@/components/button/button";
import InputSetVertical from "@/components/input/inputSetVertical";
import AlertModal from "@/components/modal/alertModal";
import CustomModal from "@/components/modal/customModal";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { decrypt, keyEncrypt } from "@/util/keystore";
import { getChain } from "@/util/secureKeyChain";
import { PasswordValidationCheck } from "@/util/validationCheck";
import ExportModal from "@/organims/setting/modal/exportModal";
import { BgColor } from "@/constants/theme";
import { PLACEHOLDER_FOR_PASSWORD, WARNING_PASSWORD_NOT_MATCH } from "@/constants/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Setting>;

export type ExportPrivateKeyParams = {
    walletName: string;
}

interface ExportPrivateKeyProps {
    route: {params: ExportPrivateKeyParams};
    navigation: ScreenNavgationProps;
}

const ExportPrivateKeyScreen: React.FunctionComponent<ExportPrivateKeyProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {walletName} = params;

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
        placeholder: PLACEHOLDER_FOR_PASSWORD,
    }

    const handlePassword = (value: string) => {
        setPassword(value);
        setValidation(PasswordValidationCheck(value));
    }

    const exportPrivateKey = async() => {
        await getMnemonicFromChain();
    }

    const getMnemonicFromChain = async() => {
        const key:string = keyEncrypt(walletName, password);
        await getChain(walletName).then(res => {
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
        <Container
            title="Export private key"
            backEvent={handleGoBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <View style={styles.contents}>
                            {/* <Text style={styles.wallet}>{wallet}</Text> */}
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
                            desc={WARNING_PASSWORD_NOT_MATCH}/>

                        <CustomModal
                            visible={status === 1 && isModalOpen}
                            handleOpen={handleModalOpen}>
                            <ExportModal privatekey={privatekey} onPressEvent={handleGoBack}/>
                        </CustomModal>
                    </View>
                </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        paddingHorizontal: 20,
    },
    contents: {
        flex: 2,
        paddingVertical: 20,
    },
    wallet:{
        paddingVertical: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#aaa',
    },
    buttonBox: {
        flex: 1,
        justifyContent: "flex-end",
    }
})

export default ExportPrivateKeyScreen;