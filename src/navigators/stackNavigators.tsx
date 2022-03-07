import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Screens, StackParamList } from "./appRoutes";

import WelcomeScreen from '../screens/welcome/welcome';
import SelectWalletScreen from '../screens/welcome/selectWallet';
import RecoverWalletScreen from "@/screens/welcome/recoverWallet";

import CreateStepOneScreen from '../screens/createWallet/stepOne';
import CreateStepTwoScreen from '../screens/createWallet/stepTwo';
import CreateStepThreeScreen from '../screens/createWallet/stepThree';
import StepRecoverScreen from "@/screens/createWallet/stepRecover";

import HomeScreen from "../screens/home/home";

import SendScreen from "../screens/home/wallet/send";

import ValidatorScreen from "../screens/home/staking/validator";
import DelegateScreen from "../screens/home/staking/delegate";

import ProposalScreen from "../screens/home/governance/proposal";
import DepositScreen from "@/screens/home/governance/deposit";

import SettingScreen from "../screens/setting/setting";
import ChangePasswordScreen from "../screens/setting/changePassword";
import ExportWalletScreen from "../screens/setting/exportWallet";

import TransactionScreen from "../screens/transaction/transaction";
import LoginCheckScreen from "@/screens/loginCheck";
import HistoryScreen from "@/screens/home/history/history";

export const Stack = createStackNavigator<StackParamList>();
const StackNavigator = () => {
    return (
        <Stack.Navigator 
            screenOptions={{
                gestureDirection: "horizontal",
                cardStyleInterpolator: ({current, layouts}) => {
                    return {
                        cardStyle: {
                            transform: [{
                                translateX: current.progress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [layouts.screen.width, 0],
                                }),
                            },],
                        }
                    }
                }
            }}
            initialRouteName={Screens.LoginCheck}>
            <Stack.Screen
                options={{headerShown: false}}
                name={Screens.LoginCheck}
                component={LoginCheckScreen} />

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false, animationEnabled: false}}
                    name={Screens.Welcome}
                    component={WelcomeScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.SelectWallet}
                    component={SelectWalletScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.RecoverWallet}
                    component={RecoverWalletScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false, animationEnabled: false}}
                    name={Screens.Home}
                    component={HomeScreen} />
                
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.History}
                    component={HistoryScreen} />

                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Transaction}
                    component={TransactionScreen} />
            </Stack.Group>

            {/* Create Wallet */}
            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.CreateStepOne}
                    component={CreateStepOneScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.CreateStepTwo}
                    component={CreateStepTwoScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.CreateStepThree}
                    component={CreateStepThreeScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.StepRecover}
                    component={StepRecoverScreen} />
            </Stack.Group>
            
            {/* Setting */}
            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Setting}
                    component={SettingScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.ChangePassword}
                    component={ChangePasswordScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.ExportWallet}
                    component={ExportWalletScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Send}
                    component={SendScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Validator}
                    component={ValidatorScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Delegate}
                    component={DelegateScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Proposal}
                    component={ProposalScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Deposit}
                    component={DepositScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default StackNavigator;