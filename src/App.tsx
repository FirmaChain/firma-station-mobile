import React, { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import { ApolloProvider, client } from "./apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux";
import store from "./redux/store";
import Router from "./navigators/router";

export default function App() {
  LogBox.ignoreLogs(["[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!"]);

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
      <Provider store={store}>
          <Router />
      </Provider>
    </ApolloProvider>
  )
}


