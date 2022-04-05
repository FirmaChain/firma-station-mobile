import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import { wait } from "@/util/common";
import TabContainer from "@/components/parts/containers/tabContainer";
import TabNavigators from "@/navigators/tabNavigators";
import { GUIDE_URI } from "@/../config";
import { Linking } from "react-native";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface Props {
    title: string;
}

const Home = ({title}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation();
    const {common} = useAppSelector(state => state);

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
        CommonActions.handleLockStation(false);
        CommonActions.handleAppPausedTime("");
        CommonActions.handleLoggedIn(true);
        wait(1500).then(() => {
            if(common.connect === true) {
                CommonActions.handleLoadingProgress(!common.connect);
            }
        })
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