import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "../../navigators/stackNavigators";
import { TextColor } from "../../constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";
import DeleteWallet from "../../organims/setting/modal/deleteWallet";
import { removeChain, setChain } from "../../util/secureKeyChain";
import { getWalletList } from "../../util/walletList";
import Container from "../../components/parts/containers/conatainer";

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
        {title: 'Change password', path: 'ChangePW'},
        {title: 'Export private key', path: 'ExportPK'},
        {title: 'Export wallet with QR code', path: 'ExportQR'},
    ];

    const moveToWelcome = () => {
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
            
            if(arr.length > 0){
                arr.filter(item => item !== walletName).map((item, index) => {
                    newList += item + "/";
                });
            }
            newList = newList.slice(0, -1);

            setChain('test_3', newList);
            handleDelModal(false);
            moveToWelcome();
        }).catch(error => {
            console.log(error)
        });
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Setting"
            backEvent={handleBack}>

            <View  style={styles.contents}>
                <ScrollView>
                    {settingList.map((item, index) => {
                        return (
                        <TouchableOpacity key={index} onPress={()=>handleMenus(item.path)}>
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Icon name="arrow-forward-ios" size={20} color={"#ddd"}/>
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
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    contents: {
        paddingTop: 1,
        flex: 1,
        backgroundColor: "#efefef",
    },
    listItem: {
        backgroundColor: "#fff",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    itemTitle: {
        fontSize: 16,
        color: TextColor
    },
    bottomButtonsBox: {
        paddingTop: 20,
    },
})

export default SettingScreen;