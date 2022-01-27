import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "../../navigators/appRoutes";
import { BgColor, BoxColor, DisableColor, Lato, PointColor, PointDarkColor, PointLightColor, TextColor, WhiteColor } from "../../constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";
import DeleteWallet from "../../organims/setting/modal/deleteWallet";
import { removeChain, setChain } from "../../util/secureKeyChain";
import { getUseBioAuth, getWalletList, setUseBioAuth } from "@/util/wallet";
import Container from "../../components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import { getUniqueId } from "react-native-device-info";
import { LayoutAnim } from "@/util/animation";
import { WALLET_LIST } from "@/constants/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Setting>;

export type SettingParams = {
    walletName?: string;
}

interface SettingProps {
    route: {params: SettingParams};
    navigation: ScreenNavgationProps;
}

const SettingScreen: React.FunctionComponent<SettingProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {walletName} = params;
    const wallet = walletName?walletName:'';

    const [openDelModal, setOpenDelModal] = useState(false);
    const [useBio, setUseBio] = useState(false);

    const handleBioAuth = (value:boolean) => {
        LayoutAnim();
        setUseBio(value);
        setUseBioAuth(value);
    }

    const handleMenus = (path:string) => {
        switch (path) {
            case "ChangePW":
                navigation.navigate(Screens.ChangePassword, {walletName: walletName});
                break;
            case "ExportPK":
                navigation.navigate(Screens.ExportPrivateKey, {walletName: walletName});
                break;
            default:
                break;
        }
    }

    const settingList = [
        {title: 'Change Password', path: 'ChangePW'},
        {title: 'Export Private key', path: 'ExportPK'},
        {title: 'Export wallet with QR code', path: 'ExportQR'},
    ];

    const moveToWelcome = async() => {
        await removeChain(getUniqueId())
            .then(res => console.log(res))
            .catch(error => console.log(error));
        navigation.reset({routes: [{name: 'Welcome'}]});
    }

    const handleDelModal = (open:boolean) => {
        setOpenDelModal(open);
    }

    const handleDeleteWallet = async(key:string) => {
        await removeChain(wallet)
            .then(res => console.log(res))
            .catch(error => console.log(error));

        let newList:string = '';
        await getWalletList().then(res => {
            let arr = res !== undefined? res : [];
            
            if(arr.length > 1){
                arr.filter(item => item !== walletName).map((item, index) => {
                    newList += item + "/";
                });
                newList = newList.slice(0, -1);
            }

            setChain(WALLET_LIST, newList);
            handleDelModal(false);
            moveToWelcome();
        }).catch(error => {
            console.log(error)
        });
    }

    useEffect(() => {
        const getUseBioAuthState = async() => {
            const result = await getUseBioAuth();
            setUseBio(result);
        }
        getUseBioAuthState();
    }, []);
    

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Setting"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <ScrollView style={{borderTopWidth: 1, borderTopColor: BgColor}}>
                        <View style={styles.listItem}>
                            <Text style={styles.itemTitle}>Use Bio Auth</Text>
                            <TouchableOpacity onPress={()=>handleBioAuth(!useBio)}>
                                <View style={[styles.radioWrapper, useBio?{backgroundColor: PointColor, alignItems: "flex-end"}:{backgroundColor: DisableColor}]}>
                                    <View style={styles.radio} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    {settingList.map((item, index) => {
                        return (
                        <TouchableOpacity key={index} onPress={()=>handleMenus(item.path)}>
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Icon name="arrow-forward-ios" size={20} color={WhiteColor}/>
                            </View>
                        </TouchableOpacity>
                        )
                    })}
                    <View style={styles.bottomButtonsBox}>
                        <TouchableOpacity onPress={() => moveToWelcome()}>
                            <View style={[styles.listItem, {justifyContent: "center"}]}>
                                <Text style={[styles.itemTitle, {fontWeight:"bold"}]}>Disconnect</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleDelModal(true)}>
                            <View style={[styles.listItem, {justifyContent: "center"}]}>
                                <Text style={[styles.itemTitle, {color: "tomato", fontWeight:"bold"}]}>Delete Wallet</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <DeleteWallet 
                        walletName={wallet} 
                        open={openDelModal} 
                        setOpenModal={handleDelModal}
                        deleteWallet={handleDeleteWallet}/>
                </ScrollView>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    listItem: {
        backgroundColor: BoxColor,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: .5,
        borderBottomColor: BgColor,
    },
    itemTitle: {
        fontFamily: Lato,
        fontSize: 16,
        color: TextColor
    },
    bottomButtonsBox: {
        paddingTop: 20,
    },
    radioWrapper: {
        width: 45,
        borderRadius: 20,
        justifyContent: "center",
        padding: 3,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 50,
        backgroundColor: WhiteColor,
    }
})

export default SettingScreen;