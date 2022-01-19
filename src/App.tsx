import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigators/stackNavigators";
import CustomToast from "./components/toast/customToast";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        barStyle={'light-content'} />
      <StackNavigator />
      <CustomToast />
    </NavigationContainer>
  )
}