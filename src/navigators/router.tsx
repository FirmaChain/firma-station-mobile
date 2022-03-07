import React from "react";
import Progress from "@/components/parts/progress";
import CustomToast from "@/components/toast/customToast";
import { useAppSelector } from "@/redux/hooks";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import StackNavigator from "./stackNavigators";

const Router = () => {

    const {common} = useAppSelector(state => state);

    return (
        <NavigationContainer theme={DarkTheme}>
            <StackNavigator/>
            {common.loading && <Progress />}
            <CustomToast />
        </NavigationContainer>
    )
}

export default Router;