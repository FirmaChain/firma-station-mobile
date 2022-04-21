import React, { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/hooks";
import { AddressBoxColor, BgColor, TextCatTitleColor } from "@/constants/theme";
import { removeWalletWithAutoLogin } from "@/util/wallet";
import { GUIDE_URI, VERSION } from "@/../config";
import Container from "@/components/parts/containers/conatainer";
import ViewContainer from "@/components/parts/containers/viewContainer";
import BioAuthRadio from "./bioAuthRadio";
import MenuItem from "./menuItem";
import Disconnect from "./disconnect";
import Delete from "./delete";
import TextMenuItem from "./textMenuItem";
import { CommonActions, RemoveableActions } from "@/redux/actions";
import { setFirmaSDK } from "@/util/firma";
import { setClient } from "@/apollo";
import { setExplorerUrl } from "@/constants/common";
import CustomModal from "@/components/modal/customModal";
import ModalItems from "@/components/modal/modalItems";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Setting>;

const Setting = () => {
    const navigation:ScreenNavgationProps = useNavigation();
    const {wallet, common, removeable} = useAppSelector(state => state);

    const networkList = ["MainNet", "TestNet"];
    const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
    const [openNetworkSelectModal, setOpenNetworkSelectModal] = useState(false);
    const [tabCount, setTabCount] = useState(removeable.networkChangeActivate? 50:0);

    const settingList = [
        {title: 'Change Password', path: 'ChangePW'},
        {title: 'Export Mnemonic', path: 'ExportMN'},
        {title: 'Export Private Key', path: 'ExportPK'},
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

    const handleMoveToWeb = (key:string) => {
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    }


    const handleNetworkSelectModal = (open: boolean) => {
        if(tabCount >= 50){
            RemoveableActions.handleNetworkChangeActivate(true);
            setOpenNetworkSelectModal(open);
        } else {
            setTabCount(tabCount + 1);
        }
    }

    const handleSelectNetwork = (index:number) => {
        if(index === selectedNetworkIndex) return setOpenNetworkSelectModal(false);
        CommonActions.handleIsNetworkChange(true);
        CommonActions.handleLoadingProgress(true);
        setFirmaSDK(networkList[index]);
        setClient(networkList[index]);
        setExplorerUrl(networkList[index]);
        CommonActions.handleNetwork(networkList[index]);
        setSelectedNetworkIndex(index);
        setOpenNetworkSelectModal(false);
    }

    
    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        for(var i=0; i<networkList.length; i++){
            if(common.network === networkList[i])setSelectedNetworkIndex(i);
        }
    }, [])

    return (
        <Container
            title="Setting"
            handleGuide={()=>handleMoveToWeb("setting")}
            backEvent={handleBack}>
            <ViewContainer bgColor={BgColor}>
                <View style={{flex: 1}}>
                    <ScrollView 
                        keyboardShouldPersistTaps={"handled"}
                        style={{borderTopWidth: 1, borderTopColor: BgColor}}>
                        <View style={styles.topButtonsBox}>
                            <TextMenuItem 
                                title="Wallet" 
                                content={wallet.name} 
                                bgColor={AddressBoxColor} 
                                icon={true} 
                                iconColor={TextCatTitleColor}
                                iconSize={20}
                                iconName={"square-edit-outline"} 
                                iconType={"MaterialCommunityIcons"}
                                onPressEvent={()=>handleMenus("ChangeWN")}/>
                        </View>
                        <BioAuthRadio wallet={wallet}/>
                        {settingList.map((item, index) => {
                            return (
                                <MenuItem key={index} title={item.title} path={item.path} handleMenus={handleMenus} />
                            )
                        })}
                        <Pressable style={styles.bottomButtonsBox} onPress={() => handleNetworkSelectModal(true)}>
                            <TextMenuItem title="Version" content={"v" + VERSION} />
                        </Pressable>
                        <View style={styles.bottomButtonsBox}>
                            <Disconnect handleDisconnect={disconnectWallet} />
                            <Delete wallet={wallet} handleDisconnect={disconnectWallet} />
                        </View>

                        <CustomModal visible={openNetworkSelectModal} handleOpen={handleNetworkSelectModal}>
                            <ModalItems initVal={selectedNetworkIndex} data={networkList} onPressEvent={handleSelectNetwork}/>
                        </CustomModal>
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