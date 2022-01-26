import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigators/stackNavigators";
import CustomToast from "./components/toast/customToast";
import { LogBox, StatusBar } from "react-native";
import { ApolloProvider, client } from "./apollo";
// import Progress from "./components/parts/progress";

export default function App() {

  LogBox.ignoreLogs(["[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!"]);

  return (
    <ApolloProvider client={client}>
      <StatusBar
        animated={true}
        barStyle={'light-content'} />
      <NavigationContainer>
        <StackNavigator/>
      </NavigationContainer>
      <CustomToast />
      {/* <Progress /> */}
    </ApolloProvider>
  )
}


