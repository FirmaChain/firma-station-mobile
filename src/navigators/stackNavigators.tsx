import History from '@/organisms/history';
import LoginCheck from '@/organisms/loginCheck';
import ChangePassword from '@/organisms/setting/changePassword';
import ChangeWalletName from '@/organisms/setting/changeWalletName';
import Setting from '@/organisms/setting/setting';
import Version from '@/organisms/setting/version';
import Restake from '@/organisms/staking/restake';
import Assets from '@/organisms/wallet/assets';
import Send from '@/organisms/wallet/send';
import Welcome from '@/organisms/welcome';
import RecoverWallet from '@/organisms/welcome/recoverWallet';
import SelectWallet from '@/organisms/welcome/selectWallet';
import StepRecoverScreen from '@/screens/createWallet/stepRecover';
import CW721Screen from '@/screens/home/assets/cw721';
import DappDetailScreen from '@/screens/home/dapps/dapp/dappDetail';
import NFTScreen from '@/screens/home/dapps/nft/nft';
import SendCW20Screen from '@/screens/home/dapps/sendCW20/sendCW20';
import SendCW721Screen from '@/screens/home/dapps/sendCW721/sendCW721';
import DepositScreen from '@/screens/home/governance/deposit';
import SendIBCScreen from '@/screens/home/wallet/sendIBC';
import WebScreen from '@/screens/webScreen';
import { createStackNavigator } from '@react-navigation/stack';

import CreateStepOneScreen from '../screens/createWallet/stepOne';
import CreateStepThreeScreen from '../screens/createWallet/stepThree';
import CreateStepTwoScreen from '../screens/createWallet/stepTwo';
import ProposalScreen from '../screens/home/governance/proposal';
import HomeScreen from '../screens/home/home';
import DelegateScreen from '../screens/home/staking/delegate';
import ValidatorScreen from '../screens/home/staking/validator';
import ExportWalletScreen from '../screens/setting/exportWallet';
import TransactionScreen from '../screens/transaction/transaction';
import { Screens, StackParamList } from './appRoutes';

export const Stack = createStackNavigator<StackParamList>();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureDirection: 'horizontal',
                cardStyleInterpolator: ({ current, layouts }) => {
                    return {
                        cardStyle: {
                            transform: [
                                {
                                    translateX: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.width, 0]
                                    })
                                }
                            ]
                        }
                    };
                }
            }}
            initialRouteName={Screens.LoginCheck}
        >
            <Stack.Screen options={{ headerShown: false }} name={Screens.LoginCheck} component={LoginCheck} />
            <Stack.Screen options={{ headerShown: false }} name={Screens.WebScreen} component={WebScreen} />

            <Stack.Group>
                <Stack.Screen options={{ headerShown: false, animation: 'none' }} name={Screens.Welcome} component={Welcome} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.SelectWallet} component={SelectWallet} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.RecoverWallet} component={RecoverWallet} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen options={{ headerShown: false, animation: 'none' }} name={Screens.Home} component={HomeScreen} />

                <Stack.Screen options={{ headerShown: false }} name={Screens.History} component={History} />

                <Stack.Screen
                    options={{ headerShown: false, animation: 'none' }}
                    name={Screens.Transaction}
                    component={TransactionScreen}
                />
            </Stack.Group>

            {/* Create Wallet */}
            <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name={Screens.CreateStepOne} component={CreateStepOneScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.CreateStepTwo} component={CreateStepTwoScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.CreateStepThree} component={CreateStepThreeScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.StepRecover} component={StepRecoverScreen} />
            </Stack.Group>

            {/* Setting */}
            <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name={Screens.Setting} component={Setting} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.ChangeWalletName} component={ChangeWalletName} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.ChangePassword} component={ChangePassword} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.ExportWallet} component={ExportWalletScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.Version} component={Version} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name={Screens.Send} component={Send} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.SendIBC} component={SendIBCScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.Assets} component={Assets} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.CW721} component={CW721Screen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name={Screens.Validator} component={ValidatorScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.Delegate} component={DelegateScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.Restake} component={Restake} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name={Screens.Proposal} component={ProposalScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.Deposit} component={DepositScreen} />
            </Stack.Group>

            <Stack.Group>
                <Stack.Screen options={{ headerShown: false }} name={Screens.DappDetail} component={DappDetailScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.NFT} component={NFTScreen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.SendCW20} component={SendCW20Screen} />
                <Stack.Screen options={{ headerShown: false }} name={Screens.SendCW721} component={SendCW721Screen} />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default StackNavigator;
