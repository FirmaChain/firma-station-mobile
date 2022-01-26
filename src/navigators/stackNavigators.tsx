import React, { useLayoutEffect, useState } from "react";
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

import WalletScreen from "../screens/home/wallet/wallet";
import SendScreen from "../screens/home/wallet/send";

import StakingScreen from "../screens/home/staking/staking";
import ValidatorScreen from "../screens/home/staking/validator";
import DelegateScreen from "../screens/home/staking/delegate";

import GovernanceScreen from "../screens/home/governance/governance";
import ProposalScreen from "../screens/home/governance/proposal";
import DepositScreen from "@/screens/home/governance/deposit";

import SettingScreen from "../screens/setting/setting";
import ChangePasswordScreen from "../screens/setting/changePassword";
import ExportPrivateKeyScreen from "../screens/setting/exportPrivateKey";

import TransactionScreen from "../screens/transaction/transaction";
import SplashScreen from "@/screens/splash";

export const Stack = createStackNavigator<StackParamList>();
const StackNavigator: React.FunctionComponent = () => {  
    return (
        <Stack.Navigator
            screenOptions={{
                presentation: "card",
            }}
            initialRouteName={Screens.Splash}>
            <Stack.Screen
                options={{headerShown: false}}
                name={Screens.Splash}
                component={SplashScreen} />

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
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
                    options={{headerShown: false}}
                    name={Screens.Home}
                    component={HomeScreen} />
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
                    name={Screens.ExportPrivateKey}
                    component={ExportPrivateKeyScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Wallet}
                    component={WalletScreen} />
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Send}
                    component={SendScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen
                    options={{headerShown: false}}
                    name={Screens.Staking}
                    component={StakingScreen} />
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
                    name={Screens.Governance}
                    component={GovernanceScreen} />
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
};

export default StackNavigator;