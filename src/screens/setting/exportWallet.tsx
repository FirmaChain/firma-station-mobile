import React, { useEffect, useMemo, useState } from "react";
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
import { getPrivateKeyFromMnemonic } from "@/util/firma";
import { getPasswordViaBioAuth, getUseBioAuth } from "@/util/wallet";
import { confirmViaBioAuth } from "@/util/bioAuth";
import { useAppSelector } from "@/redux/hooks";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.ExportWallet>;

export type ExportWalletParams = {
    type: string;
}

interface ExportWalletProps {
    route: {params: ExportWalletParams};
    navigation: ScreenNavgationProps;
}

const ExportWalletScreen = (props:ExportWalletProps) => {
    const {navigation, route} = props;
    const {params} = route;
    const {type} = params;

    const {wallet} = useAppSelector(state => state);

    // 0: need to password confirm
    // 1: export privatekey
    const [status, setStatus] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const exportPK = (type === "ExportPK");

    const titleText = useMemo(() => {
        if(exportPK) return "Export private key";
        return "Export mnemonic";
    }, [exportPK])

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

    const exportWallet = async(password:string) => {
        await getMnemonicFromChain(password);
    }

    const getMnemonicFromChain = async(password:string) => {
        const key:string = keyEncrypt(wallet.name, password);
        await getChain(wallet.name).then(res => {
            if(res){
                let w = decrypt(res.password, key.toString());
                if(w !== null) {
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
        if(mnemonic !== ''){
            if(exportPK){
                const getPrivatekey = async() => {
                    if(mnemonic !== ''){
                        await getPrivateKeyFromMnemonic(mnemonic)
                        .then(res => {if(res) setPrivatekey(res)});
                        setStatus(1);
                        setIsModalOpen(true);
                    }
                }
                getPrivatekey();
            } else {
                setStatus(1);
                setIsModalOpen(true);
            }
        }
    }, [mnemonic])

    const handleModalOpen = (open:boolean) => {
        setIsModalOpen(open);
        setMnemonic('');
    }

    const handleGoBack = () => {
        setIsModalOpen(false);
        navigation.goBack();
    }

    useEffect(() => {
        const exportViaBioAuth = async() => {
            const result = await getUseBioAuth();
            if(result){
                const auth = await confirmViaBioAuth();
                if(auth){
                    await getPasswordViaBioAuth().then(res => {
                        exportWallet(res);
                    }).catch(error => console.log(error));
                } else {
                    return;
                }
            } else {
                return;
            }
        }
        exportViaBioAuth();
    }, [])

    return (
        <Container
            title={titleText}
            backEvent={handleGoBack}>
                <ViewContainer bgColor={BgColor}>
                    <View style={styles.container}>
                        <View style={styles.contents}>
                            <InputSetVertical
                                title={currentPasswordTextObj.title}
                                placeholder={currentPasswordTextObj.placeholder} 
                                validation={true}
                                secure={true}
                                onChangeEvent={handlePassword} />
                        </View>
                        <View style={styles.buttonBox}>
                            <Button title='Export' active={validation} onPressEvent={() => exportWallet(password)} />
                        </View>

                        <AlertModal
                            visible={status === 0 && isModalOpen}
                            handleOpen={handleModalOpen}
                            title={'Wrong password'}
                            desc={WARNING_PASSWORD_NOT_MATCH}
                            confirmTitle={"OK"}
                            type={"ERROR"}/>

                        <CustomModal
                            visible={status === 1 && isModalOpen}
                            handleOpen={handleModalOpen}>
                            <ExportModal type={exportPK?"Private Key":"Mnemonic"} value={exportPK?privatekey:mnemonic} onPressEvent={handleGoBack}/>
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

export default ExportWalletScreen;