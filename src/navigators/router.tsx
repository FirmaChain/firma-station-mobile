import React from "react";
import Progress from "@/components/parts/progress";
import CustomToast from "@/components/toast/customToast";
import { useAppSelector } from "@/redux/hooks";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import StackNavigator from "./stackNavigators";

const Router = () => {

    const commonState = useAppSelector(state => state.common);

    return (
        <NavigationContainer theme={DarkTheme}>
            <StackNavigator/>
            {commonState.loading && <Progress />}
            <CustomToast />
        </NavigationContainer>
    )
}

export default Router;