import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions, ModalActions } from "@/redux/actions";
import { GUIDE_URI } from "@/../config";
import { Linking } from "react-native";
import { useAppSelector } from "@/redux/hooks";
import TabContainer from "@/components/parts/containers/tabContainer";
import TabNavigators from "@/navigators/tabNavigators";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface IProps {
    title: string;
}

const Home = ({title}:IProps) => {
    const navigation:ScreenNavgationProps = useNavigation();

    const { wallet, common, modal } = useAppSelector(state => state);
    const [deepLink, setDeepLink] = useState("");

    const moveToSetting = () => {
        navigation.navigate(Screens.Setting);
    }

    const moveToHistory = () => {
        navigation.navigate(Screens.History);
    }

    const handleMoveToWeb = () => {
        let key = title.toLowerCase()
        // navigation.navigate(Screens.WebScreen, {uri: GUIDE_URI[key]});
        Linking.openURL(GUIDE_URI[key]);
    }

    useEffect(() => {
        if(wallet.dstAddress !== ""){
            navigation.navigate(Screens.Send);
        }
    }, [wallet.dstAddress])

    useEffect(() => {
        Linking.getInitialURL()	
            .then(value => {
                if(value && deepLink !== value){
                    setDeepLink(value);
                }
        })
       
        Linking.addEventListener('url', (e) => {
            if(e.url && deepLink !== e.url){
                setDeepLink(e.url);
            }
        });
    }, [])

    useEffect(() => {
        if(common.lockStation === false){
            if(deepLink !== "" && deepLink !== undefined){
                let convertLink = deepLink.replace('firmastation', 'sign');
                ModalActions.handleModalData({qrcodeurl: convertLink})
            }
        }
    }, [deepLink, common.lockStation])

    useEffect(() => {
        if(common.appState === "background"){
            setDeepLink("");
        }
    }, [common.appState])

    useEffect(() => {
        if(modal.dappData){
            const transactionState = modal.dappData;
            ModalActions.handleDAppData(null);
            
            navigation.navigate(Screens.Transaction, {state: transactionState});
        }
    }, [modal.dappData])

    useEffect(() => {
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime("");
        CommonActions.handleLoggedIn(true);
    }, [])

    return (
        <TabContainer
            title={title}
            handleGuide={handleMoveToWeb}
            settingNavEvent={moveToSetting}
            historyNavEvent={moveToHistory}>
                <TabNavigators />
        </TabContainer>
    )
}

export default Home;