import React, { useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import { CommonActions } from "@/redux/actions";
import { useAppSelector } from "@/redux/hooks";
import TabContainer from "@/components/parts/containers/tabContainer";
import TabNavigators from "@/navigators/tabNavigators";
import SplashScreen from "react-native-splash-screen";

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

    useFocusEffect(
        useCallback(() => {
            const timeout = setTimeout(() => {
                    SplashScreen.hide();
            }, 1500);

            if(common.connect === false) {
                clearTimeout(timeout);
            }
            CommonActions.handleLoadingProgress(!common.connect);
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