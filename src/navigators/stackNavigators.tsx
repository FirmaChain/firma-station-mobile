import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from '../screens/welcome/welcome';
import CreateStepOneScreen from '../screens/createWallet/stepOne';
import CreateStepTwoScreen, { CreateStepTwoParams } from '../screens/createWallet/stepTwo';
import CreateStepThreeScreen, { CreateStepThreeParams } from '../screens/createWallet/stepThree';
import SelectWalletScreen from '../screens/welcome/selectWallet';
import HomeScreen, { HomeParams } from "../screens/home/home";
import SettingScreen, { SettingParams } from "../screens/setting/setting";
import ChangePasswordScreen, { ChangePasswordParams } from "../screens/setting/changePassword";
import ExportPrivateKeyScreen, { ExportPrivateKeyParams } from "../screens/setting/exportPrivateKey";
import WalletScreen, { WalletParams } from "../screens/home/wallet/wallet";
import ValidatorScreen, { ValidatorParams } from "../screens/home/staking/validator";
import ProposalScreen, { ProposalParams } from "../screens/home/governance/proposal";
import GovernanceScreen from "../screens/home/governance/governance";
import StakingScreen from "../screens/home/staking/staking";
import SendScreen, { SendParams } from "../screens/home/wallet/send";
import DelegateScreen, { DelegateParams } from "../screens/home/staking/delegate";
import TransactionScreen from "../screens/transaction/transaction";
import RecoverWalletScreen from "@/screens/welcome/recoverWallet";
import StepRecoverScreen from "@/screens/createWallet/stepRecover";

export enum Screens {
    Welcome = 'Welcome',
    CreateStepOne = 'CreateStepOne',
    CreateStepTwo = 'CreateStepTwo',
    CreateStepThree = 'CreateStepThree',
    StepRecover = 'StepRecover',
    SelectWallet = 'SelectWallet',
    RecoverWallet = 'RecoverWallet',

    Home = 'Home',
    Transaction = 'Transaction',
    
    Wallet = 'Wallet',
    Send = 'Send',

    Staking = 'Staking',
    Validator = 'Validator',
    Delegate = 'Delegate',
    
    Governance = 'Governance',
    Proposal = "Proposal",

    Setting = 'Setting',
    ChangePassword = 'ChangePassword',
    ExportPrivateKey = 'ExportPrivateKey',
}

export type StackParamList = {
    Welcome: undefined;
    CreateStepOne: undefined;
    CreateStepTwo: CreateStepTwoParams;
    CreateStepThree: CreateStepThreeParams;
    StepRecover: undefined;
    SelectWallet: undefined;
    RecoverWallet: undefined;

    Home: HomeParams;
    Transaction: undefined;

    Wallet: WalletParams;
    Send: SendParams;

    Staking: undefined;
    Validator: ValidatorParams;
    Delegate: DelegateParams;

    Governance: undefined;
    Proposal: ProposalParams;

    Setting: SettingParams;
    ChangePassword: ChangePasswordParams;
    ExportPrivateKey: ExportPrivateKeyParams;
}

export const Stack = createStackNavigator<StackParamList>();
const StackNavigator: React.FunctionComponent = () => {
    return (
        <Stack.Navigator>
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
            </Stack.Group>

        </Stack.Navigator>
    );
};

export default StackNavigator;