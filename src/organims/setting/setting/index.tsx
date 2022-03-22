import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { AddressBoxColor, BgColor } from "@/constants/theme";
import { removeWalletWithAutoLogin } from "@/util/wallet";
import { VERSION } from "@/../config";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import BioAuthRadio from "./bioAuthRadio";
import MenuItem from "./menuItem";
import Disconnect from "./disconnect";
import Delete from "./delete";
import TextMenuItem from "./textMenuItem";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Setting>;

const Setting = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const {wallet} = useAppSelector(state => state);

    const settingList = [
        {title: 'Change Wallet name', path: 'ChangeWN'},
        {title: 'Change Password', path: 'ChangePW'},
        {title: 'Export Mnemonic', path: 'ExportMN'},
        {title: 'Export Private key', path: 'ExportPK'},
    ];

    const handleMenus = (path:string) => {
        switch (path) {
            case "ChangeWN":
                navigation.navigate(Screens.ChangeWalletName);
                break;
            case "ChangePW":
                navigation.navigate(Screens.ChangePassword);
                break;
            case "ExportPK":
            case "ExportMN":
                navigation.navigate(Screens.ExportWallet, {type: path});
                break;
            default:
                break;
        }
    }

    const disconnectWallet = () => {
        removeWalletWithAutoLogin();
        navigation.reset({routes: [{name: Screens.Welcome}]});
    }

    const handleBack = () => {
        navigation.goBack();
    }

    return (
        <Container
            title="Setting"
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={{flex: 1}}>
                    <ScrollView 
                        keyboardShouldPersistTaps={"handled"}
                        style={{borderTopWidth: 1, borderTopColor: BgColor}}>
                        <View style={styles.topButtonsBox}>
                            <TextMenuItem title="Wallet" content={wallet.name} bgColor={AddressBoxColor}/>
                        </View>
                        <BioAuthRadio wallet={wallet}/>
                        {settingList.map((item, index) => {
                            return (
                                <MenuItem key={index} title={item.title} path={item.path} handleMenus={handleMenus} />
                            )
                        })}
                        <View style={styles.bottomButtonsBox}>
                            <TextMenuItem title="Version" content={"v" + VERSION} />
                        </View>
                        <View style={styles.bottomButtonsBox}>
                            <Disconnect handleDisconnect={disconnectWallet} />
                            <Delete wallet={wallet} handleDisconnect={disconnectWallet} />
                        </View>
                    </ScrollView>
                </View>
            </ViewContainer>
        </Container>
    )
}

const styles = StyleSheet.create({
    topButtonsBox: {
        paddingBottom: 20,
    },
    bottomButtonsBox: {
        paddingTop: 20,
    },
})

export default Setting;