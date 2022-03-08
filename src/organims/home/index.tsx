import React, { useCallback } from "react";
import TabNavigators from "@/navigators/tabNavigators";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import SplashScreen from "react-native-splash-screen";
import TabContainer from "@/components/parts/containers/tabContainer";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface Props {
    title: string;
}

const Home = ({title}:Props) => {
    const navigation:ScreenNavgationProps = useNavigation();

    const moveToSetting = () => {
        navigation.navigate(Screens.Setting);
    }

    const moveToHistory = () => {
        navigation.navigate(Screens.History);
    }

    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                SplashScreen.hide();
            }, 1500);
            CommonActions.handleLoadingProgress(false);
        }, [])
    )

    return (
        <TabContainer
            title={title}
            settingNavEvent={moveToSetting}
            historyNavEvent={moveToHistory}>
                <TabNavigators />
        </TabContainer>
    )
}

export default Home;