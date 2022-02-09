import React, { useContext, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { Screens, StackParamList } from "../../navigators/appRoutes";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WalletIcon from "react-native-vector-icons/Ionicons";
import StakingIcon from "react-native-vector-icons/AntDesign";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";
import TabContainer from "../../components/parts/containers/tabContainer";
import WalletScreen from "./wallet/wallet";
import StakingScreen from "./staking/staking";
import GovernanceScreen from "./governance/governance";
import { BoxDarkColor, GrayColor, WhiteColor } from "@/constants/theme";
import { Image } from "react-native";
import { ICON_DOCUMENT } from "@/constants/images";
import { useBalanceData, useHistoryData } from "@/hooks/wallet/hooks";
import { useStakingData, useValidatorData } from "@/hooks/staking/hooks";
import { useGovernanceList } from "@/hooks/governance/hooks";
import SplashScreen from "react-native-splash-screen";
import { AppContext } from "@/util/context";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface Props {
    route: {}
}

const Tab = createBottomTabNavigator();

const HomeScreen: React.FunctionComponent<Props> = (props) => {
    const navigation:ScreenNavgationProps = useNavigation();
    const { wallet } = useContext(AppContext);

    const { balance } = useBalanceData(wallet.address);
    const { historyList } = useHistoryData(wallet.address);
    const { stakingState } = useStakingData(wallet.address);
    const { validatorsState } = useValidatorData();
    const { governanceState } = useGovernanceList();

    const walletProps = {
        state:{
            balance,
            historyList,
            stakingState,
        }
    }

    const stakingProps = {
        state:{
            stakingState,
            validatorsState,
        }
    }

    const governanceProps = {
        state: {
            governanceState
        }
    }

    const [title, setTitle] = useState('Wallet');

    const moveToSetting = () => {
        navigation.navigate(Screens.Setting);
    }

    const moveToHistory = () => {
        navigation.navigate(Screens.Hisory, {historyData: historyList});
    }

    useEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(props.route);
        if(routeName === undefined){
            setTitle('Wallet');
        } else {
            setTitle(routeName);
        }
    }, [getFocusedRouteNameFromRoute(props.route)]);

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <TabContainer
            title={title}
            settingNavEvent={moveToSetting}
            historyNavEvent={moveToHistory}>
            <Tab.Navigator 
                screenOptions={{ 
                    headerShown: false, 
                    tabBarStyle: { backgroundColor: BoxDarkColor, borderTopColor: BoxDarkColor},
                    tabBarActiveTintColor: WhiteColor,
                    tabBarInactiveTintColor: GrayColor,
                }}
                initialRouteName="Wallet">
                <Tab.Screen 
                    name={'Wallet'} 
                    children={() => <WalletScreen {...walletProps} />}
                    options={{
                        tabBarIcon: ({focused}) => {
                            return <WalletIcon name={'ios-wallet-outline'} size={24} color={focused? WhiteColor : GrayColor}/>
                        }
                    }}/>
                <Tab.Screen 
                    name={'Staking'} 
                    children={() => <StakingScreen {...stakingProps} />}
                    options={{
                        tabBarIcon:
                        ({focused}) => {
                            return <StakingIcon name={'inbox'} size={24} color={focused? WhiteColor : GrayColor}/>
                        }
                    }}/>
                <Tab.Screen 
                    name={'Governance'} 
                    children={() => <GovernanceScreen {...governanceProps} />}
                    options={{
                        tabBarIcon: ({focused}) => {
                            return <Image style={{width: 24, height: 24, opacity: focused? 1: .6}} source={ICON_DOCUMENT}/>
                        }
                    }}/>
            </Tab.Navigator>
        </TabContainer>
    )
}

export default HomeScreen;