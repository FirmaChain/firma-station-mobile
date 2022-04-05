import React, { useEffect } from "react";
import { LogBox, StatusBar } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store from "./redux/store";
import Router from "./navigators/router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import persistStore from "redux-persist/es/persistStore";
import AppStateManager from "./navigators/appStateManager";

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
            <AppStateManager />
        </PersistGate>
    </Provider>
    )
}