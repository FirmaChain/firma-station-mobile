import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "../../navigators/stackNavigators";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WalletIcon from "react-native-vector-icons/Ionicons";
import ProposalsIcon from "react-native-vector-icons/Ionicons";
import StakingIcon from "react-native-vector-icons/FontAwesome";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import TabContainer from "../../components/parts/containers/tabContainer";
import WalletScreen from "./wallet/wallet";
import StakingScreen from "./staking/staking";
import GovernanceScreen from "./governance/governance";
import { BgColor, GrayColor, WhiteColor } from "@/constants/theme";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

export type HomeParams = {
    address: string;
    walletName: string;
}

interface HomeScreenProps {
    route: {params: HomeParams};
    navigation: ScreenNavgationProps;
}

const Tab = createBottomTabNavigator();

const HomeScreen: React.FunctionComponent<HomeScreenProps> = (props) => {
    const {navigation, route} = props;
    const {params} = route;
    const {address, walletName} = params;

    const [title, setTitle] = useState('Wallet');

    const moveToSetting = () => {
        navigation.navigate(Screens.Setting, {walletName:walletName});
    }

    useEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if(routeName === undefined) {
            setTitle('Wallet');
        } else {
            setTitle(routeName);
        }
    }, [getFocusedRouteNameFromRoute(route)]);

    return (
        <TabContainer
            title={title}
            navEvent={moveToSetting}>
            <Tab.Navigator 
                screenOptions={{ 
                    headerShown: false, 
                    tabBarStyle: { backgroundColor: BgColor, borderTopColor: BgColor},
                    tabBarActiveTintColor: WhiteColor,
                    tabBarInactiveTintColor: GrayColor,
                }}
                initialRouteName="Wallet">
                <Tab.Screen 
                    name={'Wallet'} 
                    component={WalletScreen} 
                    initialParams={{address: address, walletName: walletName}} 
                    options={{
                        tabBarIcon: ({focused}) => {
                            return <WalletIcon name={'ios-wallet-outline'} size={25} color={focused? WhiteColor : GrayColor}/>
                        }
                    }}/>
                <Tab.Screen 
                    name={'Staking'} 
                    component={StakingScreen} 
                    options={{
                        tabBarIcon:
                        ({focused}) => {
                            return <StakingIcon name={'handshake-o'} size={25} color={focused? WhiteColor : GrayColor}/>
                        }
                    }}/>
                <Tab.Screen 
                    name={'Governance'} 
                    component={GovernanceScreen} 
                    options={{
                        tabBarIcon: ({focused}) => {
                            return <ProposalsIcon name={'document-text-outline'} size={25} color={focused? WhiteColor : GrayColor}/>
                        }
                    }}/>
            </Tab.Navigator>
        </TabContainer>
    )
}

export default HomeScreen;