import React, { useCallback, useContext, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute, useFocusEffect, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Screens, StackParamList } from "@/navigators/appRoutes";
import WalletIcon from "react-native-vector-icons/Ionicons";
import StakingIcon from "react-native-vector-icons/AntDesign";
import TabContainer from "@/components/parts/containers/tabContainer";
import WalletScreen from "./wallet/wallet";
import StakingScreen from "./staking/staking";
import GovernanceScreen from "./governance/governance";
import { BoxDarkColor, GrayColor, WhiteColor } from "@/constants/theme";
import { Image } from "react-native";
import { ICON_DOCUMENT } from "@/constants/images";
import SplashScreen from "react-native-splash-screen";
import { useDelegationData, useStakingData } from "@/hooks/staking/hooks";
import { AppContext } from "@/util/context";
import { useBalanceData, useHistoryData } from "@/hooks/wallet/hooks";
import { CONTEXT_ACTIONS_TYPE } from "@/constants/common";
import { convertToFctNumber } from "@/util/common";

type ScreenNavgationProps = StackNavigationProp<StackParamList, Screens.Home>;

interface Props {
    route: {}
}

const Tab = createBottomTabNavigator();

const HomeScreen: React.FunctionComponent<Props> = (props) => {
    const navigation:ScreenNavgationProps = useNavigation();

    const [title, setTitle] = useState('Wallet');

    const {wallet, dispatchEvent} = useContext(AppContext);
    const { balance, getBalance } = useBalanceData(wallet.address);
    const { delegationState, handleDelegationState, handleDelegationPolling } = useDelegationData(wallet.address);
    const { recentHistory, handleCurrentHistoryState, handleCurrentHistoryPolling } = useHistoryData(wallet.address);
    const { stakingState, getStakingState, updateStakingState, getStakingComplete } = useStakingData(wallet.address);

    const stakingProps = {
        state: {
            stakingState,
            delegationState,
            handleDelegationState,
        }
    }

    const refreshForWallet = () => {
        getBalance();
        getStakingState();
        handleCurrentHistoryState && handleCurrentHistoryState();
    }

    const walletProps = {
        state: {
            stakingState,
            recentHistory,
            refreshForWallet,
        }
    }

    const moveToSetting = () => {
        navigation.navigate(Screens.Setting);
    }

    const moveToHistory = () => {
        navigation.navigate(Screens.History);
    }

    const handleCurrentDataPolling = (polling:boolean) => {
        handleCurrentHistoryState && handleCurrentHistoryState();
        handleCurrentHistoryPolling && handleCurrentHistoryPolling(polling);
        handleDelegationPolling(polling);

        if(polling && getStakingComplete){
            dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], true);
            setTimeout(() => {
                dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
            }, 1500);
        }
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
        let reward = 0;
        delegationState.map(value => {
            reward = reward + convertToFctNumber(value.reward);
        })
        updateStakingState(balance, reward);
    }, [delegationState])

    useEffect(() => {
        getStakingState();
        handleDelegationState();
    }, [recentHistory])

    useEffect(() => {
        if(getStakingComplete){
            dispatchEvent && dispatchEvent(CONTEXT_ACTIONS_TYPE["LOADING"], false);
        }
    }, [getStakingComplete])

    useFocusEffect(
        useCallback(() => {
            SplashScreen.hide();
            const routeName = getFocusedRouteNameFromRoute(props.route);
            if(routeName !== "Governance"){
                handleCurrentDataPolling(true);
            }
            return () => {
                handleCurrentDataPolling(false);
            }
        }, [])
    )

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
                    children={() => <WalletScreen {...walletProps}/>}
                    options={{
                        tabBarIcon: ({focused}) => {
                            return <WalletIcon name={'ios-wallet-outline'} size={24} color={focused? WhiteColor : GrayColor}/>
                        }
                    }}/>
                <Tab.Screen 
                    name={'Staking'} 
                    children={() => <StakingScreen {...stakingProps}/>}
                    options={{
                        tabBarIcon:
                        ({focused}) => {
                            return <StakingIcon name={'inbox'} size={24} color={focused? WhiteColor : GrayColor}/>
                        }
                    }}/>
                <Tab.Screen 
                    name={'Governance'} 
                    children={() => <GovernanceScreen />}
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