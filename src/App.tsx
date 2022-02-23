import React, { useEffect } from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import StackNavigator from "./navigators/stackNavigators";
import CustomToast from "./components/toast/customToast";
import { LogBox, StatusBar } from "react-native";
import { ApolloProvider, client } from "./apollo";
import { AppContext, DispatchContext } from "./util/context";
import Progress from "./components/parts/progress";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  LogBox.ignoreLogs(["[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!"]);

  const { isLoading, wallet, dispatchEvent } = DispatchContext();

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then(value => {
      if(value == null){
        AsyncStorage.setItem('alreadyLaunched', "Launched");
      }else{
      }}
    )
  }, [])
  
  return (
    <ApolloProvider client={client}>
      <StatusBar
        animated={true}
        barStyle={'light-content'} />
      <AppContext.Provider value={{dispatchEvent, isLoading, wallet}}>
        <NavigationContainer theme={DarkTheme}>
          <StackNavigator/>
          {isLoading && <Progress />}
        </NavigationContainer>
        <CustomToast />
      </AppContext.Provider>
    </ApolloProvider>
  )
}


