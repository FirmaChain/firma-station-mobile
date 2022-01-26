import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigators/stackNavigators";
import CustomToast from "./components/toast/customToast";
import { StatusBar } from "react-native";
import { ApolloProvider, client } from "./apollo";
// import Progress from "./components/parts/progress";

export default function App() {
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


