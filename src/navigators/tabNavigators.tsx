import React from "react";
import { Image, Platform } from "react-native";
import { BoxDarkColor, GrayColor, Lato, WhiteColor } from "@/constants/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WalletIcon from "react-native-vector-icons/Ionicons";
import StakingIcon from "react-native-vector-icons/AntDesign";
import { ICON_DOCUMENT } from "@/constants/images";
import WalletScreen from "@/screens/home/wallet/wallet";
import StakingScreen from "@/screens/home/staking/staking";
import GovernanceScreen from "@/screens/home/governance/governance";
import { CommonActions } from "@/redux/actions";

const Tab = createBottomTabNavigator();

const TabNavigators = () => {
    return (
        <Tab.Navigator 
            screenOptions={{ 
                headerShown: false, 
                tabBarStyle: { 
                    backgroundColor: BoxDarkColor, 
                    borderTopColor: BoxDarkColor,
                    height: Platform.OS === "android"? 58:82,
                    paddingTop: 4,
                    paddingBottom: Platform.OS === "android"?10:30,
                },
                tabBarActiveTintColor: WhiteColor,
                tabBarInactiveTintColor: GrayColor,
                tabBarLabelStyle: {
                    fontFamily: Lato,
                    fontSize: 12,
                }
            }}
            initialRouteName="Wallet">
        
            <Tab.Screen 
                name={'Wallet'} 
                children={() => <WalletScreen />}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    }
                })}
                options={{
                    tabBarIcon: ({focused}) => {
                        return <WalletIcon name={'ios-wallet-outline'} size={24} color={focused? WhiteColor : GrayColor}/>
                    }
                }}/>
            <Tab.Screen 
                name={'Staking'} 
                children={() => <StakingScreen />}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    }
                })}
                options={{
                    tabBarIcon:
                    ({focused}) => {
                        return <StakingIcon name={'inbox'} size={24} color={focused? WhiteColor : GrayColor}/>
                    }
                }}/>
            <Tab.Screen 
                name={'Governance'} 
                children={() => <GovernanceScreen />}
                listeners={() => ({
                    tabPress: () => {
                        CommonActions.handleScrollToTop(true);
                    }
                })}
                options={{
                    tabBarIcon: ({focused}) => {
                        return <Image style={{width: 24, height: 24, opacity: focused? 1: .6}} source={ICON_DOCUMENT}/>
                    }
                }}/>
        </Tab.Navigator>
    )
}

export default TabNavigators;