import React, { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import { Provider } from "react-redux";
import store from "./redux/store";
import Router from "./navigators/router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";

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

  const persistor = persistStore(store);
  
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StatusBar
          animated={true}
          barStyle={'light-content'} />
          <Router />
      </PersistGate>
    </Provider>
  )
}